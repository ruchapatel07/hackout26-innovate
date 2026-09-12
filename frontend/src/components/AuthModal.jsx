import React, { useState } from 'react';
import { X, User, Lock, Mail, Building, MapPin } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [role, setRole] = useState('producer');
  
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('Houston, TX');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';
    const payload = isLoginMode
      ? { email, password }
      : { name, companyName, email, password, role, location };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        onAuthSuccess(data.user, data.token);
        onClose();
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setLoading(false);
      setError('Server communication error');
    }
  };

  const handleDemoLogin = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setRole(demoRole);
    setIsLoginMode(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-brand-green/30 my-8">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-xl font-bold text-white">
            {isLoginMode ? 'Account Sign In' : 'Register Account'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Account Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="producer">Producer (CO₂ Emitter)</option>
                  <option value="consumer">Consumer (CO₂ Utilization)</option>
                  <option value="logistics">Logistics Provider</option>
                  <option value="admin">Platform Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="e.g. producer1@cement.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-green to-brand-emerald text-dark-950 font-extrabold text-xs shadow-lg shadow-brand-green/20"
          >
            {loading ? 'Processing...' : isLoginMode ? 'Sign In to Marketplace' : 'Create Account'}
          </button>

        </form>

        {/* Demo Quick Accounts */}
        <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 text-center">Quick Demo Login Shortcuts</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => handleDemoLogin('producer1@cement.com', 'producer')}
              className="p-2 rounded-lg bg-dark-900 border border-slate-800 hover:border-brand-green text-slate-300 font-semibold"
            >
              Producer (Apex Cement)
            </button>
            <button
              onClick={() => handleDemoLogin('consumer1@biofuel.com', 'consumer')}
              className="p-2 rounded-lg bg-dark-900 border border-slate-800 hover:border-brand-cyan text-slate-300 font-semibold"
            >
              Consumer (BioFuel)
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-xs text-brand-green font-semibold hover:underline"
          >
            {isLoginMode ? "Don't have an account? Register here" : 'Already registered? Sign in'}
          </button>
        </div>

      </div>
    </div>
  );
};
