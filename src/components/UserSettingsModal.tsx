import React, { useState } from 'react';
import {
  X,
  User,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Sparkles,
  Lock,
  Building,
  Mail,
  Phone,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';
import { UserStaff, Branch } from '../types';
import { PremierLogo } from './PremierLogo';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserStaff;
  onUpdateUser: (updatedUser: UserStaff) => void;
  branches: Branch[];
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  branches,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'branding'>('password');

  // Profile / Username form states
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username || currentUser.email.split('@')[0]);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [assignedBranchId, setAssignedBranchId] = useState(currentUser.assignedBranchId);

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser.twoFactorEnabled || false);

  // Toast / Status
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Password strength logic
  const getPasswordStrength = (pw: string) => {
    if (!pw) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (pw.length >= 12) score++;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' };
    if (score === 3) return { score, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 4) return { score, label: 'Strong', color: 'bg-blue-600', text: 'text-blue-600' };
    return { score, label: 'Enterprise Grade', color: 'bg-emerald-600', text: 'text-emerald-600' };
  };

  const pwStrength = getPasswordStrength(newPassword);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
    let result = 'Premier';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '2026!';
    setNewPassword(result);
    setConfirmPassword(result);
    setShowNewPw(true);
    setShowConfirmPw(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatusMessage({ type: 'error', text: 'Username cannot be empty.' });
      return;
    }

    const branch = branches.find((b) => b.id === assignedBranchId);

    const updated: UserStaff = {
      ...currentUser,
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim(),
      phone: phone.trim(),
      assignedBranchId,
      assignedBranchName: branch?.name || currentUser.assignedBranchName,
    };

    onUpdateUser(updated);
    setStatusMessage({ type: 'success', text: 'Username and profile details saved successfully!' });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if new password is provided
    if (!newPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter a new password.' });
      return;
    }

    if (newPassword.length < 6) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New passwords do not match. Please verify confirmation.' });
      return;
    }

    // Check current password if configured
    const storedPw = currentUser.password || 'premier@2026';
    if (currentPassword && currentPassword !== storedPw) {
      setStatusMessage({ type: 'error', text: 'Current password is incorrect.' });
      return;
    }

    const updated: UserStaff = {
      ...currentUser,
      password: newPassword,
      lastPasswordChange: new Date().toISOString().split('T')[0],
      twoFactorEnabled,
    };

    onUpdateUser(updated);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setStatusMessage({
      type: 'success',
      text: 'Password successfully updated! Your new login credentials are now active.',
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-md border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Premier Logo */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <PremierLogo size="sm" showText={false} />
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                <span>Account & Credential Settings</span>
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-1.5 py-0.2 rounded border border-blue-400/30">
                  {currentUser.role}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Manage user name, system password, and enterprise identity
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold px-4 pt-1">
          <button
            onClick={() => {
              setActiveTab('password');
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'password'
                ? 'border-blue-600 text-blue-600 bg-white -mb-px rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password & Security</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('profile');
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-white -mb-px rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User Name & Profile</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('branding');
              setStatusMessage(null);
            }}
            className={`px-4 py-2.5 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'branding'
                ? 'border-blue-600 text-blue-600 bg-white -mb-px rounded-t'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Logo & Branding</span>
          </button>
        </div>

        {/* Notification Toast Banner */}
        {statusMessage && (
          <div
            className={`mx-5 mt-4 p-3 rounded text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-red-50 text-red-800 border-red-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="p-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* TAB 1: PASSWORD SETTING */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded text-xs text-blue-900 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Credential Management for: </span>
                  <span className="font-mono font-semibold">{currentUser.username || 'admin'}</span>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Setting a new password will update your active authentication session and security credentials.
                  </p>
                </div>
              </div>

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Current Password (Optional for verification)
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password if known (default: premier@2026)"
                    className="w-full px-3 py-1.5 pr-9 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* New Password & Generator */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Strong Password</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password..."
                    className="w-full px-3 py-1.5 pr-9 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Strength Meter */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Password Strength:</span>
                      <span className={`font-semibold ${pwStrength.text}`}>{pwStrength.label}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1 h-1.5 bg-slate-100 rounded overflow-hidden">
                      <div className={`h-full ${pwStrength.score >= 1 ? pwStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full ${pwStrength.score >= 2 ? pwStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full ${pwStrength.score >= 3 ? pwStrength.color : 'bg-slate-200'}`} />
                      <div className={`h-full ${pwStrength.score >= 4 ? pwStrength.color : 'bg-slate-200'}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password to confirm..."
                    className="w-full px-3 py-1.5 pr-9 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-[11px] text-red-600 mt-1">Passwords do not match.</p>
                )}
              </div>

              {/* 2FA Toggle */}
              <div className="pt-2 border-t border-slate-200">
                <label className="flex items-center justify-between p-2.5 rounded bg-slate-50 border border-slate-200 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-slate-500">Require an authenticator code when signing in</div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: USER NAME & PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Username handle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    System User Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-xs">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. admin or alex.rivera"
                      className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Unique login handle for enterprise portal access</p>
                </div>

                {/* Display Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Display Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rostova"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Direct Phone / Extension
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                {/* Assigned Branch */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Station / Branch
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={assignedBranchId}
                      onChange={(e) => setAssignedBranchId(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name} ({b.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Role info banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500">Assigned Privilege Tier: </span>
                  <strong className="text-slate-800">{currentUser.role}</strong>
                </div>
                <span className="text-[10px] font-mono text-slate-400">ID: {currentUser.id}</span>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded border border-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save User Name & Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BRANDING & PREMIER LOGO */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded text-center space-y-3">
                <div className="flex justify-center">
                  <PremierLogo size="2xl" showText={false} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Premier Enterprise IT Identity</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-0.5">
                    Industrial gear emblem featuring tri-color sectoring (Red, Blue, Green) and central "P" insignia.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium font-mono">
                  <Check className="w-3.5 h-3.5" />
                  <span>Integrated into Header, Navigation, Login & Reports</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs">
                <div className="font-semibold text-slate-800">Where this logo appears:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li>Top-left expandable navigation bar header</li>
                  <li>Main top bar next to system views</li>
                  <li>Secure sign-in & credential validation screen</li>
                  <li>Exported PDF/audit asset printouts</li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
