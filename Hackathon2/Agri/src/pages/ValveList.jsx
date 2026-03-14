import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Battery, 
  Activity, 
  Thermometer, 
  Info, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  CheckSquare, 
  Square,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useValves } from '../context/ValveContext';

export default function ValveList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [editingStatus, setEditingStatus] = useState('CLOSED');
  const [savingId, setSavingId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());
  
  const { valves, loading, error, addValve, deleteValve, updateValve } = useValves();

  const filteredValves = useMemo(() => 
    valves.filter((valve) =>
      valve.device_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (valve.name && valve.name.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [valves, searchTerm]
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredValves.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredValves.map(v => v.device_id)));
    }
  };

  const toggleSelect = (id, e) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} valves?`)) {
      const idsToDelete = Array.from(selectedIds);
      for (const id of idsToDelete) {
        await deleteValve(id);
      }
      setSelectedIds(new Set());
    }
  };

  const handleAddValve = async () => {
    const newId = `VALVE_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newValve = {
      device_id: newId,
      name: `Valve ${valves.length + 1}`,
      lat: 13.065 + (Math.random() - 0.5) * 0.01,
      lon: 74.805 + (Math.random() - 0.5) * 0.01,
      status: 'CLOSED',
      battery: Math.floor(Math.random() * 80) + 20,
      valve_position: 0,
      battery_voltage: 12.4,
      motor_current: 0,
      temperature: 28,
      signal_strength: 85
    };
    try {
      await addValve(newValve);
    } catch (err) {
      alert('Failed to add valve');
    }
  };

  const handleDeleteValve = async (device_id, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${device_id}?`)) {
      setDeletingIds(prev => new Set(prev).add(device_id));
      await deleteValve(device_id);
      setDeletingIds(prev => {
        const next = new Set(prev);
        next.delete(device_id);
        return next;
      });
      const newSelected = new Set(selectedIds);
      newSelected.delete(device_id);
      setSelectedIds(newSelected);
    }
  };

  const handleEditValve = (valve, e) => {
    e.stopPropagation();
    setEditingId(valve.device_id);
    setEditingName(valve.name || valve.device_id);
    setEditingStatus(valve.status || 'CLOSED');
  };

  const handleSaveEdit = async (device_id, e) => {
    e.stopPropagation();
    try {
      setSavingId(device_id);
      await updateValve(device_id, { 
        name: editingName,
        status: editingStatus 
      });
      setEditingId(null);
      setEditingName('');
    } catch (err) {
      alert('Failed to save changes');
    } finally {
      setSavingId(null);
    }
  };

  if (loading && valves.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400">Loading valve network...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-500/50 rounded-2xl flex items-center gap-4 text-red-200">
        <AlertCircle className="shrink-0" />
        <div>
          <h3 className="font-bold">Error Loading Network</h3>
          <p className="text-sm opacity-80">{error}. Please ensure the backend server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Valve Network</h1>
          <p className="text-slate-400">Real-time control and telemetry monitoring</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <input
              type="text"
              placeholder="Search devices..."
              className="w-full md:w-64 px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 text-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none placeholder-slate-500 transition-all backdrop-blur-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddValve}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Valve</span>
          </button>
        </div>
      </header>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-6">
            <span className="text-blue-400 font-medium whitespace-nowrap">
              {selectedIds.size} {selectedIds.size === 1 ? 'valve' : 'valves'} selected
            </span>
            <div className="h-6 w-px bg-slate-700" />
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              <Trash2 size={18} />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="text-slate-400 hover:text-white p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 border-b border-slate-800/50 text-slate-400 text-sm tracking-wider">
                <th className="p-5 w-12">
                  <button onClick={toggleSelectAll} className="text-slate-500 hover:text-blue-400 transition-colors">
                    {selectedIds.size === filteredValves.length && filteredValves.length > 0 ? (
                      <CheckSquare size={20} className="text-blue-500" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </th>
                <th className="p-5 font-semibold">Valve Details</th>
                <th className="p-5 font-semibold">Status</th>
                <th className="p-5 font-semibold">Health & Telemetry</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredValves.map((valve) => (
                <tr
                  key={valve.device_id}
                  className={`group transition-all cursor-pointer ${
                    selectedIds.has(valve.device_id) ? 'bg-blue-500/5' : 'hover:bg-slate-800/30'
                  } ${deletingIds.has(valve.device_id) ? 'opacity-50 pointer-events-none scale-[0.98] blur-[1px]' : ''}`}
                  onClick={() => navigate(`/valves/${valve.device_id}`)}
                >
                  <td className="p-5" onClick={(e) => toggleSelect(valve.device_id, e)}>
                    <button className="text-slate-600 group-hover:text-blue-400 transition-colors">
                      {selectedIds.has(valve.device_id) ? (
                        <CheckSquare size={20} className="text-blue-500" />
                      ) : (
                        <Square size={20} />
                      )}
                    </button>
                  </td>
                  <td className="p-5">
                    {editingId === valve.device_id ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col gap-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="px-3 py-1.5 bg-slate-800 border-2 border-blue-500 rounded-lg text-slate-200 text-sm focus:outline-none ring-4 ring-blue-500/10 w-40"
                            placeholder="Name"
                            autoFocus
                          />
                          <select
                            value={editingStatus}
                            onChange={(e) => setEditingStatus(e.target.value)}
                            className="px-3 py-1 bg-slate-800 border-2 border-slate-700 rounded-lg text-slate-300 text-xs focus:ring-2 focus:ring-blue-500/50 outline-none"
                          >
                            <option value="CLOSED">CLOSED</option>
                            <option value="OPEN">OPEN</option>
                          </select>
                        </div>
                        <button
                          onClick={(e) => handleSaveEdit(valve.device_id, e)}
                          disabled={savingId === valve.device_id}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 p-2 rounded-lg transition disabled:opacity-50"
                        >
                          {savingId === valve.device_id ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingId(null); }}
                          className="bg-slate-700/50 text-slate-400 hover:bg-slate-700 p-2 rounded-lg transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-lg">{valve.name || 'Unnamed Valve'}</span>
                          <button
                            onClick={(e) => handleEditValve(valve, e)}
                            className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-700 transition opacity-0 group-hover:opacity-100"
                          >
                            <Edit size={14} />
                          </button>
                        </div>
                        <span className="font-mono text-xs text-slate-500">{valve.device_id}</span>
                      </div>
                    )}
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black uppercase tracking-tighter border ${
                        valve.status === 'OPEN'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 ring-4 ring-blue-500/5'
                          : 'bg-slate-800 text-slate-500 border-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${valve.status === 'OPEN' ? 'bg-blue-400 animate-pulse' : 'bg-slate-600'}`} />
                      {valve.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Battery size={14} className={valve.battery < 20 ? 'text-red-500' : 'text-slate-500'} />
                          <span className="text-xs font-semibold uppercase tracking-widest">Battery</span>
                        </div>
                        <span className={`text-sm font-bold ${valve.battery < 20 ? 'text-red-400' : 'text-slate-200'}`}>
                          {valve.battery}%
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Activity size={14} className="text-slate-500" />
                          <span className="text-xs font-semibold uppercase tracking-widest">Load</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200">{valve.motor_current || 0} A</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Thermometer size={14} className="text-slate-500" />
                          <span className="text-xs font-semibold uppercase tracking-widest">Temp</span>
                        </div>
                        <span className="text-sm font-bold text-slate-200">{valve.temperature}°C</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 p-2.5 rounded-xl transition-all active:scale-95"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/valves/${valve.device_id}`);
                        }}
                        title="View Details"
                      >
                        <Info size={20} />
                      </button>
                      <button
                        className="bg-red-500/10 text-red-400 hover:bg-red-500/20 p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-30"
                        onClick={(e) => handleDeleteValve(valve.device_id, e)}
                        disabled={deletingIds.has(valve.device_id)}
                        title="Delete Device"
                      >
                        {deletingIds.has(valve.device_id) ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : (
                          <Trash2 size={20} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredValves.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="bg-slate-800/50 p-6 rounded-3xl">
                <Square size={40} className="text-slate-600" />
              </div>
              <div className="space-y-1">
                <p className="text-xl font-bold text-white">No devices found</p>
                <p className="text-slate-500 max-w-xs mx-auto">Try adjusting your search or add a new valve to the network.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
