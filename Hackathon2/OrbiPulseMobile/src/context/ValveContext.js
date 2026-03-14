import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ValveContext = createContext();

const API_BASE_URL = 'http://10.0.2.2:8080/valves';
const STORAGE_KEY = '@OrbiPulse:DeviceData';

export const ValveProvider = ({ children }) => {
  const [valves, setValves] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load cached data on mount
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setValves(parsed.valves || []);
          setPumps(parsed.pumps || []);
          setSensors(parsed.sensors || []);
          setSchedules(parsed.schedules || []);
          setLastUpdated(new Date(parsed.timestamp));
        }
      } catch (e) {
        console.warn('Failed to load cached data', e);
      }
    };
    loadCachedData();
  }, []);

  const fetchValves = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    else if (!lastUpdated) setLoading(true);

    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      const timestamp = new Date();
      setValves(data);
      setLastUpdated(timestamp);
      
      // Cache the result
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ 
        valves: data, 
        pumps, 
        sensors, 
        schedules, 
        timestamp 
      }));
    } catch (error) {
      console.warn('Backend reachability issue. Using demo data.');
      const demoValves = [
        { device_id: 'WELL_DEMO', name: 'Main Well', type: 'WELL', status: 'OPEN', battery: 98, flow_rate: 45, current: 8.5 },
        { device_id: 'VALVE_1', name: 'West Orchard', type: 'VALVE', status: 'CLOSED', battery: 85, flow_rate: 0, current: 0.1 },
        { device_id: 'VALVE_2', name: 'East Field', type: 'VALVE', status: 'OPEN', battery: 12, flow_rate: 15, current: 1.2 },
        { device_id: 'VALVE_3', name: 'Nursery', type: 'VALVE', status: 'OPEN', battery: 60, flow_rate: 12, current: 1.1 },
      ];
      
      const demoPumps = [
        { id: 'PUMP_01', name: 'Primary Pump', status: 'ON', pressure: 4.2, usage: 1250, health: 'GOOD' },
        { id: 'PUMP_02', name: 'Secondary Pump', status: 'OFF', pressure: 0.1, usage: 850, health: 'WARNING' },
      ];

      const demoSensors = [
        { id: 'SEN_01', name: 'Moisture S1', type: 'MOISTURE', value: 35, unit: '%' },
        { id: 'SEN_02', name: 'Temp S1', type: 'TEMPERATURE', value: 24, unit: '°C' },
        { id: 'SEN_03', name: 'Humidity S1', type: 'HUMIDITY', value: 65, unit: '%' },
      ];

      const demoSchedules = [
        { id: 'SCH_01', device: 'West Orchard', days: ['Mon', 'Wed', 'Fri'], startTime: '06:00', duration: '30 min', active: true },
        { id: 'SCH_02', device: 'Nursery', days: ['Daily'], startTime: '08:00', duration: '15 min', active: true },
      ];

      setValves(demoValves);
      setPumps(demoPumps);
      setSensors(demoSensors);
      setSchedules(demoSchedules);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [pumps, sensors, schedules, lastUpdated]);

  useEffect(() => {
    fetchValves();
    const interval = setInterval(() => fetchValves(), 15000);
    return () => clearInterval(interval);
  }, [fetchValves]);

  const alerts = useMemo(() => {
    let generated = [];
    valves.forEach(v => {
      if (v.battery < 20) generated.push({ id: `${v.device_id}_BATT`, device: v.name, message: `Low Battery: ${v.battery}%`, type: 'WARNING' });
      if (v.status === 'CLOSED' && (v.flow_rate || 0) > 0) generated.push({ id: `${v.device_id}_LEAK`, device: v.name, message: `Leak Detected: Flow while closed.`, type: 'CRITICAL' });
    });
    pumps.forEach(p => {
      if (p.health === 'WARNING') generated.push({ id: `${p.id}_HEALTH`, device: p.name, message: 'Unusual motor vibration detected.', type: 'WARNING' });
    });
    return generated;
  }, [valves, pumps]);

  return (
    <ValveContext.Provider value={{ 
      valves, pumps, sensors, schedules, alerts, 
      loading, refreshing, lastUpdated, fetchValves 
    }}>
      {children}
    </ValveContext.Provider>
  );
};

export const useValves = () => useContext(ValveContext);
