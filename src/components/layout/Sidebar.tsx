'use client';

import { motion } from 'framer-motion';
import { 
  Cloud, HardDrive, Shield, Share2, 
  Trash2, Brain, Zap, Clock, Folder, 
  Plus, Settings, LayoutGrid
} from 'lucide-react';

export default function Sidebar({ active, onChange }: { active: string, onChange: (v: string) => void }) {
  const menuItems = [
    { id: 'drive', label: 'My Space', icon: HardDrive },
    { id: 'neural', label: 'Neural Index', icon: Brain },
    { id: 'shared', label: 'Ecosystem Sync', icon: Share2 },
    { id: 'vault', label: 'Secure Vault', icon: Shield },
    { id: 'recent', label: 'Memory Stream', icon: Clock },
    { id: 'trash', label: 'Discarded', icon: Trash2 },
  ];

  return (
    <div className="w-72 h-screen border-r border-white/5 flex flex-col p-6 fixed left-0 top-0 bg-[#050505]/50 backdrop-blur-3xl z-50">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Cloud className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-black italic tracking-tighter">SHIVAI <span className="text-blue-500">DRIVE</span></h1>
          <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-500/50">Neural Memory Hub</p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all group ${
              active === item.id 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
              : 'text-gray-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon size={20} className={active === item.id ? 'text-white' : 'group-hover:text-blue-400'} />
            <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-6">
        {/* Storage Stats */}
        <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
          <div className="flex justify-between items-center mb-3">
             <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest leading-none">Intelligence Cache</span>
             <span className="text-[10px] font-black text-blue-400">12% Used</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '12%' }}
              className="h-full bg-blue-500"
            />
          </div>
          <p className="text-[9px] text-gray-600 mt-2 font-medium">Synced with Identity Hub</p>
        </div>

        <div className="flex items-center justify-between px-2">
           <button className="p-2 text-gray-500 hover:text-white transition-colors"><Settings size={18} /></button>
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors">
              <Zap size={14} /> Upgrade AI
           </button>
        </div>
      </div>
    </div>
  );
}
