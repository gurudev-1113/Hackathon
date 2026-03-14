/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const ValveContext = createContext();

const API_BASE_URL = 'http://localhost:8080/valves';
const PIPELINE_URL = 'http://localhost:8080/pipelines';

export function ValveProvider({ children }) {
  const [valves, setValves] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const alerts = useMemo(() => {
    let generated = [];
    valves.forEach(valve => {
      const battery = valve.battery !== undefined ? valve.battery : 100;
      const motor_current = valve.motor_current !== undefined ? valve.motor_current : 0;
      const flow_rate = valve.flow_rate !== undefined ? valve.flow_rate : (valve.status === 'OPEN' ? 150 : 0);
      const pressure = valve.pressure !== undefined ? valve.pressure : 3.5;

      if (battery < 20) {
        generated.push({
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
        generated.push({
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
      if (valve.status === 'CLOSED' && flow_rate > 0) {
        generated.push({
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
      if (valve.status === 'OPEN' && flow_rate > 350 && pressure < 2.0) {
        generated.push({
          id: `${valve.device_id}_BURST`,
          device_id: valve.device_id,
          type: 'Pipe Burst',
          severity: 'CRITICAL',
          timestamp: 'Detected on Sync',
          details: `High flow (${flow_rate} L/min) and low pressure (${pressure} bar).`,
          cause: 'Major rupture in downstream pipe.',
          solution: 'AUTO-CLOSE INITIATED. Dispatch repair crew.'
        });
      }
    });
    return generated.sort((a, b) => (a.severity === 'CRITICAL' ? -1 : 1));
  }, [valves]);

  const fetchValves = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch valves');
      const data = await response.json();
      setValves(data);
    } catch (err) {
      console.warn('Backend not reached, using mock valves:', err);
      setError(null); // Clear error for demo mode
      if (valves.length === 0) {
        setValves([
          { device_id: 'WELL_DEMO', name: 'Demo Well', lat: 13.065, lon: 74.805, type: 'WELL', status: 'OPEN', battery: 100, motor_current: 0, flow_rate: 150, pressure: 3.5, temperature: 28, signal_strength: 100 },
          { device_id: 'VALVE_1', name: 'Valve 1', lat: 13.068, lon: 74.808, type: 'VALVE', status: 'CLOSED', battery: 85, motor_current: 2.1, flow_rate: 0, pressure: 3.2, temperature: 30, signal_strength: 90 },
          { device_id: 'VALVE_2', name: 'Valve 2', lat: 13.062, lon: 74.810, type: 'VALVE', status: 'OPEN', battery: 12, motor_current: 4.5, flow_rate: 140, pressure: 3.0, temperature: 32, signal_strength: 75 },
          { device_id: 'VALVE_3', name: 'Valve 3', lat: 13.070, lon: 74.802, type: 'VALVE', status: 'CLOSED', battery: 60, motor_current: 7.2, flow_rate: 5, pressure: 2.8, temperature: 29, signal_strength: 80 }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPipelines = async () => {
    try {
      const response = await fetch(PIPELINE_URL);
      if (!response.ok) throw new Error('Failed to fetch pipelines');
      const data = await response.json();
      setPipelines(data);
    } catch (err) {
      console.warn('Backend not reached, using mock pipelines:', err);
      if (pipelines.length === 0) {
        setPipelines([
          { id: 'pipe-demo-1', fromDeviceId: 'WELL_DEMO', toDeviceId: 'VALVE_1', type: 'MAIN' }
        ]);
      }
    }
  };

  useEffect(() => {
    fetchValves();
    fetchPipelines();
  }, []);

  const addValve = async (valve) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valve),
      });
      if (!response.ok) throw new Error('Failed to add valve');
      const data = await response.json();
      setValves(prev => [...prev, data]);
    } catch (err) {
      console.warn('Backend not reached, adding valve locally:', err);
      // Adding some randomness for demo alerts
      const mockValve = { 
        ...valve, 
        id: valve.id || Date.now(),
        // 10% chance to have low battery for demo purposes
        battery: Math.random() < 0.1 ? 15 : 95,
        // 5% chance to have high motor current
        motor_current: Math.random() < 0.05 ? 8.5 : (valve.status === 'OPEN' ? 4.2 : 0)
      };
      setValves(prev => [...prev, mockValve]);
    }
  };

  const addValves = async (newValves) => {
    try {
      const response = await fetch(`${API_BASE_URL}/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newValves),
      });
      if (!response.ok) throw new Error('Failed to add bulk valves');
      const data = await response.json();
      setValves(prev => [...prev, ...data]);
      return data;
    } catch (err) {
      console.warn('Backend not reached, adding valves locally:', err);
      setValves(prev => [...prev, ...newValves]);
      return newValves;
    }
  };

  const deleteValve = async (device_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${device_id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete valve');
      setValves(prev => prev.filter(v => v.device_id !== device_id));
      setPipelines(prev => prev.filter(p => p.fromDeviceId !== device_id && p.toDeviceId !== device_id));
    } catch (err) {
      console.warn('Backend not reached, deleting valve locally:', err);
      setValves(prev => prev.filter(v => v.device_id !== device_id));
      setPipelines(prev => prev.filter(p => p.fromDeviceId !== device_id && p.toDeviceId !== device_id));
    }
  };

  const updateValve = async (device_id, valveDetails) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${device_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valveDetails),
      });
      if (!response.ok) throw new Error('Failed to update valve');
      const data = await response.json();
      setValves(prev => prev.map(v => 
        v.device_id === device_id ? data : v
      ));
      return data;
    } catch (err) {
      console.warn('Backend not reached, updating valve locally:', err);
      setValves(prev => prev.map(v => 
        v.device_id === device_id ? { ...v, ...valveDetails } : v
      ));
      return valveDetails;
    }
  };

  const addPipeline = async (newPipeline) => {
    try {
      const response = await fetch(PIPELINE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPipeline),
      });
      if (!response.ok) throw new Error('Failed to add pipeline');
      const data = await response.json();
      setPipelines(prev => [...prev, data]);
      return data;
    } catch (err) {
      console.warn('Backend not reached, adding pipeline locally:', err);
      const mockPipeline = { ...newPipeline, id: 'pipe-' + Date.now() };
      setPipelines(prev => [...prev, mockPipeline]);
      return mockPipeline;
    }
  };

  const deletePipeline = async (id) => {
    try {
      const response = await fetch(`${PIPELINE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete pipeline');
      setPipelines(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.warn('Backend not reached, deleting pipeline locally:', err);
      setPipelines(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <ValveContext.Provider value={{
      valves,
      pipelines,
      alerts,
      loading,
      error,
      addValve,
      addValves,
      updateValve,
      deleteValve,
      addPipeline,
      deletePipeline,
      fetchValves,
      fetchPipelines
    }}>
      {children}
    </ValveContext.Provider>
  );
}

export function useValves() {
  const context = useContext(ValveContext);
  if (!context) {
    throw new Error('useValves must be used within a ValveProvider');
  }
  return context;
}
