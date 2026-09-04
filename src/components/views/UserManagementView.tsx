import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Mail,
  Phone,
  Building,
  Edit2,
  Trash2,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserStaff, Branch } from '../../types';
import { PremierLogo } from '../PremierLogo';

interface UserManagementViewProps {
  users: UserStaff[];
  branches: Branch[];
  onAddUser: (user: UserStaff) => void;
  onUpdateUser: (user: UserStaff) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  branches,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserStaff | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<UserStaff>>({
    name: '',
    username: '',
    password: '',
    email: '',
    role: 'Helpdesk Analyst',
    assignedBranchId: branches[0]?.id || 'br-01',
    phone: '',
    status: 'Active',
  });
  const [showPassword, setShowPassword] = useState(false);

  // Quick Password Reset Modal
  const [resetPwUser, setResetPwUser] = useState<UserStaff | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [showResetPw, setShowResetPw] = useState(false);

  const roles = [
    'IT Director',
    'Network Admin',
    'Systems Specialist',
    'Field Engineer',
    'Helpdesk Analyst',
    'Branch Supervisor',
  ];

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(term) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      u.email.toLowerCase().includes(term) ||
      u.role.toLowerCase().includes(term) ||
      u.assignedBranchName.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      password: 'premier@2026',
      email: '',
      role: 'Field Engineer',
      assignedBranchId: branches[0]?.id || 'br-01',
      phone: '+1 (555) 012-3456',
      status: 'Active',
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (user: UserStaff) => {
    setEditingUser(user);
    setFormData({
      ...user,
      password: user.password || 'premier@2026',
    });
    setShowPassword(false);
    setIsAddModalOpen(true);
  };

  const handleOpenResetPassword = (user: UserStaff) => {
    setResetPwUser(user);
    setNewResetPassword('premier@2026');
    setShowResetPw(false);
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPwUser || !newResetPassword) return;

    onUpdateUser({
      ...resetPwUser,
      password: newResetPassword,
      lastPasswordChange: new Date().toISOString().split('T')[0],
    });

    setResetPwUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find((b) => b.id === formData.assignedBranchId);
    const cleanUsername = (formData.username || formData.email?.split('@')[0] || 'user')
      .trim()
      .toLowerCase();

    if (editingUser) {
      onUpdateUser({
        ...editingUser,
        ...(formData as UserStaff),
        username: cleanUsername,
        assignedBranchName: branch?.name || editingUser.assignedBranchName,
      });
    } else {
      const newUser: UserStaff = {
        id: `usr-${Date.now()}`,
        name: formData.name || 'New Staff Member',
        username: cleanUsername,
        password: formData.password || 'premier@2026',
        email: formData.email || `${cleanUsername}@enterprise-it.corp`,
        role: (formData.role as any) || 'Field Engineer',
        assignedBranchId: formData.assignedBranchId || branches[0]?.id || 'br-01',
        assignedBranchName: branch?.name || 'Metropolitan Headquarters',
        status: (formData.status as any) || 'Active',
        phone: formData.phone || '+1 (555) 000-0000',
        activeTicketLoad: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastPasswordChange: new Date().toISOString().split('T')[0],
      };
      onAddUser(newUser);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <PremierLogo size="sm" showText={false} />
          <div>
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Users2 className="w-4 h-4 text-blue-600" />
              <span>IT Staff & User Role Management</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                {users.length} Active Accounts
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage team logins, usernames, passwords, field technicians, and branch permissions.
            </p>
          </div>
        </div>

        <button
          id="add-user-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by username, name, email, role, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-3.5 space-y-3 flex flex-col justify-between transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{user.name}</span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <span className="font-mono text-slate-500 font-semibold">@{user.username || 'user'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-mono font-semibold text-blue-700">{user.role}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    user.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Branch & Contact */}
              <div className="space-y-1 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.assignedBranchName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px]">{user.phone}</span>
                </div>
              </div>

              {/* Credentials & Security Info */}
              <div className="p-2 rounded bg-slate-50 border border-slate-100 space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-slate-400" />
                    <span>Password:</span>
                  </span>
                  <span className="font-mono text-slate-700 font-medium">••••••••</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Tickets: <strong className="text-blue-700">{user.activeTicketLoad} active</strong></span>
                  <span>2FA: {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Joined: {user.joinedDate}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenResetPassword(user)}
                  className="p-1 rounded text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-colors cursor-pointer"
                  title="Change Password"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(user)}
                  className="p-1 rounded text-slate-500 hover:text-blue-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Edit Staff Member & Credentials"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove staff user ${user.name}?`)) {
                      onDeleteUser(user.id);
                    }
                  }}
                  className="p-1 rounded text-slate-500 hover:text-red-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Delete Staff Member"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Password Reset Modal */}
      {resetPwUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                  Reset User Password
                </h3>
              </div>
              <button
                onClick={() => setResetPwUser(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Setting new credentials for <strong className="text-slate-900">{resetPwUser.name}</strong> (@{resetPwUser.username || 'user'}).
            </div>

            <form onSubmit={handleSaveResetPassword} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showResetPw ? 'text' : 'password'}
                    required
                    value={newResetPassword}
                    onChange={(e) => setNewResetPassword(e.target.value)}
                    className="w-full p-2 pr-8 rounded bg-white border border-slate-300 text-slate-800 font-mono text-xs focus:outline-none focus:border-amber-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPw(!showResetPw)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showResetPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPwUser(null)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Users2 className="w-4 h-4 text-blue-600" />
                <span>{editingUser ? 'Edit Staff & Credentials' : 'Add Staff Member'}</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Jordan Mitchell"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Username (@handle)</label>
                  <input
                    type="text"
                    required
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. jordan.mitchell"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="j.mitchell@enterprise-it.corp"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-600 font-semibold text-[11px] uppercase">Account Password</label>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, password: `premier@${Math.floor(1000 + Math.random() * 9000)}` })}
                      className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>Generate</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password || ''}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full p-2 pr-8 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Role</label>
                  <select
                    value={formData.role || 'Field Engineer'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Assigned Branch</label>
                  <select
                    value={formData.assignedBranchId || branches[0]?.id}
                    onChange={(e) => setFormData({ ...formData, assignedBranchId: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Direct Phone</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Status</label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Standby">Standby</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
                >
                  Save Profile & Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
