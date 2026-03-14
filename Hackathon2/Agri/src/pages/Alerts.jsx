import { useState, useMemo } from 'react';
import { AlertTriangle, Filter, CheckCircle, Info, BellRing } from 'lucide-react';
import { useValves } from '../context/ValveContext';

export default function Alerts() {
  const [filter, setFilter] = useState('ALL');
  const { valves } = useValves();

  const alerts = useMemo(() => {
    let generatedAlerts = [];
    valves.forEach(valve => {
      // Simulate some variations if specific values are missing
      const battery = valve.battery !== undefined ? valve.battery : 100;
      const motor_current = valve.motor_current !== undefined ? valve.motor_current : 0;
      const flow_rate = valve.flow_rate !== undefined ? valve.flow_rate : (valve.status === 'OPEN' ? 150 : 0);
      const pressure = valve.pressure !== undefined ? valve.pressure : 3.5;
      const temperature = valve.temperature !== undefined ? valve.temperature : 30;

      if (battery < 20) {
        generatedAlerts.push({
          id: `${valve.device_id}_BATT`,
          device_id: valve.device_id,
          type: 'Low Battery',
          severity: 'WARNING',
          timestamp: 'Just Now',
          details: `Battery level critically low at ${battery}%`,
          cause: 'Natural battery drainage over time or blocked solar panel.',
          solution: 'Dispatch maintenance crew to replace battery or clean solar panel.'
        });
      }
      if (motor_current > 6) {
        generatedAlerts.push({
          id: `${valve.device_id}_MOTOR`,
          device_id: valve.device_id,
          type: 'Motor Overload',
          severity: 'CRITICAL',
          timestamp: '1 min ago',
          details: `Abnormal motor current detected: ${motor_current}A`,
          cause: 'Physical obstruction in the valve mechanism causing the motor to overwork.',
          solution: 'Immediate physical inspection required. Clear debris from valve path.'
        });
      }
      
      // Water Leakage Detection (Internal Leak)
      if (valve.status === 'CLOSED' && flow_rate > 0) {
        generatedAlerts.push({
          id: `${valve.device_id}_LEAK`,
          device_id: valve.device_id,
          type: 'Internal Leakage',
          severity: 'CRITICAL',
          timestamp: 'Live Update',
          details: `Water flow (${flow_rate} L/min) detected while valve is CLOSED.`,
          cause: 'Valve seal compromised or diaphragm failure allowing fluid bypass.',
          solution: 'Replace valve internal seals or entire valve unit immediately to prevent water loss.'
        });
      }

      // Pipe Burst / Major Leakage (Downstream)
      if (valve.status === 'OPEN' && flow_rate > 300 && pressure < 2.0) {
        generatedAlerts.push({
          id: `${valve.device_id}_BURST`,
          device_id: valve.device_id,
          type: 'Leakage / Pipe Burst',
          severity: 'CRITICAL',
          timestamp: 'Detected on Sync',
          details: `Abnormal high flow (${flow_rate} L/min) and low pressure (${pressure} bar).`,
          cause: 'Major rupture in downstream pipe causing massive pressure drop.',
          solution: 'AUTO-CLOSE INITIATED. Dispatch repair crew to fix downstream mainline.'
        });
      }
    });
    
    return generatedAlerts.sort((a, b) => {
      if (a.severity === 'CRITICAL' && b.severity !== 'CRITICAL') return -1;
      if (a.severity !== 'CRITICAL' && b.severity === 'CRITICAL') return 1;
      return 0;
    });
  }, [valves]);

  const filteredAlerts = alerts.filter(alert => filter === 'ALL' || alert.severity === filter);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
            <BellRing size={28} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-textH">Real-time Alerts</h1>
            <p className="text-textH/60">Live telemetry diagnostics from your active network</p>
          </div>
        </div>
         <div className="flex bg-main rounded-lg p-1 shadow-sm border border-border">
           <button
             onClick={() => setFilter('ALL')}
             className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'ALL' ? 'bg-social-bg text-textH' : 'text-textH/60 hover:text-textH'}`}
           >
             All
           </button>
           <button
             onClick={() => setFilter('CRITICAL')}
             className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : 'text-textH/60 hover:text-textH'}`}
           >
             Critical
           </button>
           <button
             onClick={() => setFilter('WARNING')}
             className={`px-4 py-2 text-sm font-semibold rounded-md transition ${filter === 'WARNING' ? 'bg-amber-500/20 text-amber-400' : 'text-textH/60 hover:text-textH'}`}
           >
             Warnings
           </button>
         </div>
      </header>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border bg-main flex items-center justify-between text-textH/80">
          <div className="flex gap-2 items-center text-sm font-medium">
             <Filter size={16} /> Filtered: {filteredAlerts.length} alerts
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-main border-b border-border text-textH/60 text-sm tracking-wider">
                <th className="p-4 font-semibold w-12"></th>
                <th className="p-4 font-semibold">Device</th>
                <th className="p-4 font-semibold w-1/4">Alert Type</th>
                <th className="p-4 font-semibold w-2/4">Diagnostics & Solution</th>
                <th className="p-4 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAlerts.map(alert => (
                <tr key={alert.id} className="hover:bg-social-bg transition-colors group">
                  <td className="p-4 align-top">
                     {alert.severity === 'CRITICAL' ? (
                       <AlertTriangle className="text-red-500 mt-1" size={20} />
                     ) : (
                       <Info className="text-amber-500 mt-1" size={20} />
                     )}
                  </td>
                  <td className="p-4 font-bold text-textH align-top pt-5">{alert.device_id}</td>
                  <td className="p-4 align-top pt-4">
                     <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                     }`}>
                       {alert.type}
                     </span>
                  </td>
                  <td className="p-4 text-sm align-top">
                     <div className="font-semibold text-textH/90 mb-2">{alert.details}</div>
                     <div className="flex flex-col gap-2 mt-3">
                       <div className="bg-social-bg/50 p-2.5 rounded-lg border border-border/50">
                         <span className="text-[10px] font-black uppercase tracking-widest text-textH/40 block mb-1">Root Cause Analysis</span>
                         <span className="text-textH/70">{alert.cause}</span>
                       </div>
                       <div className="bg-accent/10 p-2.5 rounded-lg border border-accent/20">
                         <span className="text-[10px] font-black uppercase tracking-widest text-accent/70 block mb-1">Recommended Solution</span>
                         <span className="text-accent/90">{alert.solution}</span>
                       </div>
                     </div>
                  </td>
                  <td className="p-4 text-right text-textH/50 text-sm font-medium align-top pt-5">
                     {alert.timestamp}
                  </td>
                </tr>
              ))}
              {filteredAlerts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-textH/50">
                     <CheckCircle className="mx-auto mb-4 text-emerald-500" size={48} />
                     <p className="text-lg font-medium text-textH">All Clear</p>
                     <p>No alerts matching current filter.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
