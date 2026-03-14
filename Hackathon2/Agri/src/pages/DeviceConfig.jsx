import { Settings2, Save, Wifi, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useValves } from '../context/ValveContext';

export default function DeviceConfig() {
  const { valves } = useValves();
  const [selectedValve, setSelectedValve] = useState(valves[0]?.device_id || 'VALVE_001');

  const handleValveChange = (valveId) => {
    setSelectedValve(valveId);
  };
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-textH">Device Configuration</h1>
        <p className="text-textH/60">Manage parameters and connection limits</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl">
          {/* Valve Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-textH/60 mb-3">Select Valve to Configure</label>
            <div className="relative">
              <select
                value={selectedValve}
                onChange={(e) => handleValveChange(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-accent transition-colors pr-12"
              >
                {valves.map(valve => (
                  <option key={valve.device_id} value={valve.device_id}>
                    {valve.name || valve.device_id} - {valve.status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <Settings2 className="text-accent" />
            <h2 className="text-xl font-bold text-textH">{selectedValve} Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-textH/60 mb-2">Telemetry Interval (Mins)</label>
              <input type="range" min="5" max="60" defaultValue="15" className="w-full accent-accent bg-slate-800 h-2 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-xs text-textH/40 mt-2 font-bold select-none"><span>5m</span><span>60m</span></div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-textH/60 mb-2">Current Limit (Amperes)</label>
              <input type="number" defaultValue="7" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white placeholder-slate-400 outline-none focus:border-accent transition-colors" />
            </div>

            <div>
               <label className="block text-sm font-semibold text-textH/60 mb-2">Retry Attempts</label>
               <select className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 text-white outline-none focus:border-accent transition-colors">
                 <option>1</option><option>2</option><option selected>3</option><option>4</option><option>5</option>
               </select>
            </div>

            <button className="w-full bg-accent hover:bg-blue-500 text-textH py-3.5 rounded-xl font-bold transition flex items-center justify-center gap-2 mt-4 shadow-sm border border-accent">
               <Save size={18} /> Save Changes
            </button>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl">
           <div className="flex items-center gap-3 mb-6">
            <Wifi className="text-emerald-400" />
            <h2 className="text-xl font-bold text-textH">Network Interface</h2>
          </div>
          <div className="space-y-4">
             <div className="bg-social-bg p-4 rounded-2xl border border-border">
               <div className="text-xs font-bold text-textH/40 uppercase tracking-widest mb-1">MAC Address</div>
               <div className="font-mono text-textH">A4:C1:38:XX:YY:ZZ</div>
             </div>
             <div className="bg-social-bg p-4 rounded-2xl border border-border">
               <div className="text-xs font-bold text-textH/40 uppercase tracking-widest mb-1">IP Address</div>
               <div className="font-mono text-textH">192.168.1.101</div>
             </div>
             <div className="bg-social-bg p-4 rounded-2xl border border-border flex justify-between items-center">
               <div>
                  <div className="text-xs font-bold text-textH/40 uppercase tracking-widest mb-1">Connection State</div>
                  <div className="font-bold text-emerald-400">Connected</div>
               </div>
               <span className="relative flex h-3 w-3">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
               </span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
