'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, UserPlus, Shield, Globe } from 'lucide-react';
import { shivaiDrive, DriveFile } from '@/lib/sdk';

export default function ShareModal({ isOpen, onClose, file }: { isOpen: boolean; onClose: () => void; file: DriveFile | null }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !email) return;

    setLoading(true);
    try {
      await shivaiDrive.shareWithEmail(file.id, email);
      alert(`Access granted to ${email} via ShivAI Neural Sync.`);
      setEmail('');
      onClose();
    } catch (err: any) {
      alert(`Sharing failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full" />
            
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center border border-blue-500/20">
                  <UserPlus className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Neural Sync</h3>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Share Neural Memory</p>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl mb-8 relative z-10">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg">
                    <Globe size={14} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none mb-1">Target Asset</p>
                    <p className="text-xs font-bold text-white truncate">{file?.name}</p>
                  </div>
               </div>
            </div>

            <form onSubmit={handleShare} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Identity Email</label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="ENTER SHIVAI ID..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:border-blue-500 transition-all text-xs tracking-widest"
                    required
                  />
                  <Send className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-700" size={16} />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                 <Shield className="text-emerald-500 shrink-0" size={16} />
                 <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest leading-relaxed">
                   Encryption key will be shared automatically via end-to-end secure tunnel.
                 </p>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 text-[10px]"
              >
                {loading ? 'Initializing Sync...' : 'Authorize Share'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
