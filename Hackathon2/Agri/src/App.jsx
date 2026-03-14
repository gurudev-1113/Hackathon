import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ValveProvider } from './context/ValveContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ValveList from './pages/ValveList';
import ValveDetail from './pages/ValveDetail';
import Scheduler from './pages/Scheduler';
import ConditionMonitoring from './pages/ConditionMonitoring';
import Alerts from './pages/Alerts';
import PumpMonitoring from './pages/PumpMonitoring';
import Reports from './pages/Reports';
import DeviceHealth from './pages/DeviceHealth';
import DeviceConfig from './pages/DeviceConfig';
import OTAUpdate from './pages/OTAUpdate';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <ValveProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/valves" element={<ValveList />} />
            <Route path="/valves/:id" element={<ValveDetail />} />
            <Route path="/scheduler" element={<Scheduler />} />
            <Route path="/condition-monitoring" element={<ConditionMonitoring />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/pump-monitoring" element={<PumpMonitoring />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/device-health" element={<DeviceHealth />} />
            <Route path="/device-config" element={<DeviceConfig />} />
            <Route path="/ota-update" element={<OTAUpdate />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </ValveProvider>
    </BrowserRouter>
  );
}

export default App;
