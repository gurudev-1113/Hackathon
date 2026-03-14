import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Droplet, Zap, AlertTriangle } from 'lucide-react';
import { useValves } from '../context/ValveContext';

// Generates simulated daily data from a valve's telemetry for a 7-day week
function generateWeeklyData(valve, seed) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Use valve properties to seed variation so each valve/farm looks different
  const base = seed || 0;
  return days.map((day, i) => {
    const variation = Math.sin(base + i * 1.3) * 25 + Math.cos(base * 0.7 + i) * 15;
    return {
      day,
      value: Math.max(5, Math.min(95, 50 + variation))
    };
  });
}

export default function Reports() {
  const { valves, alerts } = useValves();

  // Split valves into two "farms" based on their index
  const farmValves = useMemo(() => {
    const wells = valves.filter(v => v.type === 'WELL');
    const valveOnly = valves.filter(v => v.type === 'VALVE');
    const mid = Math.ceil(valveOnly.length / 2);
    return {
      'Farm A': [...wells, ...valveOnly.slice(0, mid)],
      'Farm B': valveOnly.slice(mid)
    };
  }, [valves]);

  const [waterFarm, setWaterFarm] = useState('Farm A');
  const [activityFarm, setActivityFarm] = useState('Farm A');
  const [efficiencyFarm, setEfficiencyFarm] = useState('Farm A');
  const [energyFarm, setEnergyFarm] = useState('Farm A');

  // Generate chart data based on selected farm's valves
  const waterUsageData = useMemo(() => {
    const fv = farmValves[waterFarm] || [];
    if (fv.length === 0) return generateWeeklyData(null, 1);
    // Aggregate flow_rate-based water usage across all farm valves
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      let total = 0;
      fv.forEach((v, vi) => {
        const flowBase = v.flow_rate || (v.status === 'OPEN' ? 120 : 10);
        const variation = Math.sin((vi + 1) * 2.1 + i * 0.9) * 30 + Math.cos(i * 1.5 + vi) * 20;
        total += Math.max(5, Math.min(95, (flowBase / 3) + variation));
      });
      return { day, value: Math.max(5, Math.min(95, total / Math.max(fv.length, 1))) };
    });
  }, [waterFarm, farmValves]);

  const valveActivityData = useMemo(() => {
    const fv = farmValves[activityFarm] || [];
    if (fv.length === 0) return generateWeeklyData(null, 3);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      let total = 0;
      fv.forEach((v, vi) => {
        const activeBase = v.status === 'OPEN' ? 70 : 20;
        const motorFactor = (v.motor_current || 0) * 5;
        const variation = Math.sin((vi + 1) * 1.7 + i * 1.1) * 20 + Math.cos(i * 0.8 + vi * 2) * 15;
        total += Math.max(5, Math.min(95, activeBase + motorFactor + variation));
      });
      return { day, value: Math.max(5, Math.min(95, total / Math.max(fv.length, 1))) };
    });
  }, [activityFarm, farmValves]);

  const efficiencyData = useMemo(() => {
    const fv = farmValves[efficiencyFarm] || [];
    if (fv.length === 0) return generateWeeklyData(null, 5);
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'];
    return weeks.map((week, i) => {
      let total = 0;
      fv.forEach((v, vi) => {
        const battBase = (v.battery || 50);
        const tempFactor = ((v.temperature || 28) - 25) * 2;
        const variation = Math.sin((vi + 1) * 0.9 + i * 1.6) * 15 + Math.cos(i * 1.2 + vi * 0.5) * 10;
        total += Math.max(20, Math.min(98, battBase - tempFactor + variation));
      });
      return { label: week, value: Math.max(20, Math.min(98, total / Math.max(fv.length, 1))) };
    });
  }, [efficiencyFarm, farmValves]);

  const energyData = useMemo(() => {
    const fv = farmValves[energyFarm] || [];
    if (fv.length === 0) return generateWeeklyData(null, 7);
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      let total = 0;
      fv.forEach((v, vi) => {
        const motorBase = (v.motor_current || 0) * 8;
        const activeBase = v.status === 'OPEN' ? 25 : 8;
        const variation = Math.sin((vi + 1) * 1.3 + i * 0.7) * 12 + Math.cos(i * 2.1 + vi * 1.1) * 8;
        total += Math.max(5, Math.min(90, activeBase + motorBase + variation));
      });
      return { day, value: Math.max(5, Math.min(90, total / Math.max(fv.length, 1))) };
    });
  }, [energyFarm, farmValves]);

  // Farm-specific alerts
  const farmAlerts = useMemo(() => {
    const farmAIds = new Set((farmValves['Farm A'] || []).map(v => v.device_id));
    const farmBIds = new Set((farmValves['Farm B'] || []).map(v => v.device_id));
    return {
      'Farm A': alerts.filter(a => farmAIds.has(a.device_id)),
      'Farm B': alerts.filter(a => farmBIds.has(a.device_id))
    };
  }, [alerts, farmValves]);

  const farmNames = Object.keys(farmValves);

  const FarmSelect = ({ value, onChange }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-600 text-sm p-1.5 rounded-lg text-white outline-none focus:border-accent transition-colors cursor-pointer"
    >
      {farmNames.map(name => (
        <option key={name} value={name}>{name} ({(farmValves[name] || []).length} valves)</option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-textH">Reports & Analytics</h1>
        <p className="text-textH/60">Dynamic data driven by your valve network telemetry</p>
      </header>

      {/* Farm Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[10px] font-black text-textH/40 uppercase tracking-widest mb-1">Total Valves</p>
          <p className="text-2xl font-black text-textH">{valves.length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[10px] font-black text-textH/40 uppercase tracking-widest mb-1">Farm A Valves</p>
          <p className="text-2xl font-black text-blue-400">{(farmValves['Farm A'] || []).length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[10px] font-black text-textH/40 uppercase tracking-widest mb-1">Farm B Valves</p>
          <p className="text-2xl font-black text-emerald-400">{(farmValves['Farm B'] || []).length}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl">
          <p className="text-[10px] font-black text-textH/40 uppercase tracking-widest mb-1">Active Alerts</p>
          <p className="text-2xl font-black text-red-400">{alerts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Water Usage - Line Graph */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-textH flex items-center gap-2">
              <Droplet className="text-emerald-400" size={22} /> Water Usage
            </h2>
            <FarmSelect value={waterFarm} onChange={setWaterFarm} />
          </div>
          <div className="h-64 border-b border-l border-border pb-2 pl-2 relative">
            <svg viewBox="0 0 600 240" className="w-full h-full" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map(pct => (
                <line key={pct} x1="0" y1={240 - (pct / 100) * 240} x2="600" y2={240 - (pct / 100) * 240}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {/* Filled area under the line */}
              <polygon
                points={`0,240 ${waterUsageData.map((d, i) => `${(i / 6) * 600},${240 - (d.value / 100) * 240}`).join(' ')} 600,240`}
                fill="url(#waterGradient)"
              />
              {/* Line */}
              <polyline
                points={waterUsageData.map((d, i) => `${(i / 6) * 600},${240 - (d.value / 100) * 240}`).join(' ')}
                fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              />
              {/* Dots */}
              {waterUsageData.map((d, i) => (
                <g key={i}>
                  <circle cx={(i / 6) * 600} cy={240 - (d.value / 100) * 240} r="5" fill="#10b981" stroke="#0d9668" strokeWidth="2" />
                  <circle cx={(i / 6) * 600} cy={240 - (d.value / 100) * 240} r="12" fill="transparent" className="cursor-pointer">
                    <title>{d.day}: {Math.round(d.value)}%</title>
                  </circle>
                </g>
              ))}
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="flex justify-between text-xs text-textH/50 mt-2 pl-2">
            {waterUsageData.map((d, i) => <span key={i}>{d.day}</span>)}
          </div>
        </div>

        {/* Valve Activity */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-textH flex items-center gap-2">
              <TrendingUp className="text-emerald-400" size={22} /> Valve Activity
            </h2>
            <FarmSelect value={activityFarm} onChange={setActivityFarm} />
          </div>
          <div className="h-64 flex items-end gap-2 justify-between mt-auto border-b border-l border-border pb-2 pl-2">
            {valveActivityData.map((d, i) => (
              <div key={i} className="w-full h-full flex flex-col justify-end relative group">
                <div
                  className="w-full bg-emerald-500/40 hover:bg-emerald-500 rounded-t-sm transition-all duration-300 relative"
                  style={{ height: `${d.value}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(d.value)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-textH/50 mt-2 pl-2">
            {valveActivityData.map((d, i) => <span key={i}>{d.day}</span>)}
          </div>
        </div>

        {/* System Efficiency */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-textH flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
                <TrendingUp size={20} />
              </div>
              System Efficiency
            </h2>
            <FarmSelect value={efficiencyFarm} onChange={setEfficiencyFarm} />
          </div>
          <div className="h-64 flex items-end gap-2 justify-between mt-auto border-b border-l border-border pb-2 pl-2 relative">
            {efficiencyData.map((d, i) => (
              <div key={i} className="w-full flex flex-col justify-end group cursor-pointer" style={{ height: '100%' }}>
                <div
                  className="w-full bg-gradient-to-t from-blue-500/10 to-blue-400/50 hover:to-blue-400/70 rounded-t-sm transition-all duration-300 relative"
                  style={{ height: `${d.value}%` }}
                >
                  <div className="h-1 w-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]"></div>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(d.value)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-textH/50 mt-2 pl-2">
            {efficiencyData.map((d, i) => <span key={i}>{d.label}</span>)}
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-textH flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-yellow-500/20 text-yellow-500">
                <Zap size={20} />
              </div>
              Energy Consumption
            </h2>
            <FarmSelect value={energyFarm} onChange={setEnergyFarm} />
          </div>
          <div className="h-64 flex items-end gap-2 justify-between mt-auto border-b border-l border-border pb-2 pl-2">
            {energyData.map((d, i) => (
              <div key={i} className="w-full h-full flex flex-col justify-end relative group">
                <div
                  className="w-full bg-yellow-500/30 hover:bg-yellow-500/60 rounded-t-sm transition-all duration-300 border-t-2 border-yellow-500 relative"
                  style={{ height: `${d.value}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(d.value)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-textH/50 mt-2 pl-2">
            {energyData.map((d, i) => <span key={i}>{d.day}</span>)}
          </div>
        </div>
      </div>

      {/* Farm-Specific Alerts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {farmNames.map(farmName => (
          <div key={farmName} className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-textH flex items-center gap-2">
                <AlertTriangle size={18} className={farmAlerts[farmName]?.length > 0 ? 'text-red-500' : 'text-emerald-500'} />
                {farmName} Alerts
              </h2>
              <span className={`px-3 py-1 text-xs font-black rounded-full ${
                farmAlerts[farmName]?.length > 0
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {farmAlerts[farmName]?.length || 0} active
              </span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {(farmAlerts[farmName] || []).length === 0 ? (
                <div className="text-center py-6 text-emerald-400/70">
                  <p className="text-sm font-medium">✓ All systems nominal</p>
                </div>
              ) : (
                (farmAlerts[farmName] || []).map(alert => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-social-bg/60 rounded-xl border border-border/50">
                    <AlertTriangle size={16} className={alert.severity === 'CRITICAL' ? 'text-red-500 mt-0.5 shrink-0' : 'text-amber-500 mt-0.5 shrink-0'} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-textH">{alert.device_id}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>{alert.type}</span>
                      </div>
                      <p className="text-xs text-textH/60">{alert.details}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
