import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Building,
  ChevronDown,
  Monitor,
  RefreshCw,
  KeyRound,
  Lock,
  Settings,
  Shield,
} from 'lucide-react';
import { Branch, SystemNotification, UserStaff, ModuleTab } from '../types';
import { PremierLogo } from './PremierLogo';

interface HeaderBarProps {
  branches: Branch[];
  selectedBranchId: string;
  setSelectedBranchId: (branchId: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  notifications: SystemNotification[];
  currentUser: UserStaff;
  setCurrentUser: (user: UserStaff) => void;
  allUsers: UserStaff[];
  activeTab?: ModuleTab;
  onOpenNewTicket: () => void;
  onOpenNewAsset: () => void;
  onOpenRemoteDiagnostic: () => void;
  onNavigateTo: (tab: ModuleTab) => void;
  onMarkNotificationRead: (id: string) => void;
  onOpenUserSettings?: () => void;
  onLockSession?: () => void;
}

const tabTitles: Record<ModuleTab, string> = {
  dashboard: 'DASHBOARD OVERVIEW',
  branches: 'BRANCH MANAGEMENT',
  assets: 'ASSET MANAGEMENT',
  tickets: 'IT TICKETS & INCIDENTS',
  maintenance: 'MAINTENANCE & SERVICING',
  network: 'NETWORK MONITORING',
  remote: 'REMOTE SUPPORT & SHELL',
  warranties: 'WARRANTY & SLA CONTRACTS',
  'spare-parts': 'SPARE PARTS INVENTORY',
  reports: 'REPORTS & ANALYTICS',
  notifications: 'SYSTEM NOTIFICATIONS',
  users: 'USER & STAFF DIRECTORY',
};

export const HeaderBar: React.FC<HeaderBarProps> = ({
  branches = [],
  selectedBranchId,
  setSelectedBranchId,
  searchQuery,
  setSearchQuery,
  notifications = [],
  currentUser,
  setCurrentUser,
  allUsers = [],
  activeTab = 'dashboard',
  onOpenNewTicket,
  onOpenNewAsset,
  onOpenRemoteDiagnostic,
  onNavigateTo,
  onMarkNotificationRead,
  onOpenUserSettings,
  onLockSession,
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const safeBranches = Array.isArray(branches) ? branches : [];
  const safeUsers = Array.isArray(allUsers) ? allUsers : [];

  const unreadNotifs = safeNotifications.filter((n) => !n.isRead);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const selectedBranch = safeBranches.find((b) => b.id === selectedBranchId);

  return (
    <header
      id="main-app-header"
      className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-20"
    >
      {/* Left: View Title, Branch Selector & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-2xl">
        <div className="flex items-center gap-2">
          <PremierLogo size="xs" showText={false} />
          <h1 className="text-sm font-bold text-slate-800 tracking-tight shrink-0 hidden sm:block">
            {tabTitles[activeTab] || 'DASHBOARD OVERVIEW'}
          </h1>
        </div>

        {/* Branch Selector Pill */}
        <div className="relative shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-100 rounded px-2.5 py-1 text-slate-600 text-[10px] border border-slate-200 font-medium">
            <Building className="w-3 h-3 text-slate-500" />
            <select
              id="branch-selector-dropdown"
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent border-none text-slate-700 text-[11px] focus:outline-none cursor-pointer pr-1 font-medium"
            >
              <option value="ALL">Branch: Global Topology (All)</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  Branch: {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Global Quick Search Input */}
        <div className="relative flex-1 hidden md:block max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search assets, tickets, serials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1 rounded bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-slate-400 hover:text-slate-700 px-1 rounded bg-slate-200 font-mono"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Quick Action Button: New Ticket */}
        <button
          id="header-create-ticket-btn"
          onClick={onOpenNewTicket}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Ticket</span>
        </button>

        {/* Quick Action Button: Add Asset */}
        <button
          id="header-add-asset-btn"
          onClick={onOpenNewAsset}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Asset</span>
        </button>

        {/* Quick Action: Remote Shell */}
        <button
          id="header-remote-support-btn"
          onClick={onOpenRemoteDiagnostic}
          className="hidden xl:flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition-colors"
          title="Open Remote Diagnostic Console"
        >
          <Monitor className="w-3.5 h-3.5 text-slate-600" />
          <span>Remote Shell</span>
        </button>

        {/* Sync / Refresh */}
        <button
          id="header-refresh-sync-btn"
          onClick={handleRefresh}
          className={`p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
            isRefreshing ? 'animate-spin text-blue-600' : ''
          }`}
          title="Sync live telemetry"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Notifications Toggle */}
        <div className="relative">
          <button
            id="notifications-toggle-btn"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded bg-white border border-slate-200 shadow-xl z-50 p-3 space-y-2 text-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <span>SYSTEM ALERTS</span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-bold">
                    {unreadNotifs.length} new
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigateTo('notifications');
                  }}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  View All →
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1 divide-y divide-slate-100 custom-scrollbar">
                {safeNotifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onMarkNotificationRead(n.id);
                      setShowNotifMenu(false);
                      onNavigateTo(n.targetModule);
                    }}
                    className={`pt-2 p-2 rounded cursor-pointer transition-colors ${
                      n.isRead ? 'opacity-60 hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 line-clamp-1">{n.title}</span>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings Quick Trigger */}
        {onOpenUserSettings && (
          <button
            id="header-user-settings-btn"
            onClick={onOpenUserSettings}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
            title="User Name & Password Settings"
          >
            <KeyRound className="w-4 h-4" />
          </button>
        )}

        <div className="h-5 w-px bg-slate-200" />

        {/* User Profile */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left cursor-pointer"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono leading-none">
                @{currentUser?.username || 'admin'}
              </span>
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs">
              {(currentUser?.name || 'IT Admin')
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded bg-white border border-slate-200 shadow-xl z-50 p-2 space-y-1 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono px-1 rounded font-semibold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">@{currentUser.username || 'admin'}</div>
                <div className="text-[11px] text-slate-500">{currentUser.email}</div>
                <div className="text-[10px] text-blue-600 font-medium mt-1">
                  Role: {currentUser.role} ({currentUser.assignedBranchName})
                </div>
              </div>

              {/* Password & Credential Settings Action */}
              <div className="py-1">
                <button
                  id="menu-open-user-settings-btn"
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenUserSettings?.();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  <span>User Name & Password Settings</span>
                </button>
              </div>

              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-t border-slate-100 pt-1.5">
                Switch Role Profile:
              </div>

              {allUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUser(u);
                    setShowUserMenu(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    u.id === currentUser.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{u.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">@{u.username || 'user'}</span>
                </button>
              ))}

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateTo('users');
                  }}
                  className="w-full text-left px-2.5 py-1 text-xs text-blue-600 hover:underline font-medium"
                >
                  Manage Users & Roles →
                </button>

                {onLockSession && (
                  <button
                    id="menu-lock-session-btn"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLockSession();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-2 font-medium transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5 text-red-500" />
                    <span>Lock Session / Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

