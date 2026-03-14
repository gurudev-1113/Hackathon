import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, Leaf, Activity, Lock, Mail, ArrowRight, Eye, EyeOff, Phone } from 'lucide-react';
import authService from '../services/authService';

export default function Login() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [identifier, setIdentifier] = useState(''); // For login - accepts email or mobile
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    if (isRegisterMode) {
      if (!fullName.trim()) {
        setErrorMsg('Full Name is required');
        return false;
      }
      if (!email.trim()) {
        setErrorMsg('Email Address is required');
        return false;
      }
      if (!password.trim()) {
        setErrorMsg('Password is required');
        return false;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters');
        return false;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match');
        return false;
      }
      if (!mobile.trim()) {
        setErrorMsg('Mobile Number is required');
        return false;
      }
      if (!/^[6-9]\d{9}$/.test(mobile)) {
        setErrorMsg('Invalid mobile number format');
        return false;
      }
    } else {
      // Login validation - check if identifier is email or mobile
      const identifierValue = identifier.trim();
      if (!identifierValue) {
        setErrorMsg('Email or Mobile Number is required');
        return false;
      }
      
      // Validate if it's a valid email or mobile number
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifierValue);
      const isMobile = /^[6-9]\d{9}$/.test(identifierValue);
      
      if (!isEmail && !isMobile) {
        setErrorMsg('Please enter a valid email address or mobile number');
        return false;
      }
      
      if (!password.trim()) {
        setErrorMsg('Password is required');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setErrorMsg('');
    setIsLoading(true);
    
    try {
      if (isRegisterMode) {
        // Register new user
        const userData = {
          fullName: fullName.trim(),
          email: email.trim(),
          password: password,
          mobileNumber: mobile.trim()
        };
        
        const response = await authService.register(userData);
        console.log('Registration successful:', response);
        
        // Reset form and switch to login mode
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setMobile('');
        setIsRegisterMode(false);
        setErrorMsg('Registration successful! Please sign in.');
      } else {
        // Login user
        const credentials = {
          identifier: identifier.trim(), // Use single identifier field
          password: password
        };
        
        const response = await authService.login(credentials);
        console.log('Login successful:', response);
        
        // Store user info in localStorage
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
        if (isEmail) {
          localStorage.setItem('userEmail', identifier.trim());
        } else {
          localStorage.setItem('userMobile', identifier.trim());
        }
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMsg(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsRegisterMode(!isRegisterMode);
    setErrorMsg('');
    setFullName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setMobile('');
    setIdentifier(''); // Reset identifier field when switching modes
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Left side: Login Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 lg:p-12 relative z-10 bg-white/90 backdrop-blur-2xl shadow-2xl border-r border-slate-100">
        <div className="w-full max-w-md space-y-10">
          <div className="text-center group cursor-default">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-[2rem] bg-white shadow-2xl shadow-green-500/20 p-2 mb-6 border border-slate-100 group-hover:scale-105 transition-transform duration-500">
              <div className="w-full h-full bg-slate-50 rounded-3xl flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="OrbiPulse Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <Droplet className="text-green-600 hidden" size={48} strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">OrbiPulse</h1>
            <p className="text-slate-500 font-medium tracking-wide">Smart Agriculture Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {isRegisterMode && (
                <div className="relative group animate-in slide-in-from-top-2 fade-in">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Activity size={20} strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                    placeholder="Full Name"
                    required={isRegisterMode}
                  />
                </div>
              )}

              {!isRegisterMode ? (
                // Single identifier field for login
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {identifier && /^[6-9]\d{9}$/.test(identifier) ? <Phone size={20} strokeWidth={2} /> : <Mail size={20} strokeWidth={2} />}
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                    placeholder="Email Address or Mobile Number"
                    required
                  />
                </div>
              ) : (
                // Separate email and mobile fields for registration
                <>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail size={20} strokeWidth={2} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Email Address"
                      required={isRegisterMode}
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Phone size={20} strokeWidth={2} />
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                      placeholder="Mobile Number (e.g. 9876543210)"
                      required={isRegisterMode}
                      pattern="[6-9][0-9]{9}"
                      maxLength="10"
                    />
                  </div>
                </>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={20} strokeWidth={2} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {isRegisterMode && (
                <div className="relative group animate-in slide-in-from-top-2 fade-in">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={20} strokeWidth={2} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-inner"
                    placeholder="Confirm Password"
                    required={isRegisterMode}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className={`p-3 rounded-lg text-sm font-bold text-center ${errorMsg.includes('successful') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {errorMsg}
              </div>
            )}

            {!isRegisterMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input type="checkbox" className="peer w-5 h-5 appearance-none rounded-lg border-2 border-slate-300 checked:bg-blue-600 checked:border-blue-600 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 peer-checked:opacity-100 transition-opacity">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-xl shadow-green-600/20 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     Authenticating...
                   </>
                ) : (
                   <>
                     {isRegisterMode ? 'Create Account' : 'Sign In'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                   </>
                )}
              </span>
            </button>
          </form>
          
          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            {isRegisterMode ? 'Already have an account?' : "Don't have an account?"} 
            <button type="button" onClick={handleModeSwitch} className="font-bold text-blue-600 hover:text-blue-800 transition-colors ml-1">
              {isRegisterMode ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>
      </div>

        {/* Right side: Visual and 3D overlays */}
      <div className="hidden lg:flex w-7/12 relative bg-slate-900 items-center justify-center overflow-hidden">
        {/* Background Image (Smart Agriculture Aesthetic) */}
        <div className="absolute inset-0 z-0 mix-blend-overlay">
           <img 
             src="/farmer.png" 
             alt="3D Farmer Model" 
             className="w-full h-full object-cover opacity-80"
             onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1628045338048-fd208e9cc727?q=80&w=2070&auto=format&fit=crop"; }}
           />
        </div>
        
        {/* Hovering 3D Animation (OrbiPulse Sensor) */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none perspective-1000">
           <div className="relative w-96 h-96 transform-style-3d animate-[float_6s_ease-in-out_infinite]">
              {/* Outer Ring 1 */}
              <div className="absolute inset-0 border-[4px] border-emerald-400/30 rounded-full animate-[spin-3d-1_8s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="absolute -top-2 left-1/2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
                 <div className="absolute -bottom-2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </div>
              {/* Outer Ring 2 */}
              <div className="absolute inset-4 border-[4px] border-cyan-400/30 rounded-full animate-[spin-3d-2_12s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="absolute top-1/2 -left-2 w-3 h-3 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                 <div className="absolute top-1/2 -right-2 w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              </div>
              {/* Outer Ring 3 */}
              <div className="absolute inset-8 border-[4px] border-green-400/30 rounded-full animate-[spin-3d-3_10s_linear_infinite]" style={{ transformStyle: 'preserve-3d' }}>
                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]" />
              </div>
              
              {/* Central Glowing Orb */}
              <div className="absolute inset-0 m-auto w-32 h-32 bg-white/10 backdrop-blur-xl rounded-full border border-white/30 shadow-[0_0_50px_rgba(52,211,153,0.4)] flex items-center justify-center animate-[pulse-glow_3s_ease-in-out_infinite]">
                 <div className="absolute inset-2 bg-gradient-to-tr from-emerald-500 to-cyan-400 rounded-full blur-md opacity-60 animate-pulse" />
                 <div className="relative z-10 w-20 h-20 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-inner">
                    <Leaf className="text-white drop-shadow-md" size={40} strokeWidth={2} />
                 </div>
              </div>
           </div>
        </div>

        {/* Animated Gradient Meshes */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-slate-900/90 to-emerald-900/90 z-0" />
        <div className="absolute -bottom-64 -left-64 w-[40rem] h-[40rem] bg-emerald-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob z-0" />
        <div className="absolute -top-64 -right-64 w-[40rem] h-[40rem] bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000 z-0" />

        {/* Floating 3D-like Widgets */}
        <div className="relative z-20 w-full max-w-2xl px-12 mt-40">
           <div className="mb-12 backdrop-blur-sm bg-slate-900/30 p-8 rounded-3xl border border-white/10 shadow-2xl">
             <h2 className="text-5xl font-black text-white leading-tight mb-4 drop-shadow-lg">
               Precision<br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
                 Farming
               </span> At Scale.
             </h2>
             <p className="text-emerald-50 text-xl font-medium max-w-lg leading-relaxed drop-shadow">
               Monitor telemetry, execute autonomous schedules, and optimize water yields across your entire network.
             </p>
           </div>
        </div>
      </div>
      
      {/* Required custom CSS for the 3D spins */}
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        @keyframes spin-3d-1 {
          0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
          100% { transform: rotateX(60deg) rotateY(360deg) rotateZ(360deg); }
        }
        @keyframes spin-3d-2 {
          0% { transform: rotateX(120deg) rotateY(45deg) rotateZ(0deg); }
          100% { transform: rotateX(120deg) rotateY(45deg) rotateZ(360deg); }
        }
        @keyframes spin-3d-3 {
          0% { transform: rotateX(30deg) rotateY(120deg) rotateZ(0deg); }
          100% { transform: rotateX(30deg) rotateY(120deg) rotateZ(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(52,211,153,0.3); }
          50% { transform: scale(1.05); box-shadow: 0 0 60px rgba(52,211,153,0.6); }
        }
      `}} />
    </div>
  );
}
