import React, { useState } from 'react';
import { useAuth, roleNames } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff, Lock, Mail, Key, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo.jsx';
import { Auth3DCanvas } from '../components/Auth3DCanvas.jsx';

export const Login = () => {
  const { login, loginRole, setLoginRole, navigatePage } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (r) => {
    setLoginRole(r);
    setEmail('');
    setPassword('');
    setAdminKey('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password, loginRole, adminKey, rememberMe);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    showToast(
      'This is a demo project — in a live system a reset link would be emailed to you.',
      'error'
    );
  };

  return (
    <section className="w-full bg-[#020a05] text-white select-none overflow-x-hidden min-h-[calc(100vh-80px)] flex flex-col justify-center">
      <div className="w-full min-h-[650px] flex flex-col lg:flex-row flex-1">
        
        {/* LEFT COLUMN: 3D Three.js Crystal & Undulating Particle Wave Animation */}
        <div className="w-full lg:w-7/12 min-h-[500px] lg:min-h-[650px] relative flex flex-col border-b lg:border-b-0 lg:border-r border-emerald-900/40">
          <Auth3DCanvas role={loginRole} />
        </div>

        {/* RIGHT COLUMN: Professional Dark Glass Login Form */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-[#041208] relative z-10 min-h-[550px] lg:min-h-[650px]">
          

          {/* Form Main Container */}
          <div className="my-auto py-6 max-w-md w-full mx-auto space-y-6">
            
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60 inline-block mb-3">
                {roleNames[loginRole]} Workspace Access
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Select your workspace role to log into your dashboard.
              </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#082213] border border-emerald-800/60 shadow-inner">
              {(['buyer', 'seller', 'transporter', 'admin']).map((r) => {
                const isActive = loginRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRoleChange(r)}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-300 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder={`Enter ${loginRole} email (e.g. ${loginRole}@gmail.com)`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-emerald-300 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#082012] border border-emerald-800/60 text-white placeholder-emerald-700/60 text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Admin Security Key (Admin role only) */}
              {loginRole === 'admin' && (
                <div className="space-y-2.5 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5" /> Unique Admin Security Key
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('devjaypatel9@gmail.com');
                          setPassword('Devjay@9=');
                          setAdminKey('rrrd-dev-hackout26');
                        }}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                        title="Auto-fill Dev Patel credentials"
                      >
                        Fill Dev Patel
                      </button>
                      <span className="text-amber-600">|</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@carbonlink.com');
                          setPassword('password123');
                          setAdminKey('rrrd-dev-hackout26');
                        }}
                        className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 underline cursor-pointer"
                      >
                        Default Admin
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter security key (rrrd-dev-hackout26)"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0c1c11] border border-amber-700/50 text-white placeholder-amber-700/70 text-xs font-mono focus:outline-none focus:border-amber-400"
                  />
                  <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-medium">
                    <span>
                      Security key:{' '}
                      <button
                        type="button"
                        onClick={() => setAdminKey('rrrd-dev-hackout26')}
                        className="bg-amber-900/70 hover:bg-amber-800/80 px-2 py-0.5 rounded text-amber-200 font-mono font-bold cursor-pointer border border-amber-500/40 transition-all"
                        title="Click to auto-fill security key"
                      >
                        rrrd-dev-hackout26
                      </button>
                    </span>
                    <span className="text-amber-400/70 text-[10px]">(Click key to auto-fill)</span>
                  </div>
                </div>
              )}

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded accent-emerald-500 bg-[#082012] border-emerald-800 focus:ring-emerald-400"
                  />
                  <span>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : `Log into ${roleNames[loginRole]} Portal`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>

            {/* Bottom Toggle */}
            <div className="text-center pt-2 text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigatePage('signup')}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                Create Account
              </button>
            </div>

          </div>

          {/* Bottom Security Footer */}
          <div className="pt-6 border-t border-emerald-900/30 flex items-center justify-between text-[11px] text-slate-400">
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
