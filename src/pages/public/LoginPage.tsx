import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogIn, Lock, User, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const LoginPage: React.FC = () => {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim() || !password) {
      setError('Please provide both your Login ID and Password.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const user = await login(loginId.trim(), password);

      // Automatic redirection based purely on verified backend role
      if (user.role === 'SUPER_ADMIN' || user.role === 'PRINCIPAL') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/portal/dashboard', { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid Login ID or Password. Please verify and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-md w-full space-y-6">
        {/* College Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Digital Campus Sign In
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Sharadabai Pawar College, Omerga • SCSCO ERP
          </p>
        </div>

        {/* Authentication Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Login ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ADMIN001, STU001, FAC001"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium text-slate-900 uppercase placeholder-normal placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              Role is automatically determined by your verified institutional Login ID.
            </span>
          </div>
        </div>

        {/* Reference Accounts for Quick Testing */}
        <div className="bg-slate-100/80 rounded-2xl border border-slate-200/80 p-4 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Default Institutional Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <button
              type="button"
              onClick={() => { setLoginId('ADMIN001'); setPassword('Admin@123'); }}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 transition-colors"
            >
              <strong className="block text-slate-900 font-mono">ADMIN001</strong>
              <span>Super Admin (Admin@123)</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginId('STU001'); setPassword('Student@123'); }}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 transition-colors"
            >
              <strong className="block text-slate-900 font-mono">STU001</strong>
              <span>Student (Student@123)</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginId('FAC001'); setPassword('Faculty@123'); }}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 transition-colors"
            >
              <strong className="block text-slate-900 font-mono">FAC001</strong>
              <span>Faculty (Faculty@123)</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginId('PRIN001'); setPassword('Principal@123'); }}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 transition-colors"
            >
              <strong className="block text-slate-900 font-mono">PRIN001</strong>
              <span>Principal (Principal@123)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
