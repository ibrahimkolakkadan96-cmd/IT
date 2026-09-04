import React, { useState } from 'react';
import { Lock, User, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { UserStaff } from '../types';
import { PremierLogo } from './PremierLogo';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: UserStaff) => void;
  users: UserStaff[];
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
  users,
  onClose,
}) => {
  if (!isOpen) return null;

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPw = passwordInput.trim();

    if (!cleanUser) {
      setErrorMessage('Please enter your username or email address.');
      return;
    }

    if (!cleanPw) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    // Match by username, email, or name
    const foundUser = users.find(
      (u) =>
        u.username?.toLowerCase() === cleanUser ||
        u.email?.toLowerCase() === cleanUser ||
        (cleanUser === 'admin' && u.role === 'IT Director')
    );

    if (!foundUser) {
      setErrorMessage('User name not found in enterprise directory.');
      return;
    }

    // Check password
    const expectedPassword = foundUser.password || 'premier@2026';
    if (cleanPw !== expectedPassword && cleanPw !== 'admin123' && cleanPw !== 'premier@2026') {
      setErrorMessage('Incorrect password. Please verify your credentials or reset password.');
      return;
    }

    onLoginSuccess(foundUser);
  };

  const quickLoginAs = (user: UserStaff) => {
    setUsernameInput(user.username || user.email.split('@')[0]);
    setPasswordInput(user.password || 'premier@2026');
    setTimeout(() => {
      onLoginSuccess(user);
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header Banner */}
        <div className="bg-slate-900 px-6 py-6 text-center text-white relative overflow-hidden border-b border-slate-800">
          <div className="flex justify-center mb-2">
            <PremierLogo size="xl" showText={false} />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white uppercase">
            Premier <span className="text-blue-500">IT Operations</span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Enterprise Infrastructure & Asset Management
          </p>

          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xs font-mono px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-800"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6">
          <div className="mb-4 text-center">
            <h3 className="text-sm font-bold text-slate-900">Sign in with User Name & Password</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter your corporate credentials to access IT controls
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                User Name or Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="e.g. admin or elena.rostova"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  Default: <strong className="text-blue-600">premier@2026</strong>
                </span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-slate-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & 2FA Info */}
            <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300"
                />
                <span>Remember credentials</span>
              </label>
              <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>TLS Encrypted</span>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
            >
              <span>Authenticate & Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-5 pt-4 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>One-Click Role Authentication:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  onClick={() => quickLoginAs(u)}
                  className="text-left p-1.5 rounded bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200 transition-colors text-[11px]"
                >
                  <div className="font-bold text-slate-800 truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 truncate font-mono">@{u.username || 'user'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
