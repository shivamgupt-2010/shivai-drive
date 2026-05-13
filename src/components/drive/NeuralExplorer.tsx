'use client';

import { motion } from 'framer-motion';
import { Brain, Activity, Zap, Cpu, Network } from 'lucide-react';

export default function NeuralExplorer({ stats, insights, onRefresh }: { stats: any, insights: any[], onRefresh: () => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      {/* Neural Connectivity Graph (Visual) */}
      <div className="lg:col-span-2 bg-gradient-to-br from-blue-600/20 to-indigo-800/20 rounded-[3rem] border border-white/10 p-8 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
         
         <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                  <Brain className="text-blue-400" size={24} />
               </div>
               <div>
                  <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Neural Memory Index</h2>
                  <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.2em]">Ecosystem Intelligence Layer</p>
               </div>
            </div>

            <div className="flex-1 flex items-center justify-center py-12">
               {/* Visual placeholder for neural net */}
               <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                    className="w-48 h-48 border-2 border-dashed border-blue-500/20 rounded-full flex items-center justify-center"
                  >
                     <motion.div 
                       animate={{ rotate: -360 }}
                       transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                       className="w-32 h-32 border-2 border-dashed border-purple-500/30 rounded-full"
                     />
                  </motion.div>
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Cpu size={48} className="text-blue-500 animate-pulse" />
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-auto">
               <StatCard label="Patterns" value={stats.patterns} icon={<Network size={14} />} />
               <StatCard label="Cognition" value={stats.cognition} icon={<Activity size={14} />} />
               <StatCard label="Memory Load" value={stats.totalSize} icon={<Zap size={14} />} />
            </div>
         </div>
      </div>

      {/* Intelligence Dashboard */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-8 flex flex-col">
         <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic">AI Memory Insights</h3>
         
         <div className="space-y-6 flex-1">
            {insights.length > 0 ? insights.map((insight, i) => (
                <InsightItem 
                  key={i} 
                  label={insight.insight_type.replace('_', ' ')} 
                  value={typeof insight.content === 'string' && insight.content.startsWith('{') ? JSON.parse(insight.content).name : insight.content} 
                  status={`${Math.round(insight.confidence * 100)}%`} 
                />
            )) : (
              <p className="text-gray-600 text-[10px] font-bold uppercase text-center mt-20">No neural insights detected yet.</p>
            )}
         </div>

         <button 
           onClick={onRefresh}
           className="w-full mt-8 bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white"
         >
            Trigger Deep scan
         </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-[#050505]/40 border border-white/5 p-4 rounded-3xl backdrop-blur-md">
       <div className="flex items-center gap-2 mb-1">
          <div className="text-blue-400 opacity-70">{icon}</div>
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
       </div>
       <div className="text-sm font-black text-white tracking-tight">{value}</div>
    </div>
  );
}

function InsightItem({ label, value, status }: any) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
       <div>
          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-xs font-black text-white tracking-tight">{value}</p>
       </div>
       <span className="text-[9px] font-black uppercase tracking-widest text-blue-500 px-2 py-1 bg-blue-500/10 rounded-lg">{status}</span>
    </div>
  );
}
