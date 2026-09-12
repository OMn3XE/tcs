import React, { useState } from 'react';
import { X, LogIn, UserPlus, Sparkles, Mail, Lock, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (mode === 'register' && password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        const result = await login(username, password);
        if (result.success) {
          setSuccessMsg('Successfully logged in!');
          setTimeout(() => {
            onClose();
            setUsername('');
            setPassword('');
          }, 600);
        } else {
          setErrorMsg(result.error || 'Failed to sign in. Please check credentials.');
        }
      } else {
        const result = await register(username, password, email);
        if (result.success) {
          setSuccessMsg('Account created successfully! Welcome to CanteenAI.');
          setTimeout(() => {
            onClose();
            setUsername('');
            setPassword('');
            setEmail('');
          }, 600);
        } else {
          setErrorMsg(result.error || 'Registration failed. Try a different username.');
        }
      }
    } catch (err) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              CanteenAI Auth
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Join CanteenAI'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login'
              ? 'Sign in to access your saved food preferences & history'
              : 'Create a student account for personalized smart recommendations'}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1">
          <button
            onClick={() => {
              setMode('login');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setMode('register');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>

        {/* Form Area */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Username</label>
            <div className="relative flex items-center">
              <UserIcon className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. alex_student"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Email Input (Register Mode Only) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Student Email (Optional)</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@college.edu"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-slate-50/50"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Account' : 'Create Account'}</span>
                <Sparkles className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Guest Notice */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            Or continue exploring in <strong className="text-slate-700">Guest Mode</strong> with instant AI recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};
