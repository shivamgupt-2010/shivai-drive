'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Eye, EyeOff, Brain, 
  Activity, Lock, Save, RefreshCcw 
} from 'lucide-react';
import { shivaiDrive } from '@/lib/sdk';

export default function SettingsView() {
  const [settings, setSettings] = useState({
    is_public_profile: false,
    allow_neural_indexing: true,
    share_activity_log: true,
    two_factor_auth: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const data = await shivaiDrive.getPrivacySettings();
      if (data) setSettings(data);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await shivaiDrive.updatePrivacySettings(settings);
      alert('Neural configuration updated successfully.');
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center animate-pulse text-gray-500 font-black uppercase tracking-widest text-[10px]">Accessing Core Settings...</div>;

  return (
    <div className="max-w-4xl space-y-8 animate-materialize">
      <section className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20">
            <Shield className="text-blue-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Privacy Control</h2>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Manage your digital footprint in real time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <ToggleCard 
             title="Public Neural Profile" 
             description="Allow others to find your identity via email search."
             isActive={settings.is_public_profile}
             onClick={() => handleToggle('is_public_profile')}
             icon={settings.is_public_profile ? <Eye /> : <EyeOff />}
           />
           <ToggleCard 
             title="Neural Indexing" 
             description="Allow ShivAI to analyze and summarize your file contents."
             isActive={settings.allow_neural_indexing}
             onClick={() => handleToggle('allow_neural_indexing')}
             icon={<Brain />}
           />
           <ToggleCard 
             title="Activity Broadcasting" 
             description="Share your neural activity logs with the ecosystem timeline."
             isActive={settings.share_activity_log}
             onClick={() => handleToggle('share_activity_log')}
             icon={<Activity />}
           />
           <ToggleCard 
             title="Biometric Shield (2FA)" 
             description="Require a secondary biometric check for sensitive assets."
             isActive={settings.two_factor_auth}
             onClick={() => handleToggle('two_factor_auth')}
             icon={<Lock />}
           />
        </div>
      </section>

      <div className="pt-8 border-t border-white/5 flex justify-end">
         <button 
           onClick={handleSave}
           disabled={saving}
           className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 transition-all active:scale-95"
         >
           {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
           {saving ? 'UPDATING...' : 'SAVE CONFIGURATION'}
         </button>
      </div>
    </div>
  );
}

function ToggleCard({ title, description, isActive, onClick, icon }: any) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group relative overflow-hidden ${
        isActive ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'
      }`}
    >
      <div className={`mb-6 p-3 rounded-xl w-fit border ${isActive ? 'bg-blue-600/20 border-blue-500/20 text-blue-400' : 'bg-[#050505] border-white/10 text-gray-500'}`}>
        {icon}
      </div>
      <h3 className="text-sm font-black text-white uppercase tracking-widest italic mb-2">{title}</h3>
      <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase tracking-wider">{description}</p>
      
      <div className={`absolute top-8 right-8 w-12 h-6 rounded-full p-1 transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-800'}`}>
        <motion.div 
          animate={{ x: isActive ? 24 : 0 }}
          className="w-4 h-4 bg-white rounded-full shadow-lg"
        />
      </div>
    </div>
  );
}
