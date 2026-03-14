import { useMemo } from 'react';
import { useValves } from '../context/ValveContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Activity, Battery, Thermometer, AlertTriangle } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

export default function ConditionMonitoring() {
  const { valves, loading, error } = useValves();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { 
       legend: { display: false },
       tooltip: {
         backgroundColor: 'rgba(15, 23, 42, 0.9)',
         titleFont: { family: 'Inter', size: 13, weight: 'bold' },
         bodyFont: { family: 'Inter', size: 12 },
         padding: 12,
         cornerRadius: 8,
         displayColors: true
       }
    },
    scales: { 
       x: { grid: { display: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' } }, 
       y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false }, ticks: { font: { family: 'Inter', size: 11 }, color: '#64748b' } } 
    }
  };

  const labels = useMemo(() => valves.map(v => v.name || v.device_id.split('_').pop()), [valves]);
  
  const motorData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Motor Current (A)',
      data: valves.map(v => parseFloat(v.motor_current || 0)),
      borderColor: '#f97316',
      backgroundColor: (context) => {
         const ctx = context.chart.ctx;
         const gradient = ctx.createLinearGradient(0, 0, 0, 300);
         gradient.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
         gradient.addColorStop(1, 'rgba(249, 115, 22, 0.0)');
         return gradient;
      },
      borderWidth: 3,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#f97316',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }), [valves, labels]);

  const batteryData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Battery (%)',
      data: valves.map(v => v.battery),
      backgroundColor: valves.map(v => {
        if (v.battery < 20) return '#ef4444';
        if (v.battery < 50) return '#f59e0b';
        return '#10b981';
      }),
      borderRadius: 6,
      barThickness: 'flex',
      maxBarThickness: 32
    }]
  }), [valves, labels]);

  const temperatureData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: valves.map(v => v.temperature || 0),
      borderColor: '#8b5cf6',
      backgroundColor: (context) => {
         const ctx = context.chart.ctx;
         const gradient = ctx.createLinearGradient(0, 0, 0, 300);
         gradient.addColorStop(0, 'rgba(139, 92, 246, 0.4)');
         gradient.addColorStop(1, 'rgba(139, 92, 246, 0.0)');
         return gradient;
      },
      borderWidth: 3,
      tension: 0.5,
      fill: true,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#8b5cf6',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  }), [valves, labels]);

  const healthData = useMemo(() => {
    return valves.map(valve => {
      let status = 'GOOD';
      let issues = [];

      if (valve.battery < 20) { status = 'WARNING'; issues.push('Low Battery'); }
      if (valve.movement_time > 10) { status = 'WARNING'; issues.push('Friction Detected'); }
      if (valve.motor_current > 6) { status = 'CRITICAL'; issues.push('Motor Overload'); }
      if (valve.status === 'CLOSED' && (valve.flow_rate || 0) > 0) { status = 'CRITICAL'; issues.push('Internal Leak'); }
      if (valve.status === 'OPEN' && (valve.flow_rate || 0) > 300 && (valve.pressure || 0) < 2.0) { status = 'CRITICAL'; issues.push('Pipe Burst'); }
      if (valve.status === 'OPEN' && (valve.flow_rate || 0) < 10 && (valve.pressure || 0) > 5.0) { status = 'CRITICAL'; issues.push('Blockage'); }

      return { ...valve, health: status, issues };
    });
  }, [valves]);

  const criticalCount = healthData.filter(v => v.health === 'CRITICAL').length;
  const warningCount = healthData.filter(v => v.health === 'WARNING').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent animate-spin rounded-full"></div>
        <p className="text-slate-400 font-medium animate-pulse">Synchronizing telemetry data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-red-500/10 rounded-3xl border border-red-500/20">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Sync Error</h3>
        <p className="text-red-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Condition Monitoring</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Real-time health and telemetry analytics</p>
        </div>
        <div className="flex gap-4">
           {criticalCount > 0 && (
             <div className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-500 rounded-xl border border-red-500/20 font-bold shadow-sm shadow-red-500/10">
               <AlertTriangle size={18} className="animate-pulse" /> {criticalCount} Critical
             </div>
           )}
           {warningCount > 0 && (
             <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20 font-bold shadow-sm shadow-amber-500/10">
               {warningCount} Warnings
             </div>
           )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-3xl shadow-lg border border-slate-700 hover:shadow-[0_4px_20px_rgba(249,115,22,0.15)] transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -z-10 group-hover:bg-orange-500/10 transition-colors" />
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold text-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30 shadow-inner">
                <Activity size={24} />
              </div>
              Motor Current Trend
            </h2>
          </div>
          <div className="h-72 w-full">
            <Line options={chartOptions} data={motorData} />
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-lg border border-slate-700 hover:shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-shadow relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-10 group-hover:bg-green-500/10 transition-colors" />
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold text-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-inner">
                <Battery size={24} />
              </div>
              Battery Distribution
            </h2>
          </div>
          <div className="h-72 w-full">
             <Bar options={chartOptions} data={batteryData} />
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl shadow-lg border border-slate-700 hover:shadow-[0_4px_20px_rgba(139,92,246,0.15)] transition-shadow relative overflow-hidden group lg:col-span-2">
           <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10 group-hover:bg-purple-500/10 transition-colors" />
           <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-extrabold text-slate-200 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 shadow-inner">
                <Thermometer size={24} />
              </div>
              Thermal Analytics (°C)
            </h2>
          </div>
          <div className="h-80 w-full">
            <Line options={chartOptions} data={temperatureData} />
          </div>
        </div>
      </div>

      <div className="glass-card rounded-3xl shadow-lg border border-slate-700 overflow-hidden mt-8">
        <div className="p-8 border-b border-slate-800 bg-slate-900/50">
           <h2 className="text-xl font-extrabold text-slate-200">Device Health Overview</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
               <tr className="bg-slate-900/80 text-slate-400 text-sm tracking-wider">
                 <th className="p-4 font-semibold">Device</th>
                 <th className="p-4 font-semibold">Health Status</th>
                 <th className="p-4 font-semibold">Detected Issues</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
               {healthData.map(valve => (
                 <tr key={valve.device_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{valve.name || valve.device_id}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                        valve.health === 'GOOD' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                        valve.health === 'WARNING' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                        'bg-red-900/30 text-red-500 border-red-500/30'
                      }`}>
                        {valve.health}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {valve.issues.length ? valve.issues.join(', ') : 'None'}
                    </td>
                 </tr>
               ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
