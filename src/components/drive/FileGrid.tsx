'use client';

import { motion } from 'framer-motion';
import { 
  FileText, Image as ImageIcon, Video, Music, 
  MoreVertical, Share2, Download, Trash2, Shield
} from 'lucide-react';
import { DriveFile } from '@/lib/sdk';

export default function FileGrid({ files, loading, onDelete }: { files: DriveFile[], loading: boolean, onDelete: (id: string) => void }) {
  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {[1,2,3,4,5,6,7,8].map(i => (
         <div key={i} className="h-48 bg-white/5 rounded-[2.5rem] border border-white/5 animate-pulse" />
       ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
       {files.map((file, i) => (
         <motion.div
           key={file.id}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: i * 0.05 }}
           className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-6 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
         >
           <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           
           <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="w-12 h-12 bg-[#050505]/60 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all">
                 <FileIcon type={file.type} />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm('Delete permanently?')) onDelete(file.id); }}
                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
           </div>

           <div className="relative z-10" onClick={() => window.open(file.url, '_blank')}>
              <h3 className="text-sm font-black text-white truncate mb-1 group-hover:text-blue-400 transition-colors">{file.name}</h3>
              <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
              </p>
           </div>

           <div className="mt-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${file.ai_summary ? 'bg-blue-500 shadow-[0_0_8px_#3b82f6]' : 'bg-gray-600'}`} />
                 <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${file.ai_summary ? 'text-blue-400' : 'text-gray-600'}`}>
                    {file.ai_summary ? 'Neural Indexed' : 'Pending Sync'}
                 </span>
              </div>
              {file.is_encrypted && <Shield size={14} className="text-emerald-500" />}
           </div>

           {/* Quick Actions Overlay */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100 z-20">
              <a href={file.url} download target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                <ActionButton icon={<Download size={16} />} label="GET" />
              </a>
              <ActionButton icon={<Share2 size={16} />} label="SHARE" onClick={(e: any) => {
                 e.stopPropagation();
                 navigator.clipboard.writeText(file.url);
                 alert('Neural link copied to clipboard.');
              }} />
           </div>
         </motion.div>
       ))}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type.includes('image')) return <ImageIcon className="text-purple-400" size={20} />;
  if (type.includes('video')) return <Video className="text-orange-400" size={20} />;
  if (type.includes('audio')) return <Music className="text-pink-400" size={20} />;
  return <FileText className="text-blue-400" size={20} />;
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="flex flex-col items-center gap-1 bg-[#050505]/90 border border-white/20 p-3 rounded-2xl hover:bg-blue-600 hover:border-blue-500 transition-all">
       {icon}
       <span className="text-[8px] font-black">{label}</span>
    </button>
  );
}
