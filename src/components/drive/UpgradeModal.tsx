'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Shield, Brain, Crown } from 'lucide-react';

export default function UpgradeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const plans = [
    {
      name: 'ShivAI Basic',
      price: '₹0',
      description: 'Casual users',
      features: ['5 GB cloud storage', 'Basic AI search', '20 AI prompts/day', 'Standard speed'],
      icon: <Brain className="text-gray-400" />,
      color: 'border-white/10'
    },
    {
      name: 'ShivAI Plus',
      price: '₹199',
      description: 'Students & creators',
      features: ['100 GB storage', 'Unlimited AI chat', 'AI PDF understanding', 'Priority servers'],
      icon: <Zap className="text-blue-400" />,
      color: 'border-blue-500/50',
      popular: true
    },
    {
      name: 'ShivAI Pro',
      price: '₹799',
      description: 'Professionals',
      features: ['2 TB storage', 'AI Agent for files', 'Ecosystem Universal Search', 'Highest speed'],
      icon: <Shield className="text-emerald-400" />,
      color: 'border-emerald-500/50'
    },
    {
      name: 'ShivAI Ultra',
      price: '₹2499',
      description: 'Businesses',
      features: ['10 TB storage', 'Personal AI memory', 'Autonomous workflows', 'Custom AI personalities'],
      icon: <Crown className="text-amber-400" />,
      color: 'border-amber-500/50'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md" 
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors z-10">
              <X size={24} />
            </button>

            <div className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
                  Unlock the <span className="text-blue-500">Neural Ecosystem</span>
                </h2>
                <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">
                  Choose the intelligence tier that fits your digital life.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <div 
                    key={plan.name}
                    className={`relative p-8 rounded-[2.5rem] bg-white/5 border ${plan.color} flex flex-col group transition-all hover:bg-white/10`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase px-4 py-1 rounded-full tracking-widest shadow-lg shadow-blue-600/30">
                        Most Popular
                      </div>
                    )}
                    
                    <div className="mb-6">
                      <div className="w-12 h-12 bg-[#050505] rounded-2xl flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                        {plan.icon}
                      </div>
                      <h3 className="text-xl font-black text-white italic mb-1 uppercase">{plan.name}</h3>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{plan.description}</p>
                    </div>

                    <div className="mb-8">
                      <span className="text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-gray-500 text-xs font-bold uppercase tracking-widest"> / month</span>
                    </div>

                    <div className="space-y-4 flex-1 mb-8">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <Check size={14} className="text-blue-500 mt-0.5 shrink-0" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-tight">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${
                      plan.popular ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}>
                      Activate Tier
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                 <p className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                   Grandfathered rates available for yearly billing • 25% Savings applied
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
