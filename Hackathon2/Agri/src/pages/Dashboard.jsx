import { Activity, Power, AlertTriangle, Droplet, CheckCircle2, Waves, Zap, Clock, Navigation, Map as MapIcon, Crosshair, Search, Plus, Minus, Filter, MapPin, X } from 'lucide-react';
import schedulesData from '../data/schedules.json';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { useValves } from '../context/ValveContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Component to handle map centering from external button click
function LocationUpdater({ centerPosition, zoomLevel }) {
  const map = useMap();
  if (centerPosition && zoomLevel) {
    map.flyTo(centerPosition, zoomLevel, { duration: 1.5 });
  }
  return null;
}

// Component to handle zoom controls
function ZoomControls() {
  const map = useMap();
  
  const handleZoomIn = () => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom + 1);
  };
  
  const handleZoomOut = () => {
    const currentZoom = map.getZoom();
    map.setZoom(currentZoom - 1);
  };
  
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-xl p-2 shadow-lg">
      <div className="flex items-center gap-1">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-transparent text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center text-lg font-bold"
          title="Zoom Out"
        >
          -
        </button>
        <div className="w-px h-6 bg-slate-600 mx-1"></div>
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-transparent text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center text-lg font-bold"
          title="Zoom In"
        >
          +
        </button>
      </div>
    </div>
  );
}
function MapClickHandler({ onLocationSelect, active }) {
  useMapEvents({
    click(e) {
      if (active) onLocationSelect(e.latlng);
    }
  });
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { valves, pipelines, alerts, addValve, addValves, updateValve, addPipeline, deletePipeline } = useValves();
  const [mapCenter, setMapCenter] = useState([13.065, 74.805]);
  const [mapZoom, setMapZoom] = useState(13);
  const [isLocating, setIsLocating] = useState(false);
  const [designMode, setDesignMode] = useState(false);
  const [activeTool, setActiveTool] = useState('select'); // select, well, valve, pipeline
  const [pipelineStart, setPipelineStart] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('all'); 
  const [valveType, setValveType] = useState('all'); 
  const [placeSearch, setPlaceSearch] = useState('');

  const handleMapClick = async (latlng) => {
    if (!designMode) return;

    if (activeTool === 'well') {
      const wellValve = {
        device_id: `WELL_${Date.now()}`,
        name: "Main Well",
        lat: latlng.lat,
        lon: latlng.lng,
        type: "WELL",
        status: "OPEN",
        battery: 100,
        valve_position: 100,
        battery_voltage: 12.8,
        motor_current: 0,
        temperature: 25,
        signal_strength: 100
      };
      await addValve(wellValve);
      setActiveTool('select');
    } else if (activeTool === 'valve') {
      const valve = {
        device_id: `VALVE_${Date.now()}`,
        name: `Valve ${valves.filter(v => v.type === 'VALVE').length + 1}`,
        lat: latlng.lat,
        lon: latlng.lng,
        type: "VALVE",
        status: "CLOSED",
        battery: 100,
        valve_position: 0,
        battery_voltage: 12.4,
        motor_current: 0,
        temperature: 28,
        signal_strength: 85
      };
      await addValve(valve);
    }
  };

  const handleMarkerClick = async (device_id) => {
    if (designMode && activeTool === 'pipeline') {
      if (!pipelineStart) {
        setPipelineStart(device_id);
      } else {
        if (pipelineStart !== device_id) {
          await addPipeline({
            fromDeviceId: pipelineStart,
            toDeviceId: device_id,
            type: "MAIN"
          });
        }
        setPipelineStart(null);
      }
    }
  };

  const handleMarkerDrag = async (device_id, e) => {
    const { lat, lng } = e.target.getLatLng();
    const valve = valves.find(v => v.device_id === device_id);
    if (valve) {
      await updateValve(device_id, { 
        ...valve,
        lat: lat,
        lon: lng
      });
    }
  };

  // Stats logic
  const totalValves = valves.filter(v => v.type === 'VALVE').length;
  const activeValves = valves.filter(v => v.type === 'VALVE' && v.status === 'OPEN').length;
  const onlineValves = valves.filter(v => v.battery > 0).length;
  const alertsCount = alerts.length;
  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const well = valves.find(v => v.type === 'WELL');

  // Search logic
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setSearchResults([]);
    } else {
      let filtered = valves.filter(v => 
        (v.name && v.name.toLowerCase().includes(term.toLowerCase())) ||
        v.device_id.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const centerOnValve = (valve) => {
    setMapCenter([valve.lat, valve.lon]);
    setMapZoom(16);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handlePlaceSearch = () => {
    if (placeSearch.trim() !== '') {
      const coords = [13.065 + (Math.random() - 0.5) * 0.1, 74.805 + (Math.random() - 0.5) * 0.1];
      setMapCenter(coords);
      setMapZoom(14);
      setPlaceSearch('');
    }
  };

  const getValveCoords = (id) => {
    const v = valves.find(v => v.device_id === id);
    return v ? [v.lat, v.lon] : null;
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-end justify-between mb-2">
        <div>
          <h1 className="text-4xl font-extrabold text-textH tracking-tight">Farm Designer</h1>
          <p className="text-slate-400 mt-2 text-lg font-medium">Layout and telemetry overview</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setDesignMode(!designMode)}
            className={`px-5 py-2.5 rounded-xl font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border shadow-lg ${
              designMode 
              ? 'bg-amber-500 text-white border-amber-400 animate-pulse' 
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {designMode ? <X size={18} /> : <MapIcon size={18} />}
            {designMode ? "Exit" : "Design"}
          </button>
          <div className="bg-main/80 backdrop-blur-md px-4 py-2 rounded-xl border border-border shadow-sm flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-textH tracking-widest uppercase">Live</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Network Nodes"
          value={valves.length}
          icon={<Waves className="text-blue-600" size={28} />}
          gradient="from-blue-500/10 to-transparent"
          border="border-blue-500/30"
          valueColor="text-blue-300"
        />
        <StatCard
          title="Active Lines"
          value={pipelines.length}
          icon={<Zap className="text-cyan-500" size={28} />}
          gradient="from-cyan-500/10 to-transparent"
          border="border-cyan-500/30"
          valueColor="text-cyan-300"
        />
        <StatCard
          title="Well Integrity"
          value={well ? `${well.battery}%` : 'N/A'}
          icon={<Droplet className="text-emerald-500" size={28} />}
          gradient="from-emerald-500/10 to-transparent"
          border="border-emerald-500/30"
          valueColor="text-emerald-300"
        />
        <StatCard
          title="System Alerts"
          value={alertsCount}
          icon={<AlertTriangle className="text-red-500" size={28} />}
          gradient={alertsCount > 0 ? "from-red-500/15 to-transparent" : "from-slate-100/50 to-transparent"}
          border={alertsCount > 0 ? "border-red-500/30" : "border-slate-500/30"}
          valueColor={alertsCount > 0 ? "text-red-400" : "text-textH"}
        />
      </div>
      
      {/* Design Toolbar */}
      {designMode && (
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-3xl shadow-2xl animate-in slide-in-from-top-4 duration-500 relative z-[1001]">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 w-full lg:mb-0 lg:w-auto lg:mr-4">Designer Tools</div>
          <button 
            onClick={() => setActiveTool('select')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${activeTool === 'select' ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Navigation size={18} /> Select
          </button>
          <button 
            disabled={valves.some(v => v.type === 'WELL')}
            onClick={() => setActiveTool('well')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all disabled:opacity-30 ${activeTool === 'well' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Droplet size={18} /> Place Well
          </button>
          <button 
            onClick={() => setActiveTool('valve')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${activeTool === 'valve' ? 'bg-blue-600 text-white shadow-lg shadow-blue/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Plus size={18} /> Add Valve
          </button>
          <button 
            onClick={() => setActiveTool('pipeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${activeTool === 'pipeline' ? 'bg-purple-600 text-white shadow-lg shadow-purple/30' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            <Waves size={18} /> Draw Pipeline
          </button>
          <div className="h-8 w-px bg-slate-700 mx-2 hidden lg:block" />
          <p className="text-xs text-slate-400 font-medium ml-auto">
            {activeTool === 'select' && "Drag markers to reposition nodes."}
            {activeTool === 'well' && "Click on map to place the water source."}
            {activeTool === 'valve' && "Click on map to place nodes across the field."}
            {activeTool === 'pipeline' && (pipelineStart ? `Connecting from ${pipelineStart}... Click another node.` : "Select a node to start a pipeline.")}
          </p>
        </div>
      )}

      <div className="glass-card p-1.5 rounded-[2.5rem] mt-8 relative group overflow-hidden shadow-2xl border border-slate-800/50">
        <div className="absolute top-6 left-8 z-10 bg-main/95 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl border border-border flex items-center gap-4">
          <div className="p-2.5 bg-blue-500/20 text-accent rounded-xl border border-blue-500/30">
             <MapIcon size={22} />
          </div>
          <div>
            <h2 className="text-sm font-black text-textH uppercase tracking-widest">Layout View</h2>
            <p className="text-[13px] text-slate-400 font-semibold mt-0.5">{pipelines.length} pipeline segments active</p>
          </div>
        </div>

        <div className="absolute top-6 right-8 z-[1000] flex flex-col gap-3">
          <div className="bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-2xl p-4 shadow-xl">
             <div className="flex relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search network..."
                  className="flex-1 px-3 py-2 pl-9 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                
                {searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800/95 backdrop-blur-md border border-slate-600 rounded-2xl shadow-2xl max-h-48 overflow-y-auto w-64">
                    {searchResults.map(valve => (
                      <button
                        key={valve.device_id}
                        onClick={() => centerOnValve(valve)}
                        className="w-full px-3 py-2 text-left hover:bg-slate-700 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="font-semibold text-white text-xs group-hover:text-accent">{valve.name}</p>
                          <p className="text-[10px] text-slate-500 capitalize">{valve.type}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
             </div>
          </div>
          
          <button 
            onClick={() => setDesignMode(!designMode)}
            className={`px-4 py-3 rounded-2xl font-bold tracking-wide shadow-2xl transition-all duration-300 flex items-center gap-2 border ${
               designMode 
               ? 'bg-amber-600 text-white border-amber-400 animate-pulse shadow-amber-600/30' 
               : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Crosshair size={18} />
            {designMode ? "Design Tools Active" : "Interactive Designer"}
          </button>
        </div>
        <div className={`h-[600px] w-full rounded-[2.25rem] overflow-hidden z-0 relative ${designMode ? (activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair') : ''}`}>
          <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={false} className="h-full w-full outline-none">
            <LocationUpdater centerPosition={mapCenter} zoomLevel={mapZoom} />
            <ZoomControls />
            <MapClickHandler active={designMode && activeTool !== 'pipeline' && activeTool !== 'select'} onLocationSelect={handleMapClick} />
            <TileLayer
              attribution='&copy; Google'
              url="http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            />
            
            {/* Pipelines */}
            {pipelines.map(pipe => {
              const from = getValveCoords(pipe.fromDeviceId);
              const to = getValveCoords(pipe.toDeviceId);
              if (!from || !to) return null;
              return (
                <Polyline 
                  key={pipe.id} 
                  positions={[from, to]} 
                  pathOptions={{ color: '#0ea5e9', weight: 4, opacity: 0.6, dashArray: '10, 10' }} 
                />
              );
            })}

            {valves.map(valve => {
              const isWell = valve.type === 'WELL';
              const isOpen = valve.status === 'OPEN';
              
              return (
                <Marker 
                  key={valve.device_id} 
                  position={[valve.lat, valve.lon]}
                  draggable={designMode && activeTool === 'select'}
                  eventHandlers={{
                    click: () => handleMarkerClick(valve.device_id),
                    dragend: (e) => handleMarkerDrag(valve.device_id, e)
                  }}
                  icon={L.divIcon({
                    className: 'custom-div-icon',
                    html: `<div class="marker-pin ${isWell ? 'well' : (isOpen ? 'open' : 'closed')}">
                            ${isWell ? '💧' : (isOpen ? '●' : '○')}
                          </div>`,
                    iconSize: [30, 42],
                    iconAnchor: [15, 42]
                  })}
                >
                    <Popup className="font-sans border-0 shadow-2xl">
                      <div className="bg-slate-900 rounded-2xl overflow-hidden min-w-[200px] border border-slate-700">
                        <div className="bg-slate-950 p-3 flex items-center justify-between border-b border-slate-800">
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{valve.type}</span>
                          <span className="text-[10px] font-mono text-slate-400">{valve.device_id}</span>
                        </div>
                        <div className="p-4 space-y-4 text-white">
                          <h3 className="font-black text-lg leading-tight">{valve.name}</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Status</p>
                              <p className={`text-xs font-bold ${isOpen ? 'text-cyan-400' : 'text-slate-400'}`}>{valve.status}</p>
                            </div>
                            <div className="bg-slate-800/50 p-2 rounded-xl border border-slate-700/50">
                              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Battery</p>
                              <p className="text-xs font-bold">{valve.battery}%</p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/valves/${valve.device_id}`)}
                            className="w-full bg-accent hover:bg-blue-500 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                          >
                            Explore Analytics
                          </button>
                        </div>
                      </div>
                    </Popup>
                </Marker>
              );
            })}
            {/* Pulse/Alert Markers */}
            {valves.map(valve => {
              if (valve.status === 'OPEN') {
                return (
                  <CircleMarker 
                    key={`pulse-${valve.device_id}`}
                    center={[valve.lat, valve.lon]} 
                    radius={35}
                    pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.25, stroke: false }}
                    className="animate-pulse duration-[2000ms]"
                  />
                );
              }
              // Check if this valve has an alert
              const hasAlert = alerts.some(alert => alert.device_id === valve.device_id);
              if (hasAlert) {
                return (
                  <CircleMarker 
                    key={`alert-${valve.device_id}`}
                    center={[valve.lat, valve.lon]} 
                    radius={45}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, dashArray: "5, 10", stroke: true, weight: 3 }}
                    className="animate-spin-slow"
                  />
                )
              }
              return null;
            })}
          </MapContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 pb-10">
        <div className="glass-card p-8 rounded-3xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-extrabold text-textH tracking-tight">Recent Schedules</h2>
            <button className="text-sm font-bold text-accent hover:text-blue-300 transition-colors uppercase tracking-wider bg-blue-900/30 border border-blue-500/20 px-3 py-1.5 rounded-lg">View All</button>
          </div>
          <div className="space-y-4 flex-1 relative z-10">
            {schedulesData.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                 <Clock size={48} className="mb-4 opacity-20" strokeWidth={1.5} />
                 <p className="font-medium text-lg text-slate-400">No active schedules</p>
               </div>
            ) : schedulesData.map((sched) => (
              <div key={sched.id} className="group/item flex items-center justify-between p-5 bg-social-bg/60 hover:bg-social-bg rounded-2xl transition-all duration-300 border border-border hover:border-slate-500 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className={`p-3.5 rounded-2xl shadow-sm border ${sched.status === 'completed' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' : 'bg-blue-900/40 text-accent border-blue-500/30'}`}>
                    {sched.status === 'completed' ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <Droplet size={22} strokeWidth={2.5} fill="currentColor" fillOpacity={0.2} />}
                  </div>
                  <div>
                    <p className="font-extrabold text-textH text-lg group-hover/item:text-accent transition-colors">{sched.device_id}</p>
                    <p className="text-sm text-slate-400 font-semibold mt-0.5">Starts at {sched.start_time} • {sched.duration}m duration</p>
                  </div>
                </div>
                <span className={`px-4 py-2 text-[11px] font-black rounded-xl uppercase tracking-widest shadow-sm border ${sched.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-amber-900/30 text-amber-400 border-amber-500/30'}`}>
                  {sched.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 rounded-3xl flex flex-col relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-red-500/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between mb-8 relative z-10">
             <div className="flex items-center gap-3">
               <h2 className="text-xl font-extrabold text-textH tracking-tight">Critical Alerts</h2>
               {alertsCount > 0 && (
                 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-black text-textH shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-pulse">
                   {alertsCount}
                 </span>
               )}
             </div>
          </div>
          <div className="space-y-4 flex-1 relative z-10">
            {alerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-emerald-400 bg-emerald-900/10 rounded-3xl border border-emerald-500/20 border-dashed py-10">
                <CheckCircle2 size={56} strokeWidth={1.5} className="mb-4 opacity-80" />
                <p className="font-extrabold text-xl">All Systems Nominal</p>
                <p className="font-medium text-emerald-500/80 mt-2">No critical alerts detected in the network.</p>
              </div>
            ) : (
               alerts
                 .filter((a) => a.severity === 'CRITICAL')
                 .slice(0, 4)
                 .map((alert, idx) => (
                   <div key={idx} className="flex items-start gap-5 p-5 bg-social-bg/80 hover:bg-red-900/20 rounded-2xl border border-border hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] cursor-pointer group/alert">
                     <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl shrink-0 border border-red-500/30 group-hover/alert:bg-red-500 group-hover/alert:text-textH transition-all">
                       <AlertTriangle size={22} strokeWidth={2.5} />
                     </div>
                     <div className="pt-0.5">
                       <p className="font-extrabold text-textH text-lg group-hover/alert:text-red-400 transition-colors uppercase tracking-tight">{alert.device_id}</p>
                       <p className="font-bold text-red-400/80 text-xs mt-1">{alert.type}</p>
                       <p className="text-sm text-slate-400 font-medium mt-1.5 leading-relaxed">
                         {alert.details}
                       </p>
                     </div>
                   </div>
                 ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, gradient, border, valueColor }) {
  // Overriding standard colors for dark mode logic mapping
  const darkBorder = border.replace('-100', '-500/30').replace('border-slate-100', 'border-border').replace('border-cyan-100', 'border-cyan-500/30').replace('border-blue-100', 'border-blue-500/30').replace('border-emerald-100', 'border-emerald-500/30');
  const darkValue = valueColor.replace('-900', '-300').replace('text-slate-700', 'text-textH');

  return (
    <div className={`glass-card p-6 rounded-3xl flex items-center justify-between transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1.5 group relative overflow-hidden cursor-pointer`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 z-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className={`absolute inset-0 border-2 ${darkBorder} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
      <div className="relative z-10 pl-2">
        <p className="text-[11px] font-black text-slate-400 mb-2 tracking-widest uppercase">{title}</p>
        <p className={`text-4xl font-black tracking-tight ${darkValue}`}>{value}</p>
      </div>
      <div className={`relative z-10 p-4 rounded-[1.25rem] bg-social-bg/80 backdrop-blur-sm shadow-inner border border-border transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] mr-1`}>
        {icon}
      </div>
    </div>
  );
}

function MapPinIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" strokeWidth="2.5" />
      <circle cx="12" cy="10" r="3" strokeWidth="2.5" />
    </svg>
  );
}
