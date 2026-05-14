import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import axios from 'axios';

/**
 * PRODUCTION-GRADE SHIVAI DRIVE SDK (PGS-1)
 * Version: 1.0.0-DRIVE
 * Inherits from ShivAI Core Identity
 */

export interface ShivAIProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  identity_strength: number;
  trust_score: number;
  behavior_score: number;
  status: 'active' | 'suspended' | 'lockdown';
  is_verified: boolean;
  metadata: Record<string, any>;
}

export interface DriveFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  created_at: string;
  folder_id?: string;
  ai_summary?: string;
  ai_tags?: string[];
  importance_score?: number;
  is_encrypted: boolean;
  is_deleted: boolean;
  is_shared: boolean;
  metadata?: any;
}

export interface DriveFolder {
  id: string;
  name: string;
  parent_id?: string;
  created_at: string;
  is_vault: boolean;
}

export class ShivAIDriveSDK {
  private static instance: ShivAIDriveSDK;
  public supabase: SupabaseClient;

  private constructor(url: string, key: string) {
    this.supabase = createClient(url, key);
  }

  public static getInstance(url: string, key: string): ShivAIDriveSDK {
    if (!ShivAIDriveSDK.instance) {
      ShivAIDriveSDK.instance = new ShivAIDriveSDK(url, key);
    }
    return ShivAIDriveSDK.instance;
  }

