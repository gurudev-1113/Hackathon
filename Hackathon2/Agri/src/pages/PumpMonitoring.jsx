import { useState } from 'react';
import { RefreshCw, Plus, X, Filter } from 'lucide-react';

const initialPumps = [
  { id: 'BW-01', name: 'Borewell BW-01', type: 'Borewell', status: 'ACTIVE', flowRate: '105', level: 'NORMAL', runTime: '37' },
  { id: 'WL-01', name: 'Open Well South', type: 'Well', status: 'STANDBY', flowRate: '0', level: 'LOW', runTime: '0' },
  { id: 'TK-01', name: 'Main Sump Tank', type: 'Other', status: 'ACTIVE', flowRate: '250', level: 'NORMAL', runTime: '120' }
];

export default function PumpMonitoring() {
  const [pumps, setPumps] = useState(initialPumps);
  const [filterType, setFilterType] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // New pump form state
  const [newPump, setNewPump] = useState({ name: '', type: 'Borewell', capacity: '' });

  const handleAddPump = (e) => {
    e.preventDefault();
    const pumpId = `${newPump.type.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setPumps([...pumps, {
      id: pumpId,
      name: newPump.name,
      type: newPump.type,
      status: 'STANDBY',
      flowRate: '0',
      level: 'NORMAL',
      runTime: '0'
    }]);
    setShowAddForm(false);
    setNewPump({ name: '', type: 'Borewell', capacity: '' });
  };

  const filteredPumps = filterType === 'All' ? pumps : pumps.filter(p => p.type === filterType);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textH">Pump Monitoring</h1>
          <p className="text-textH/60">Live status of main borewells and pumps</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Filter size={16} className="absolute left-3 top-3.5 text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white outline-none focus:border-accent appearance-none"
            >
              <option value="All">All Sources</option>
              <option value="Borewell">Borewells</option>
              <option value="Well">Open Wells</option>
              <option value="Other">Other (Tanks etc)</option>
            </select>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-accent hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} /> Add Source
          </button>
        </div>
      </header>

      {showAddForm && (
        <div className="glass-card p-6 rounded-3xl border border-accent/30 mb-8 relative animate-in zoom-in-95 duration-200">
           <button onClick={() => setShowAddForm(false)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
             <X size={24} />
           </button>
           <h2 className="text-2xl font-bold text-textH mb-6">Add New Water Source</h2>
           <form onSubmit={handleAddPump} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-textH/80 mb-2">Source Name *</label>
                <input required type="text" value={newPump.name} onChange={e => setNewPump({...newPump, name: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white focus:border-accent outline-none" placeholder="e.g. North Field Borewell" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textH/80 mb-2">Source Type *</label>
                <select value={newPump.type} onChange={e => setNewPump({...newPump, type: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white focus:border-accent outline-none">
                  <option value="Borewell">Borewell</option>
                  <option value="Well">Open Well</option>
                  <option value="Other">External Tank / Sump</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-textH/80 mb-2">Expected Capacity (L/min)</label>
                <input type="number" value={newPump.capacity} onChange={e => setNewPump({...newPump, capacity: e.target.value})} className="w-full bg-slate-800/50 border border-slate-600 rounded-xl p-3 text-white focus:border-accent outline-none" placeholder="e.g. 150" />
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button type="submit" className="bg-accent hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition">
                  Save Source
                </button>
              </div>
           </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPumps.map((pump) => (
          <div key={pump.id} className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-textH">{pump.name}</h2>
                <div className="text-xs text-textH/50 font-medium uppercase tracking-wider">{pump.type}</div>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${pump.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                {pump.status}
              </span>
            </div>
            
            <div className={`w-full h-32 rounded-xl mb-6 relative overflow-hidden border ${pump.status === 'ACTIVE' ? 'bg-main border-border' : 'bg-slate-900 border-slate-800'}`}>
              {pump.status === 'ACTIVE' && (
                <div className="absolute bottom-0 left-0 right-0 bg-blue-500/20 h-2/3 animate-pulse"></div>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className={`text-3xl font-black drop-shadow-lg ${pump.status === 'ACTIVE' ? 'text-textH' : 'text-slate-600'}`}>
                   {pump.status === 'ACTIVE' ? 'ON' : 'OFF'}
                 </span>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-textH/60 text-sm font-semibold">Flow Rate</span>
                <span className="text-textH font-bold">{pump.flowRate} L/min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textH/60 text-sm font-semibold">Water Level</span>
                <span className={pump.level === 'LOW' ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>{pump.level}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-textH/60 text-sm font-semibold">Run Duration</span>
                <span className="text-textH font-bold">{pump.runTime} min</span>
              </div>
            </div>

            <button className="w-full bg-social-bg hover:bg-accent/10 hover:text-accent hover:border-accent/50 border border-border text-textH py-3 rounded-xl font-bold transition flex items-center justify-center gap-2">
              <RefreshCw size={18} className={pump.status === 'ACTIVE' ? 'animate-spin-slow' : ''} /> 
              {pump.status === 'ACTIVE' ? 'Restart Pump' : 'Start Pump'}
            </button>
          </div>
        ))}

        {filteredPumps.length === 0 && (
          <div className="col-span-full py-12 text-center text-textH/50">
             <p className="text-lg">No water sources found for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
