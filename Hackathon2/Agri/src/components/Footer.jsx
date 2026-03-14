import { Droplet, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-main border-t border-border relative z-10">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-green-500/20 p-1 flex items-center justify-center overflow-hidden shrink-0">
                <img src="/logo.png" alt="Agri Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <Droplet className="text-green-600 hidden" size={20} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-textH to-accent tracking-tight">
                OrbiPulse
              </span>
            </div>
            <p className="text-sm text-textH/60 leading-relaxed">
              Smart agricultural water management system for sustainable farming and optimal resource utilization.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-9 h-9 bg-social-bg rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors group">
                <Github size={16} className="text-textH/60 group-hover:text-accent transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 bg-social-bg rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors group">
                <Twitter size={16} className="text-textH/60 group-hover:text-accent transition-colors" />
              </a>
              <a href="#" className="w-9 h-9 bg-social-bg rounded-lg flex items-center justify-center hover:bg-accent/20 transition-colors group">
                <Linkedin size={16} className="text-textH/60 group-hover:text-accent transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-textH font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-sm text-textH/60 hover:text-accent transition-colors">Dashboard</a></li>
              <li><a href="/valves" className="text-sm text-textH/60 hover:text-accent transition-colors">Valve Management</a></li>
              <li><a href="/pump-monitoring" className="text-sm text-textH/60 hover:text-accent transition-colors">Pump Monitoring</a></li>
              <li><a href="/reports" className="text-sm text-textH/60 hover:text-accent transition-colors">Reports</a></li>
              <li><a href="/device-health" className="text-sm text-textH/60 hover:text-accent transition-colors">Device Health</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-textH font-semibold text-sm uppercase tracking-wider">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-textH/60 hover:text-accent transition-colors">Irrigation Control</a></li>
              <li><a href="#" className="text-sm text-textH/60 hover:text-accent transition-colors">Real-time Monitoring</a></li>
              <li><a href="#" className="text-sm text-textH/60 hover:text-accent transition-colors">Automated Scheduling</a></li>
              <li><a href="#" className="text-sm text-textH/60 hover:text-accent transition-colors">Alert Management</a></li>
              <li><a href="#" className="text-sm text-textH/60 hover:text-accent transition-colors">Data Analytics</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-textH font-semibold text-sm uppercase tracking-wider">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-accent" />
                <a href="mailto:support@orbipulse.com" className="text-sm text-textH/60 hover:text-accent transition-colors">
                  support@orbipulse.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-accent" />
                <a href="tel:+918012345678" className="text-sm text-textH/60 hover:text-accent transition-colors">
                  +91 80123 45678
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-accent" />
                <span className="text-sm text-textH/60">
                  Bangalore, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-textH/60">
              © 2026 OrbiPulse. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-textH/60 hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="text-textH/60 hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="text-textH/60 hover:text-accent transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