  // AUTH (Synced with Identity)
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async getProfile(userId: string): Promise<ShivAIProfile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data as ShivAIProfile;
  }

  // SUBSCRIPTION & STORAGE
  async getStorageUsage(): Promise<{ used: number, limit: number, tier: string }> {
    const user = await this.getCurrentUser();
    if (!user) return { used: 0, limit: 5368709120, tier: 'Free' };

    const { data: usage } = await this.supabase.rpc('get_user_storage_usage', { p_user_id: user.id });
    const { data: sub } = await this.supabase.from('user_subscriptions').select('*').eq('user_id', user.id).single();

    return {
      used: usage || 0,
      limit: sub?.storage_limit || 5368709120,
      tier: sub?.tier || 'Free'
    };
  }

  // SHARING
  async shareWithEmail(fileId: string, email: string): Promise<void> {
    const { error } = await this.supabase
      .from('file_shares')
      .insert({ file_id: fileId, shared_with_email: email });
    if (error) throw error;
  }

  // PRIVACY SETTINGS
  async getPrivacySettings(): Promise<any> {
    const user = await this.getCurrentUser();
    if (!user) return null;
    const { data } = await this.supabase.from('user_privacy_settings').select('*').eq('user_id', user.id).single();
    return data;
  }

  async updatePrivacySettings(settings: any): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) return;
    await this.supabase.from('user_privacy_settings').upsert({ user_id: user.id, ...settings });
  }

  // STORAGE CORE
  async uploadFile(file: File, folderId?: string): Promise<DriveFile | null> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${user.id}/${fileName}`;

    const { data: storageData, error: storageError } = await this.supabase.storage
      .from('drive')
      .upload(filePath, file);

    if (storageError) throw storageError;

    const { data: { publicUrl } } = this.supabase.storage
      .from('drive')
      .getPublicUrl(filePath);

    // Register in DB
    const { data: dbFile, error: dbError } = await this.supabase
      .from('drive_files')
      .insert({
        user_id: user.id,
        name: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl,
        folder_id: folderId,
        is_deleted: false,
        is_shared: false,
        metadata: { path: filePath }
      })
      .select()
      .single();

    if (dbError) throw dbError;

    // Trigger AI Processing
    this.processNeuralMetadata(dbFile.id);

    return dbFile;
  }

  // SOFT DELETE & RESTORE
  async deleteFile(fileId: string): Promise<void> {
    await this.supabase
      .from('drive_files')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', fileId);
  }

  async restoreFile(fileId: string): Promise<void> {
    await this.supabase
      .from('drive_files')
      .update({ is_deleted: false, updated_at: new Date().toISOString() })
      .eq('id', fileId);
  }

  async permanentlyDeleteFile(fileId: string): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const { data: file } = await this.supabase
      .from('drive_files')
      .select('metadata')
      .eq('id', fileId)
      .single();

    if (file?.metadata?.path) {
      await this.supabase.storage.from('drive').remove([file.metadata.path]);
    }

    await this.supabase.from('drive_files').delete().eq('id', fileId);
    await this.supabase.from('ai_memory').delete().eq('metadata->fileId', fileId);
  }

  // SHARING
  async shareFile(fileId: string, status: boolean = true): Promise<void> {
    await this.supabase
      .from('drive_files')
      .update({ is_shared: status, updated_at: new Date().toISOString() })
      .eq('id', fileId);
  }

  async getFiles(folderId?: string, filter: 'all' | 'shared' | 'trash' = 'all'): Promise<DriveFile[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    let query = this.supabase
      .from('drive_files')
      .select('*')
      .eq('user_id', user.id);

    if (filter === 'trash') {
      query = query.eq('is_deleted', true);
    } else if (filter === 'shared') {
      query = query.eq('is_shared', true).eq('is_deleted', false);
    } else {
      query = query.eq('is_deleted', false);
      if (folderId) {
        query = query.eq('folder_id', folderId);
      } else {
        query = query.is('folder_id', null);
      }
    }

    const { data } = await query.order('created_at', { ascending: false });
    return data || [];
  }

  async getFolders(parentId?: string): Promise<DriveFolder[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    let query = this.supabase
      .from('drive_folders')
      .select('*')
      .eq('user_id', user.id);

    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else {
      query = query.is('parent_id', null);
    }

    const { data } = await query.order('name');
    return data || [];
  }

  async deepScan(): Promise<void> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const { data: files } = await this.supabase
      .from('drive_files')
      .select('id')
      .eq('user_id', user.id);

    if (files) {
      for (const file of files) {
        await this.processNeuralMetadata(file.id);
      }
    }
  }

  async createFolder(name: string, parentId?: string, isVault: boolean = false): Promise<DriveFolder> {
    const user = await this.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const { data, error } = await this.supabase
      .from('drive_folders')
      .insert({
        user_id: user.id,
        name,
        parent_id: parentId,
        is_vault: isVault
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // NEURAL INTELLIGENCE (REAL)
  private async processNeuralMetadata(fileId: string) {
    const user = await this.getCurrentUser();
    if (!user) return;

    try {
        const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'https://shivai-orchestrator.vercel.app';
        // Call the AI Orchestrator
        await axios.post(`${orchestratorUrl}/process-file`, {
            fileId,
            userId: user.id
        });
    } catch (err) {
        console.warn("AI Orchestrator unreachable. Falling back to background tasks.");
    }
  }

  async semanticSearch(query: string): Promise<any[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    try {
        const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'https://shivai-orchestrator.vercel.app';
        const response = await axios.post(`${orchestratorUrl}/search`, {
            query,
            userId: user.id
        });
        return response.data;
    } catch (err) {
        // Fallback to basic search
        return this.searchFiles(query);
    }
  }

  async searchFiles(query: string): Promise<DriveFile[]> {
    const user = await this.getCurrentUser();
    if (!user) return [];

    const { data } = await this.supabase
      .from('drive_files')
      .select('*')
      .eq('user_id', user.id)
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false });

    return data || [];
  }

  async generateProjectWorkspace(folderId: string): Promise<any> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    const orchestratorUrl = process.env.NEXT_PUBLIC_ORCHESTRATOR_URL || 'https://shivai-orchestrator.vercel.app';
    const response = await axios.post(`${orchestratorUrl}/generate-workspace`, {
        folderId,
        userId: user.id
    });
    return response.data;
  }

  onAuthStateChange(callback: (session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }

  async logout() {
    await this.supabase.auth.signOut();
  }
}

export const shivaiDrive = ShivAIDriveSDK.getInstance(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
