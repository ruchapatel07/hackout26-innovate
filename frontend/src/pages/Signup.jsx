import React, { useState } from 'react';
import { useAuth, roleNames } from '../context/AuthContext';
import { Eye, EyeOff, User, Phone, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Auth3DCanvas } from '../components/Auth3DCanvas.jsx';

export const Signup = () => {
  const { signup, navigatePage } = useAuth();

  const [role, setRole] = useState('buyer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup(name, phone, email, password, confirmPassword, role);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#020a05] text-white select-none overflow-x-hidden min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="w-full min-h-[650px] flex flex-col lg:flex-row flex-1">
        
        {/* LEFT COLUMN: 3D Three.js CO2 Molecular Bond Animation */}
        <div className="w-full lg:w-7/12 min-h-[500px] lg:min-h-[650px] relative flex flex-col border-b lg:border-b-0 lg:border-r border-emerald-900/40">
          <Auth3DCanvas role={role} />
        </div>

        {/* RIGHT COLUMN: Professional Dark Glass Signup Form */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-[#041208] relative z-10 min-h-[550px] lg:min-h-[650px]">
          
          {/* Form Main Container */}
          <div className="my-auto py-6 max-w-md w-full mx-auto space-y-5">
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 inline-block mb-2">
                Join Carbon Connect AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Select your account role and complete registration.
              </p>
            </div>

            {/* Account Type Role Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-emerald-300 block">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-[#082213] border border-emerald-800/60 shadow-inner">
                {(['buyer', 'seller', 'transporter']).map((r) => {
                  const isActive = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold capitalize transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-[1.02]'
                          : 'text-slate-400 hover:text-white hover:bg-emerald-900/30'
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-300 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-300 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10 digit mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-emerald-300 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-300 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-emerald-300 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-emerald-500/70 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs focus:outline-none focus:border-emerald-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400"
                    >
                      {showConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creating Account...' : `Register as ${roleNames[role]}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Bottom Toggle */}
            <div className="text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                onClick={() => navigatePage('login', { role })}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                Login here
              </button>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="pt-4 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 14064 Compliant
            </span>
            <span>SECURE ENTERPRISE NODE</span>
          </div>

        </div>

      </div>
    </section>
  );
};
