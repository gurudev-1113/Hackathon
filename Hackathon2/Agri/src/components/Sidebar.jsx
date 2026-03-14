import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Droplet, List, Activity, Bell, Settings2, CloudCog, BarChart3, HeartPulse, User, LogOut, Home } from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };
  const links = [
    { to: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/valves', icon: <List size={20} />, label: 'Valve Details' },
    { to: '/pump-monitoring', icon: <Droplet size={20} />, label: 'Pump Monitor' },
    { to: '/scheduler', icon: <List size={20} />, label: 'Scheduler' },
    { to: '/alerts', icon: <Bell size={20} />, label: 'Alerts' },
    { to: '/device-health', icon: <HeartPulse size={20} />, label: 'Device Health' },
    { to: '/device-config', icon: <Settings2 size={20} />, label: 'Configuration' },
    { to: '/ota-update', icon: <CloudCog size={20} />, label: 'OTA Updates' },
    { to: '/reports', icon: <BarChart3 size={20} />, label: 'Reports' },
    { to: '/profile', icon: <User size={20} />, label: 'User Profile' },
  ];

  return (
    <div className="w-64 bg-main text-textH flex flex-col fixed left-0 top-0 border-r border-border shadow-2xl z-50">
      <div className="p-8 flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-white rounded-xl shadow-lg shadow-green-500/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
          <img src="/logo.png" alt="Agri Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <Droplet className="text-green-600 hidden" size={24} strokeWidth={2.5} />
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-textH to-accent tracking-tight">
          OrbiPulse
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-accent-bg text-accent font-medium' 
                  : 'hover:bg-social-bg hover:text-textH font-medium text-textH/70'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {link.icon}
                </div>
                <span>{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-6 mt-auto space-y-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 font-medium text-textH/70 group"
        >
          <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />
          <span>Logout</span>
        </button>
        <div className="bg-main rounded-2xl p-4 border border-border flex flex-col items-center text-center shadow-inner">
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] mb-3 animate-pulse" />
           <p className="text-xs font-bold text-textH font-sans tracking-wide uppercase">System Online</p>
           <p className="text-[10px] text-textH/60 mt-1 font-medium">v.1.0 Prototype</p>
        </div>
      </div>
    </div>
  );
}
