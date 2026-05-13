'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shivaiDrive, DriveFile } from '@/lib/sdk';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import NeuralExplorer from '@/components/drive/NeuralExplorer';
import FileGrid from '@/components/drive/FileGrid';
import { Cloud, Lock, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('drive');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const init = async () => {
      const u = await shivaiDrive.getCurrentUser();
      if (u) {
        const p = await shivaiDrive.getProfile(u.id);
        setUser({ ...u, ...p });
        const f = await shivaiDrive.getFiles();
        setFiles(f);
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await shivaiDrive.uploadFile(file);
      const f = await shivaiDrive.getFiles();
      setFiles(f);
    } catch (err) {
      console.error(err);
      alert('Upload failed. Ensure Supabase Storage bucket "drive" exists.');
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) return <UnauthorizedState />;

  return (
    <main className="flex min-h-screen bg-[#050505]">
      <Sidebar active={activeTab} onChange={setActiveTab} />
      
      <div className="flex-1 ml-72">
        <TopBar user={user} onUpload={() => fileInputRef.current?.click()} />
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
                     activeTab === 'vault' ? 'Secure Vault' : activeTab}
                 </h2>
                 <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em]">
                    {files.length} Intelligent Assets • Memory Health: Optimal
                 </p>
              </div>
           </div>

           {activeTab === 'neural' ? (
             <NeuralExplorer stats={{}} />
           ) : (
             <FileGrid files={files} loading={loading} />
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
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#050505] p-6 text-center">
       <div className="max-w-md">
          <div className="w-24 h-24 bg-red-500/10 rounded-[2.5rem] border border-red-500/20 flex items-center justify-center mx-auto mb-10">
             <Lock className="text-red-500" size={40} />
          </div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter mb-4">Neural Connection Offline</h1>
          <p className="text-gray-500 text-sm mb-12 leading-relaxed font-medium uppercase tracking-widest">
             ShivAI Identity synchronization required to access neural memory.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
             Return to Gateway
          </button>
       </div>
    </div>
  );
}
