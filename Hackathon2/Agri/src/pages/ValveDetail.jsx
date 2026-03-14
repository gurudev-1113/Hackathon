import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Power, Settings, ArrowLeft, Battery, Thermometer, Activity, Clock, MapPin } from 'lucide-react';
import { useValves } from '../context/ValveContext';

export default function ValveDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { valves } = useValves();
  const initialValve = valves.find((v) => v.device_id === id);

  const [valve, setValve] = useState(initialValve);
  const [actionSimulating, setActionSimulating] = useState(false);

  useEffect(() => {
    // If invalid ID navigated, go back to list
    if (!initialValve) {
      navigate('/valves');
    }
  }, [initialValve, navigate]);

  if (!valve) return null;

  const simulateAction = (newStatus, callback) => {
    setActionSimulating(true);
    setTimeout(() => {
      setValve((prev) => ({
        ...prev,
        status: newStatus,
        motor_current: newStatus === 'OPEN' ? 4.8 : 0.0, // Simulate motor current dropping or raising after command
      }));
      setActionSimulating(false);
      if (callback) callback();
    }, 1500);
  };

  const handleOpen = () => simulateAction('OPEN');
  const handleClose = () => simulateAction('CLOSED');
  const handleSetPosition = () => {
    const pos = prompt('Enter valve position % (0-100):', '50');
    if (pos !== null) {
      const parsed = parseInt(pos, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
        simulateAction(parsed === 0 ? 'CLOSED' : 'OPEN');
      } else {
        alert('Invalid position');
      }
    }
  };

  const voltage = ((valve.battery / 100) * 12.0).toFixed(1);
  const valvePosition = valve.status === 'OPEN' ? 100 : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <header className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/valves')}
          className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">{valve.device_id} Details</h1>
          <p className="text-slate-400 tracking-wide font-medium">Lat: {valve.lat}, Lon: {valve.lon}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <Activity className="text-blue-500" /> Live Telemetry
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <TelemetryCard
                icon={<Settings className="text-slate-400" size={24} />}
                label="Valve Position"
                value={`${valvePosition}%`}
              />
              <TelemetryCard
                icon={<Battery className="text-green-500" size={24} />}
                label="Battery Voltage"
                value={`${voltage}V (${valve.battery}%)`}
                alert={valve.battery < 20}
              />
              <TelemetryCard
                icon={<Activity className="text-orange-500" size={24} />}
                label="Motor Current"
                value={`${valve.motor_current}A`}
                alert={valve.motor_current > 6}
              />
              <TelemetryCard
                icon={<Thermometer className="text-red-400" size={24} />}
                label="Internal Temp"
                value={`${valve.temperature}°C`}
              />
              <TelemetryCard
                 icon={<Clock className="text-indigo-400" size={24} />}
                 label="Last Movement Time"
                 value={`${valve.movement_time}s`}
                 alert={valve.movement_time > 10}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-slate-200">
              <MapPin className="text-green-500" /> Location Coordinates
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 font-medium">Latitude</span>
                <span className="text-white font-mono font-bold">{valve.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 font-medium">Longitude</span>
                <span className="text-white font-mono font-bold">{valve.lon.toFixed(6)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-800/50 rounded-xl">
                <span className="text-slate-400 font-medium">Coordinates</span>
                <span className="text-accent font-mono text-sm">{valve.lat.toFixed(4)}, {valve.lon.toFixed(4)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-slate-800">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-200">Status</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${valve.status === 'OPEN' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {valve.status}
                </span>
             </div>

             <h2 className="text-lg font-semibold mb-4 border-t border-slate-800 pt-4 text-slate-200">Command Center</h2>
             <div className="space-y-3">
               <button
                 onClick={handleOpen}
                 disabled={actionSimulating || valve.status === 'OPEN'}
                 className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
               >
                 <Power size={18} /> OPEN VALVE
               </button>
               <button
                 onClick={handleClose}
                 disabled={actionSimulating || valve.status === 'CLOSED'}
                 className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm border border-slate-700"
               >
                 <Power size={18} className="rotate-180" /> CLOSE VALVE
               </button>
               <button
                 onClick={handleSetPosition}
                 disabled={actionSimulating}
                 className="w-full py-3 border-2 border-slate-700 hover:border-blue-500 hover:text-blue-400 font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed text-slate-300"
               >
                 SET POSITION...
               </button>
               {actionSimulating && (
                 <p className="text-sm text-blue-400 text-center animate-pulse mt-2 font-medium">Transmitting command...</p>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelemetryCard({ icon, label, value, alert }) {
  return (
    <div className={`p-4 rounded-xl border ${alert ? 'bg-red-900/20 border-red-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-slate-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${alert ? 'text-red-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  );
}
