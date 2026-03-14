import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';
import valvesData from '../data/valves.json';

export default function DeviceHealth() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-textH">Device Health</h1>
          <p className="text-textH/60">Overall network reliability metrics</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold flex items-center gap-2">
          <ShieldCheck size={20} /> Network Stable
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {valvesData.slice(0, 6).map(valve => (
          <div key={valve.device_id} className="glass-card p-6 rounded-3xl">
             <div className="flex justify-between items-start mb-4">
               <div>
                 <h2 className="text-lg font-bold text-textH">{valve.device_id}</h2>
                 <p className="text-xs text-textH/50">Last seen: 2 min ago</p>
               </div>
               <div className={`p-2 rounded-lg ${valve.battery < 20 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                 <HeartPulse size={20} />
               </div>
             </div>
             
             <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-textH/60 font-medium">Battery</span>
                    <span className="text-textH font-bold">{valve.battery}%</span>
                  </div>
                  <div className="h-2 bg-social-bg rounded-full overflow-hidden border border-border">
                    <div className={`h-full ${valve.battery < 20 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${valve.battery}%` }}></div>
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-textH/60 font-medium">Usage (cycles)</span>
                    <span className="text-textH font-bold">1,420</span>
                  </div>
                  <div className="h-2 bg-social-bg rounded-full overflow-hidden border border-border">
                    <div className="h-full bg-accent" style={{ width: '45%' }}></div>
                  </div>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-border">
                 <span className="text-xs font-medium text-textH/40">RSSI (Signal)</span>
                 <span className="text-sm font-bold text-textH/80">{valve.rssi} dBm</span>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
