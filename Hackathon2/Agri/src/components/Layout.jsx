import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSMSAlert from './MobileSMSAlert';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-main font-sans text-textH">
        {/* Animated Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
           <div className="absolute top-[-15%] left-[-10%] w-2/3 h-2/3 bg-indigo-900/30 rounded-full blur-[150px] mix-blend-screen animate-blob" />
           <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-emerald-900/30 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-2000" />
           <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-cyan-900/30 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
        </div>

      <Sidebar />
      <div className="ml-64 relative z-10">
        <div className="p-8 pb-24">
          <MobileSMSAlert />
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
