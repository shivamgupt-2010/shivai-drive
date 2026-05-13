'use client';

import { Search, Bell, Grid, List, Zap, Plus, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TopBar({ user, onUpload }: { user: any, onUpload: () => void }) {
  return (
    <div className="h-24 border-b border-white/5 flex items-center justify-between px-10 sticky top-0 bg-[#050505]/50 backdrop-blur-3xl z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search neural memory..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-16 pr-6 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl">
          <Zap className="text-blue-400" size={14} />
          <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Neural Mode: ACTIVE</span>
        </div>

        <button 
          onClick={onUpload}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">Upload Memory</span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-white/10">
          <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all relative">
             <Bell size={20} />
             <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#050505]" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
             {user?.username?.[0]?.toUpperCase() || <User size={18} />}
          </div>
        </div>
      </div>
    </div>
  );
}
