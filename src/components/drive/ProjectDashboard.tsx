'use client';

import { useState } from 'react';
import { LayoutGrid, CheckCircle, ArrowRight, Target, Activity, Loader2, Play } from 'lucide-react';

export default function ProjectDashboard({ project, onGenerate }: { project: any, onRefresh?: () => void, onGenerate?: () => void }) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [executing, setExecuting] = useState<number | null>(null);

  const handleExecute = (index: number) => {
    setExecuting(index);
    // Simulate execution of a neural task
    setTimeout(() => {
      setCompletedSteps(prev => [...prev, index]);
      setExecuting(null);
    }, 3000);
  };

  if (!project) return (
    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] p-10 text-center">
       <p className="text-gray-600 text-sm font-black uppercase tracking-widest mb-6">No Active Project Workspace</p>
       <button 
         onClick={onGenerate}
         className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-white"
       >
          Initialize Workspace Intelligence
       </button>
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
                <span className="px-3 py-1 bg-blue-500 rounded-full text-[8px] font-black uppercase tracking-widest text-white">AI Active</span>
                <span className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">Execution Hub</span>
             </div>
             <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">{project.name}</h2>
             <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">{project.goal}</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                <Target size={18} className="text-blue-500" />
                Live Roadmap
             </h3>
             <div className="space-y-4">
                {project.roadmap.map((step: string, i: number) => {
                   const isCompleted = completedSteps.includes(i);
                   const isExecuting = executing === i;

                   return (
                     <div key={i} className={`flex items-start justify-between gap-4 p-5 rounded-2xl border transition-all ${
                       isCompleted ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/5'
                     }`}>
                        <div className="flex items-start gap-4">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors ${
                             isCompleted ? 'bg-emerald-500 text-white' : 'bg-blue-500/20 text-blue-400'
                           }`}>
                              {isCompleted ? <CheckCircle size={14} /> : i + 1}
                           </div>
                           <div className="flex-1">
                              <p className={`text-sm font-bold uppercase tracking-tight ${isCompleted ? 'text-emerald-400 line-through opacity-50' : 'text-gray-200'}`}>
                                {step}
                              </p>
                              <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mt-1">
                                {isCompleted ? 'Completed' : isExecuting ? 'Processing Neural Action...' : 'Pending Action'}
                              </p>
                           </div>
                        </div>
                        
                        {!isCompleted && (
                          <button 
                            onClick={() => handleExecute(i)}
                            disabled={isExecuting}
                            className={`p-3 rounded-xl transition-all ${
                              isExecuting ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-gray-500 hover:bg-blue-600 hover:text-white'
                            }`}
                          >
                             {isExecuting ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
                          </button>
                        )}
                     </div>
                   );
                })}
             </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-[0.3em] mb-8 italic flex items-center gap-3">
                <Activity size={18} className="text-emerald-500" />
                Ecosystem Metrics
             </h3>
             <div className="space-y-6">
                <Metric label="Success Prob." value="92%" color="bg-emerald-500" />
                <Metric label="Effort Estim." value="Medium" color="bg-blue-500" />
                <Metric label="Market Fit" value="Strong" color="bg-purple-500" />
                <Metric label="AI Confidence" value="High" color="bg-blue-400" />
             </div>
             
             <div className="mt-10 p-6 bg-blue-600/5 border border-blue-600/10 rounded-2xl">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-relaxed">
                   Neural Engine is monitoring this workspace. Tasks are executed across the ShivAI Ecosystem.
                </p>
             </div>
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
