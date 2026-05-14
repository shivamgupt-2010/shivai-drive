'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shivaiDrive, DriveFile } from '@/lib/sdk';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import NeuralExplorer from '@/components/drive/NeuralExplorer';
import FileGrid from '@/components/drive/FileGrid';
import ProjectDashboard from '@/components/drive/ProjectDashboard';
import { Cloud, Lock, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('drive');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [viewers, setViewers] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [stats, setStats] = useState<any>({ patterns: 0, cognition: 'Stable', syncDelay: '12ms', totalSize: '0 MB' });
  const [insights, setInsights] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = async (userId: string) => {
    const { data: files } = await shivaiDrive.supabase
      .from('drive_files')
      .select('size, ai_summary, ai_tags')
      .eq('user_id', userId)
      .eq('is_deleted', false);
    
    if (files) {
      const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
      const processedCount = files.filter(f => f.ai_summary).length;
      const totalTags = files.reduce((acc, f) => acc + (f.ai_tags?.length || 0), 0);
      
      setStats({
        patterns: totalTags + (processedCount * 2), 
        cognition: processedCount > 0 ? 'Enhanced' : 'Baseline',
        syncDelay: '12ms',
        totalSize: `${(totalSize / (1024 * 1024)).toFixed(1)} MB`
      });
    }

    const { data: aiInsights } = await shivaiDrive.supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (aiInsights) setInsights(aiInsights);
  };

  const fetchFiles = async (tab: string) => {
    setLoading(true);
    let filter: 'all' | 'shared' | 'trash' = 'all';
    if (tab === 'trash') filter = 'trash';
    if (tab === 'shared') filter = 'shared';
    
    const f = await shivaiDrive.getFiles(undefined, filter);
    setFiles(f);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const init = async () => {
      const u = await shivaiDrive.getCurrentUser();
      if (u) {
        const p = await shivaiDrive.getProfile(u.id);
        setUser({ ...u, ...p });
        fetchStats(u.id);

        // Fetch active project if exists
        const { data: insight } = await shivaiDrive.supabase
          .from('ai_insights')
          .select('*')
          .eq('user_id', u.id)
          .eq('insight_type', 'project_config')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        if (insight) setProject(JSON.parse(insight.content));

        // Real-time Collaboration (Presence)
        const channel = shivaiDrive.supabase.channel('drive_presence');
        channel
          .on('presence', { event: 'sync' }, () => {
            const state = channel.presenceState();
            const active = Object.values(state).flat();
            setViewers(active);
          })
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.track({ user: p?.username || u.email, online_at: new Date().toISOString() });
            }
          });
      }
      setLoading(false);
    };
    init();

    const { data: { subscription } } = shivaiDrive.onAuthStateChange(async (session) => {
      if (session) {
        const p = await shivaiDrive.getProfile(session.user.id);
        setUser({ ...session.user, ...p });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query) {
        fetchFiles(activeTab);
        return;
    }
    setLoading(true);
    const results = await shivaiDrive.semanticSearch(query);
    setFiles(results as any);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await shivaiDrive.uploadFile(file);
      fetchFiles(activeTab);
      if (user) fetchStats(user.id);
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (activeTab === 'trash') {
        if (confirm('Permanently delete this neural asset?')) {
          await shivaiDrive.permanentlyDeleteFile(id);
        }
      } else {
        await shivaiDrive.deleteFile(id);
      }
      fetchFiles(activeTab);
      if (user) fetchStats(user.id);
    } catch (err: any) {
      alert(`Operation failed: ${err.message}`);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await shivaiDrive.restoreFile(id);
      fetchFiles(activeTab);
    } catch (err: any) {
      alert(`Restore failed: ${err.message}`);
    }
  };

  const handleShare = async (id: string, status: boolean) => {
    try {
      await shivaiDrive.shareFile(id, status);
      fetchFiles(activeTab);
      alert(status ? 'Neural link shared.' : 'Neural link revoked.');
    } catch (err: any) {
      alert(`Sharing failed: ${err.message}`);
    }
  };

  const handleDeepScan = async () => {
    setLoading(true);
    try {
      await shivaiDrive.deepScan();
      fetchFiles(activeTab);
      if (user) fetchStats(user.id);
      alert('Deep scan initiated. Neural patterns are being indexed.');
    } catch (err: any) {
      alert(`Scan failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateWorkspace = async () => {
    setLoading(true);
    try {
      const config = await shivaiDrive.generateProjectWorkspace('root'); 
      setProject(config);
      alert('Workspace intelligence initialized.');
    } catch (err: any) {
      console.error(err);
      alert(`Generation failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) return <UnauthorizedState />;

  return (
    <main className="flex min-h-screen bg-[#050505]">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      
      <div className="flex-1 ml-72">
        <TopBar 
          user={user} 
          onUpload={() => fileInputRef.current?.click()} 
          onSearch={handleSearch}
          viewers={viewers}
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleUpload} 
          className="hidden" 
        />

        <div className="p-10 max-w-7xl mx-auto">
           {/* Section Header */}
           <div className="flex justify-between items-end mb-12">
              <div className="animate-materialize">
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
                    {activeTab === 'drive' ? 'My Space' : 
                     activeTab === 'neural' ? 'Neural Index' : 
                     activeTab === 'vault' ? 'Secure Vault' : 
                     activeTab === 'trash' ? 'Neural Waste' :
                     activeTab === 'shared' ? 'Shared Intelligence' : activeTab}
                 </h2>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">
                    {files.length} Intelligent Assets • Memory Health: Optimal
                 </p>
              </div>
           </div>

           {activeTab === 'neural' ? (
             <NeuralExplorer stats={stats} insights={insights} onRefresh={handleDeepScan} />
           ) : activeTab === 'projects' ? (
             <ProjectDashboard project={project} onGenerate={handleGenerateWorkspace} />
           ) : (
             <FileGrid 
                files={files} 
                loading={loading} 
                onDelete={handleDelete} 
                onRestore={handleRestore}
                onShare={handleShare}
                isTrash={activeTab === 'trash'}
             />
           )}
        </div>
      </div>

      {/* Neural Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] neural-gradient blur-[150px] rounded-full" />
      </div>
    </main>
  );
}

function UnauthorizedState() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await shivaiDrive.supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#050505] p-6 text-center">
       <div className="max-w-md w-full">
          <div className="w-20 h-24 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 flex items-center justify-center mx-auto mb-8">
             <ShieldCheck className="text-blue-500" size={40} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Neural Connection Offline</h1>
          <p className="text-gray-500 text-xs mb-10 leading-relaxed font-bold uppercase tracking-[0.2em]">
             Authentication required to access neural memory hub.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="IDENTITY EMAIL" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all text-xs tracking-widest"
              required
            />
            <input 
              type="password" 
              placeholder="IDENTITY PASSWORD" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-bold placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all text-xs tracking-widest"
              required
            />
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-xs"
            >
               {loading ? 'Synchronizing...' : 'Initialize Connection'}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-white/5">
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                Secure Tunnel via Supabase Root
             </p>
          </div>
       </div>
    </div>
  );
}
