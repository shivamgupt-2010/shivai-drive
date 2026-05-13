'use client';

import { motion } from 'framer-motion';
import { LayoutGrid, CheckCircle, ArrowRight, Target, Activity } from 'lucide-react';

export default function ProjectDashboard({ project }: { project: any }) {
  if (!project) return (
    <div className="h-64 flex items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem]">
       <p className="text-gray-600 text-sm font-black uppercase tracking-widest">No Active Project Workspace</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-materialize">
       <div className="bg-gradient-to-br from-blue-600/20 to-indigo-800/20 rounded-[3rem] border border-white/10 p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10">
             <LayoutGrid className="text-blue-500 opacity-20" size={120} />
          </div>
          
          <div className="relative z-10">
             <div className="flex items-center gap-4 mb-6">
                <span className="px-3 py-1 bg-blue-500 rounded-full text-[8px] font-black uppercase tracking-widest text-white">AI Generated</span>
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Project Hub</span>
             </div>
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">{project.name}</h2>
             <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">{project.goal}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                <Target size={18} className="text-blue-500" />
                Roadmap
             </h3>
             <div className="space-y-4">
                {project.roadmap.map((step: string, i: number) => (
                   <div key={i} className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/30 transition-all">
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400">
                         {i + 1}
                      </div>
                      <p className="text-sm font-medium text-gray-300">{step}</p>
                   </div>
                ))}
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                <Activity size={18} className="text-emerald-500" />
                Intelligence Score
             </h3>
             <div className="space-y-6">
                <Metric label="Success Prob." value="92%" color="bg-emerald-500" />
                <Metric label="Effort Estim." value="Medium" color="bg-blue-500" />
                <Metric label="Market Fit" value="Strong" color="bg-purple-500" />
             </div>
             <button className="w-full mt-10 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-blue-600/20">
                Execute with ShivAI AI
             </button>
          </div>
       </div>
    </div>
  );
}

function Metric({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center">
       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</span>
       <div className="flex items-center gap-4">
          <span className="text-xs font-black text-white tracking-tight">{value}</span>
          <div className={`w-2 h-2 rounded-full ${color} animate-pulse`} />
       </div>
    </div>
  );
}
