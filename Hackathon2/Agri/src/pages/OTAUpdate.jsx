import { useState, useEffect } from 'react';
import { DownloadCloud, CloudCog, CheckCircle2, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function OTAUpdate() {
  const [firmwares, setFirmwares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('ready'); // ready, downloading, installing, success
  
  const currentVersion = "v1.0.8"; // This would normally come from a gateway status API
  
  useEffect(() => {
    fetchFirmwares();
  }, []);

  const fetchFirmwares = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/firmware');
      const data = await response.json();
      setFirmwares(data);
    } catch (error) {
      console.error('Error fetching firmware:', error);
    } finally {
      setLoading(false);
    }
  };

  const latestFirmware = firmwares.length > 0 ? firmwares[firmwares.length - 1] : {
    version: 'v1.1.0',
    description: '• Improved battery reporting accuracy\n• Fixed false-positive actuator friction alerts\n• Optimized network telemetry latency\n• Added support for remote parameter tweaking'
  };

  const handleUpdate = () => {
    setUpdating(true);
    setUpdateStatus('downloading');
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setUpdateStatus('installing');
        
        setTimeout(() => {
          setUpdateStatus('success');
          setUpdating(false);
        }, 2000);
      }
      setProgress(currentProgress);
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent animate-spin rounded-full"></div>
        <p className="text-slate-400 font-medium">Checking for updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/20 rounded-2xl border border-accent/30 shadow-inner text-accent">
            <CloudCog size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Firmware Management</h1>
            <p className="text-slate-400 font-medium">Over-the-air updates for gateway and nodes</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden group">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors duration-500"></div>
           
           <h2 className="text-2xl font-black text-white mb-8 tracking-tight flex items-center gap-3">
             Gateway GW-00004567
             {updateStatus === 'success' && <CheckCircle2 className="text-emerald-500" size={24} />}
           </h2>
           
           <div className="space-y-6 relative z-10">
             <div className="flex justify-between items-center bg-slate-800/50 backdrop-blur-md p-5 rounded-2xl border border-slate-700/50 group/item hover:border-slate-600 transition-colors">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">Current Version</span>
                <span className="font-mono text-lg font-black text-white">{updateStatus === 'success' ? latestFirmware.version : currentVersion}</span>
             </div>
             
             <div className={`flex justify-between items-center p-5 rounded-2xl border transition-all duration-500 ${updateStatus === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-accent/10 border-accent/30'}`}>
                <span className={`font-bold flex items-center gap-2 text-xs uppercase tracking-wider ${updateStatus === 'success' ? 'text-emerald-400' : 'text-accent'}`}>
                  {updateStatus === 'success' ? <CheckCircle2 size={18} /> : <DownloadCloud size={18} />} 
                  {updateStatus === 'success' ? 'System Up to Date' : 'Target Version'}
                </span>
                <span className="font-mono text-lg font-black text-white">{latestFirmware.version}</span>
             </div>

             <div className="pt-4">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-500">
                    {updateStatus === 'ready' && 'Awaiting Initiation'}
                    {updateStatus === 'downloading' && 'Downloading Firmware...'}
                    {updateStatus === 'installing' && 'Applying Update...'}
                    {updateStatus === 'success' && 'Update Complete'}
                  </span>
                  <span className={updateStatus === 'success' ? 'text-emerald-500' : 'text-accent'}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700 p-0.5">
                   <div 
                     className={`h-full rounded-full transition-all duration-300 ${updateStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-accent shadow-[0_0_10px_rgba(37,99,235,0.4)]'}`}
                     style={{ width: `${progress}%` }}
                   ></div>
                </div>
             </div>

             <button 
               onClick={handleUpdate}
               disabled={updating || updateStatus === 'success'}
               className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
                 updateStatus === 'success' 
                 ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600' 
                 : 'bg-accent hover:bg-blue-500 text-white shadow-accent/25 hover:shadow-accent/40 active:scale-95 border border-blue-400/30'
               }`}
             >
               {updating ? (
                 <>
                   <RefreshCcw size={20} className="animate-spin" />
                   {updateStatus === 'downloading' ? 'Downloading Package' : 'Writing to Flash'}
                 </>
               ) : updateStatus === 'success' ? (
                 'No Updates Available'
               ) : (
                 'Initiate OTA Update'
               )}
             </button>
           </div>
        </div>

        <div className="glass-card p-8 rounded-[2rem] border border-slate-700 shadow-xl bg-slate-900/30 relative overflow-hidden group">
           <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
           
           <h2 className="text-xl font-extrabold text-white mb-6 flex items-center gap-3 tracking-tight">
             <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
               <CheckCircle2 size={18} />
             </div>
             Release Notes {latestFirmware.version}
           </h2>
           
           <div className="space-y-4">
             {latestFirmware.description.split('\n').map((note, idx) => (
               <div key={idx} className="flex items-start gap-4 p-4 bg-slate-800/30 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors group/note">
                 <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent group-hover/note:scale-150 transition-transform"></div>
                 <p className="text-slate-300 font-medium leading-relaxed">
                   {note.startsWith('•') ? note.substring(1).trim() : note}
                 </p>
               </div>
             ))}
           </div>

           <div className="mt-8 p-5 bg-amber-500/10 rounded-2xl border border-amber-500/20 flex items-start gap-4">
              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
              <p className="text-[13px] text-amber-200/80 font-medium leading-relaxed">
                Ensure gateway power is stable during update. Node synchronization may take up to 10 minutes post-gateway reboot.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
