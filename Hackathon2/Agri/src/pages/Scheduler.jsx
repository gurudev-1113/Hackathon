import { useState, useEffect } from 'react';
import valvesData from '../data/valves.json';
import initialSchedules from '../data/schedules.json';
import { Calendar, Clock, Save, Droplet, Timer } from 'lucide-react';

export default function Scheduler() {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [selectedValve, setSelectedValve] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedValve && startTime && duration > 0) {
      const newSchedule = {
        id: `SCH_NEW_${Date.now()}`,
        device_id: selectedValve,
        start_time: startTime,
        duration: parseInt(duration, 10),
        status: 'pending'
      };
      setSchedules([...schedules, newSchedule]);
      setSelectedValve('');
      setStartTime('');
      setDuration(30);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Irrigation Scheduler</h1>
        <p className="text-slate-400">Plan and automate watering cycles</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <Calendar className="text-blue-500" /> New Schedule
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Select Valve</label>
                <select
                  required
                  value={selectedValve}
                  onChange={(e) => setSelectedValve(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="" disabled>Choose a valve...</option>
                  {valvesData.map(v => (
                    <option key={v.device_id} value={v.device_id}>{v.device_id}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Start Time</label>
                <div className="relative">
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Clock className="absolute left-3 top-2.5 text-slate-500" size={20} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Duration (minutes)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <Droplet className="absolute left-3 top-2.5 text-blue-500" size={20} />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition flex justify-center items-center gap-2"
              >
                <Save size={20} /> Save Schedule
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
           <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-800 overflow-hidden">
             <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
               <h2 className="text-xl font-semibold text-slate-200">Active Schedules</h2>
               <span className="bg-blue-500/20 text-blue-400 py-1 px-3 rounded-full text-sm font-bold border border-blue-500/30">
                 {schedules.length} Total
               </span>
             </div>
             <div className="p-0">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm tracking-wider">
                     <th className="p-4 font-semibold">Device</th>
                     <th className="p-4 font-semibold">Start Time</th>
                     <th className="p-4 font-semibold">Duration</th>
                     <th className="p-4 font-semibold">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                   {schedules.map(sched => {
                     let timeRemaining = null;
                     
                     // Highly simplified mock countdown logic for demo purposes
                     // Assuming all scheduled times are for today
                     if (sched.status === 'pending') {
                       const [schedHours, schedMinutes] = sched.start_time.split(':').map(Number);
                       const nowHours = currentTime.getHours();
                       const nowMinutes = currentTime.getMinutes();
                       
                       const schedTimeInMins = schedHours * 60 + schedMinutes;
                       const nowTimeInMins = nowHours * 60 + nowMinutes;
                       
                       const diff = schedTimeInMins - nowTimeInMins;
                       
                       if (diff > 0 && diff < 1440) {
                          const hrs = Math.floor(diff / 60);
                          const mins = diff % 60;
                          const secs = 59 - currentTime.getSeconds();
                          timeRemaining = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                       } else if (diff <= 0 && diff > -sched.duration) {
                          sched.status = 'active'; // implicitly active if within duration
                       } else if (diff <= -sched.duration) {
                          sched.status = 'completed';
                       }
                     }

                     return (
                       <tr key={sched.id} className="hover:bg-slate-800/50 transition-colors">
                         <td className="p-4 font-semibold text-slate-200">{sched.device_id}</td>
                         <td className="p-4 text-slate-300 font-medium">{sched.start_time}</td>
                         <td className="p-4 text-slate-400">{sched.duration} mins</td>
                         <td className="p-4 flex items-center gap-3">
                           <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                             sched.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                             sched.status === 'active' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30 animate-pulse' :
                             'bg-amber-900/30 text-amber-400 border-amber-500/30'
                           }`}>
                             {sched.status.toUpperCase()}
                           </span>
                           {timeRemaining && sched.status === 'pending' && (
                             <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                               <Timer size={14} className="text-amber-500" /> T-minus {timeRemaining}
                             </span>
                           )}
                           {sched.status === 'active' && (
                             <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30 animate-pulse">
                               <Timer size={14} className="animate-spin-slow" /> RUNNING
                             </span>
                           )}
                         </td>
                       </tr>
                     );
                   })}
                   {schedules.length === 0 && (
                     <tr>
                       <td colSpan="4" className="p-8 text-center text-slate-500">No active schedules.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
