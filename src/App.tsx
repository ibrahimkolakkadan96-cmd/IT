import React, { useState, useMemo } from 'react';
import {
  initialBranches,
  initialAssets,
  initialTickets,
  initialMaintenanceTasks,
  initialNetworkDevices,
  initialRemoteSessions,
  initialWarranties,
  initialSpareParts,
  initialNotifications,
  initialUsers,
} from './data/mockData';
import {
  ModuleTab,
  Branch,
  ITAsset,
  ITTicket,
  MaintenanceTask,
  NetworkDevice,
  RemoteSession,
  WarrantyContract,
  SparePart,
  SystemNotification,
  UserStaff,
} from './types';
import { NavigationSidebar } from './components/NavigationSidebar';
import { HeaderBar } from './components/HeaderBar';

// Views
import { DashboardView } from './components/views/DashboardView';
import { BranchManagementView } from './components/views/BranchManagementView';
import { AssetManagementView } from './components/views/AssetManagementView';
import { TicketsView } from './components/views/TicketsView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { NetworkMonitoringView } from './components/views/NetworkMonitoringView';
import { RemoteSupportView } from './components/views/RemoteSupportView';
import { WarrantyManagementView } from './components/views/WarrantyManagementView';
import { SparePartsView } from './components/views/SparePartsView';
import { ReportsView } from './components/views/ReportsView';
import { NotificationsView } from './components/views/NotificationsView';
import { UserManagementView } from './components/views/UserManagementView';
import { LoginModal } from './components/LoginModal';
import { UserSettingsModal } from './components/UserSettingsModal';

export default function App() {
  // Navigation & Filter States
  const [activeTab, setActiveTab] = useState<ModuleTab>('dashboard');
  const [selectedBranchId, setSelectedBranchId] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Entities State
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [assets, setAssets] = useState<ITAsset[]>(initialAssets);
  const [tickets, setTickets] = useState<ITTicket[]>(initialTickets);
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(initialMaintenanceTasks);
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>(initialNetworkDevices);
  const [remoteSessions, setRemoteSessions] = useState<RemoteSession[]>(initialRemoteSessions);
  const [warranties, setWarranties] = useState<WarrantyContract[]>(initialWarranties);
  const [spareParts, setSpareParts] = useState<SparePart[]>(initialSpareParts);
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [users, setUsers] = useState<UserStaff[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserStaff>(initialUsers[0]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState<boolean>(false);

  // Quick Ticket Creation Modal state (triggered from header)
  const [isQuickTicketModalOpen, setIsQuickTicketModalOpen] = useState(false);
  const [quickTicketData, setQuickTicketData] = useState({
    title: '',
    category: 'Hardware' as any,
    priority: 'Medium' as any,
    branchId: branches[0]?.id || 'br-01',
    description: '',
  });

  // Dynamic Badge Calculations
  const openTicketsCount = useMemo(
    () => tickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved').length,
    [tickets]
  );

  const criticalAlertsCount = useMemo(
    () => notifications.filter((n) => !n.isRead && (n.severity === 'critical' || n.severity === 'warning')).length,
    [notifications]
  );

  const lowStockPartsCount = useMemo(
    () => spareParts.filter((p) => p.quantityInStock <= p.minimumThreshold).length,
    [spareParts]
  );

  // Branch-Filtered Entities for active views
  const branchFilteredAssets = useMemo(() => {
    if (selectedBranchId === 'ALL') return assets;
    return assets.filter((a) => a.branchId === selectedBranchId);
  }, [assets, selectedBranchId]);

  const branchFilteredTickets = useMemo(() => {
    if (selectedBranchId === 'ALL') return tickets;
    return tickets.filter((t) => t.branchId === selectedBranchId);
  }, [tickets, selectedBranchId]);

  const branchFilteredMaintenance = useMemo(() => {
    if (selectedBranchId === 'ALL') return maintenanceTasks;
    return maintenanceTasks.filter((m) => m.branchId === selectedBranchId);
  }, [maintenanceTasks, selectedBranchId]);

  const branchFilteredDevices = useMemo(() => {
    if (selectedBranchId === 'ALL') return networkDevices;
    return networkDevices.filter((d) => d.branchId === selectedBranchId);
  }, [networkDevices, selectedBranchId]);

  const branchFilteredSessions = useMemo(() => {
    if (selectedBranchId === 'ALL') return remoteSessions;
    return remoteSessions.filter((s) => s.branchId === selectedBranchId);
  }, [remoteSessions, selectedBranchId]);

  const branchFilteredUsers = useMemo(() => {
    if (selectedBranchId === 'ALL') return users;
    return users.filter((u) => u.assignedBranchId === selectedBranchId);
  }, [users, selectedBranchId]);

  // Handlers for Branches
  const handleAddBranch = (branch: Branch) => {
    setBranches((prev) => [branch, ...prev]);
    // Also push a notification
    addSystemNotification(
      'New Branch Facility Registered',
      `Branch ${branch.name} (${branch.code}) has been added to the regional topology.`,
      'info',
      'branches'
    );
  };

  const handleUpdateBranch = (branch: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === branch.id ? branch : b)));
  };

  const handleDeleteBranch = (branchId: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== branchId));
  };

  // Handlers for Assets
  const handleAddAsset = (asset: ITAsset) => {
    setAssets((prev) => [asset, ...prev]);
    // update branch asset count
    setBranches((prev) =>
      prev.map((b) =>
        b.id === asset.branchId ? { ...b, activeAssetsCount: b.activeAssetsCount + 1 } : b
      )
    );
    addSystemNotification(
      'New Hardware Asset Enrolled',
      `Asset ${asset.tag} (${asset.name}) assigned to ${asset.branchName}.`,
      'success',
      'assets'
    );
  };

  const handleUpdateAsset = (asset: ITAsset) => {
    setAssets((prev) => prev.map((a) => (a.id === asset.id ? asset : a)));
  };

  const handleDeleteAsset = (assetId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== assetId));
  };

  // Handlers for Tickets
  const handleAddTicket = (ticket: ITTicket) => {
    setTickets((prev) => [ticket, ...prev]);
    // update branch open tickets count
    setBranches((prev) =>
      prev.map((b) =>
        b.id === ticket.branchId ? { ...b, openTicketsCount: b.openTicketsCount + 1 } : b
      )
    );
    addSystemNotification(
      `New Ticket: ${ticket.ticketNumber}`,
      `[${ticket.priority}] ${ticket.title} at ${ticket.branchName}`,
      ticket.priority === 'Critical' ? 'critical' : 'info',
      'tickets'
    );
  };

  const handleUpdateTicket = (ticket: ITTicket) => {
    setTickets((prev) => prev.map((t) => (t.id === ticket.id ? ticket : t)));
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  // Handlers for Maintenance
  const handleAddMaintenanceTask = (task: MaintenanceTask) => {
    setMaintenanceTasks((prev) => [task, ...prev]);
    addSystemNotification(
      'Maintenance Scheduled',
      `${task.jobCode}: ${task.title} for ${task.scheduledDate}`,
      'info',
      'maintenance'
    );
  };

  const handleUpdateMaintenanceTask = (task: MaintenanceTask) => {
    setMaintenanceTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  };

  // Handlers for Warranties
  const handleAddWarranty = (warranty: WarrantyContract) => {
    setWarranties((prev) => [warranty, ...prev]);
    addSystemNotification(
      'Warranty Contract Registered',
      `Contract ${warranty.contractNumber} (${warranty.vendor}) is now active.`,
      'success',
      'warranties'
    );
  };

  const handleRenewWarranty = (contractId: string, additionalDays: number) => {
    setWarranties((prev) =>
      prev.map((w) => {
        if (w.id === contractId) {
          return {
            ...w,
            daysRemaining: w.daysRemaining + additionalDays,
            status: 'Active',
          };
        }
        return w;
      })
    );
    addSystemNotification(
      'Warranty Contract Extended',
      `Service agreement renewed for +${additionalDays} days.`,
      'success',
      'warranties'
    );
  };

  // Handlers for Spare Parts
  const handleAddPart = (part: SparePart) => {
    setSpareParts((prev) => [part, ...prev]);
    addSystemNotification(
      'Spare Part SKU Registered',
      `Part ${part.sku} (${part.name}) added to warehouse inventory.`,
      'info',
      'spare-parts'
    );
  };

  const handleUpdateStock = (partId: string, delta: number) => {
    setSpareParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const newQty = Math.max(0, p.quantityInStock + delta);
          return { ...p, quantityInStock: newQty };
        }
        return p;
      })
    );
  };

  // Handlers for Notifications
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const addSystemNotification = (
    title: string,
    message: string,
    severity: 'critical' | 'warning' | 'info' | 'success',
    targetModule: ModuleTab
  ) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      severity,
      timestamp: 'Just now',
      isRead: false,
      targetModule,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Handlers for Users
  const handleAddUser = (user: UserStaff) => {
    setUsers((prev) => [user, ...prev]);
  };

  const handleUpdateUser = (user: UserStaff) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? user : u)));
    if (currentUser.id === user.id) {
      setCurrentUser(user);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  // Cross-Module Deep Linking
  const handleCreateTicketForAsset = (asset: ITAsset) => {
    setActiveTab('tickets');
    setQuickTicketData({
      title: `Hardware Diagnostic Required: ${asset.name} (${asset.tag})`,
      category: 'Hardware',
      priority: 'High',
      branchId: asset.branchId,
      description: `Dispatched investigation for asset ${asset.name} with serial ${asset.serialNumber} located at ${asset.branchName}.`,
    });
    setIsQuickTicketModalOpen(true);
  };

  const handleOpenCreateTicketForDevice = (device: NetworkDevice) => {
    setActiveTab('tickets');
    setQuickTicketData({
      title: `Network Link Outage / Jitter Alert: ${device.name}`,
      category: 'Network',
      priority: 'Critical',
      branchId: device.branchId,
      description: `Automated probe flagged high packet loss (${device.packetLossPercent}%) or degradation on ${device.ip}.`,
    });
    setIsQuickTicketModalOpen(true);
  };

  const handleOpenAssetTicketFromRemote = (assetTag: string) => {
    setActiveTab('tickets');
    const matchingAsset = assets.find((a) => a.tag === assetTag);
    setQuickTicketData({
      title: `Remote Session Incident Followup: ${assetTag}`,
      category: 'Hardware',
      priority: 'Medium',
      branchId: matchingAsset?.branchId || branches[0].id,
      description: `Logged during active remote support session. Telemetry review suggested hardware throttling or software error.`,
    });
    setIsQuickTicketModalOpen(true);
  };

  const handleSelectBranchForDetails = (branch: Branch) => {
    setSelectedBranchId(branch.id);
    setActiveTab('assets');
  };

  // Quick Ticket Submission
  const handleQuickTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find((b) => b.id === quickTicketData.branchId) || branches[0];
    const newTicket: ITTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title: quickTicketData.title || 'Technical Incident',
      description: quickTicketData.description || 'Quick reported issue from header action.',
      category: quickTicketData.category,
      priority: quickTicketData.priority,
      status: 'Open',
      requesterName: currentUser.name,
      requesterEmail: currentUser.email,
      branchId: branch.id,
      branchName: branch.name,
      assigneeName: 'Alex Rivera (Network Admin)',
      assigneeId: 'usr-02',
      createdAt: new Date().toISOString(),
      slaDueDate: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      isBreachedSla: false,
      activityHistory: [
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: currentUser.name,
          action: 'Created Ticket',
          note: quickTicketData.description,
        },
      ],
    };
    handleAddTicket(newTicket);
    setIsQuickTicketModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* 1. Left Navigation Sidebar */}
      <NavigationSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        openTicketsCount={openTicketsCount}
        criticalAlertsCount={criticalAlertsCount}
        lowStockPartsCount={lowStockPartsCount}
      />

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">
        {/* Header Bar */}
        <HeaderBar
          branches={branches}
          selectedBranchId={selectedBranchId}
          setSelectedBranchId={setSelectedBranchId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          notifications={notifications}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          allUsers={users}
          activeTab={activeTab}
          onOpenNewTicket={() => {
            setQuickTicketData({
              title: '',
              category: 'Hardware',
              priority: 'Medium',
              branchId: selectedBranchId !== 'ALL' ? selectedBranchId : branches[0]?.id,
              description: '',
            });
            setIsQuickTicketModalOpen(true);
          }}
          onOpenNewAsset={() => {
            setActiveTab('assets');
          }}
          onOpenRemoteDiagnostic={() => {
            setActiveTab('remote');
          }}
          onNavigateTo={setActiveTab}
          onMarkNotificationRead={handleMarkNotificationRead}
          onOpenUserSettings={() => setIsUserSettingsOpen(true)}
          onLockSession={() => setIsLoggedIn(false)}
        />

        {/* Dynamic Branch Banner when filtered */}
        {selectedBranchId !== 'ALL' && (
          <div className="px-4 md:px-6 py-1.5 bg-blue-50 border-b border-blue-200 text-xs flex items-center justify-between text-blue-900">
            <div className="flex items-center gap-2 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>
                Filtered by Topology Node: <strong>{branches.find((b) => b.id === selectedBranchId)?.name}</strong>
              </span>
            </div>
            <button
              onClick={() => setSelectedBranchId('ALL')}
              className="text-blue-700 hover:text-blue-900 underline text-[11px] font-semibold"
            >
              Reset to Global (All Branches)
            </button>
          </div>
        )}

        {/* View Router */}
        <main
          id="main-app-content-view"
          className="flex-1 overflow-y-auto p-4 md:p-5 custom-scrollbar bg-slate-50 text-slate-900"
        >
          {activeTab === 'dashboard' && (
            <DashboardView
              branches={branches}
              assets={assets}
              tickets={tickets}
              maintenanceTasks={maintenanceTasks}
              networkDevices={networkDevices}
              warranties={warranties}
              spareParts={spareParts}
              onNavigateTo={setActiveTab}
            />
          )}

          {activeTab === 'branches' && (
            <BranchManagementView
              branches={branches}
              assets={assets}
              tickets={tickets}
              onAddBranch={handleAddBranch}
              onUpdateBranch={handleUpdateBranch}
              onDeleteBranch={handleDeleteBranch}
              onSelectBranchForDetails={handleSelectBranchForDetails}
            />
          )}

          {activeTab === 'assets' && (
            <AssetManagementView
              assets={branchFilteredAssets}
              branches={branches}
              onAddAsset={handleAddAsset}
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset}
              onCreateTicketForAsset={handleCreateTicketForAsset}
              onOpenRemoteForAsset={() => setActiveTab('remote')}
            />
          )}

          {activeTab === 'tickets' && (
            <TicketsView
              tickets={branchFilteredTickets}
              branches={branches}
              staff={users}
              onAddTicket={handleAddTicket}
              onUpdateTicket={handleUpdateTicket}
              onOpenCreateTicket={() => {
                setQuickTicketData({
                  title: '',
                  description: '',
                  category: 'Hardware',
                  priority: 'Medium',
                  branchId: branches[0]?.id || 'br-01',
                });
                setIsQuickTicketModalOpen(true);
              }}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceView
              tasks={branchFilteredMaintenance}
              branches={branches}
              assets={assets}
              onAddTask={handleAddMaintenanceTask}
              onUpdateTask={handleUpdateMaintenanceTask}
            />
          )}

          {activeTab === 'network' && (
            <NetworkMonitoringView
              networkDevices={branchFilteredDevices}
              branches={branches}
              onOpenCreateTicketForDevice={handleOpenCreateTicketForDevice}
            />
          )}

          {activeTab === 'remote' && (
            <RemoteSupportView
              sessions={branchFilteredSessions}
              assets={assets}
              onOpenAssetTicket={handleOpenAssetTicketFromRemote}
            />
          )}

          {activeTab === 'warranties' && (
            <WarrantyManagementView
              warranties={warranties}
              assets={assets}
              onAddWarranty={handleAddWarranty}
              onRenewWarranty={handleRenewWarranty}
            />
          )}

          {activeTab === 'spare-parts' && (
            <SparePartsView
              spareParts={spareParts}
              branches={branches}
              onAddPart={handleAddPart}
              onUpdateStock={handleUpdateStock}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              branches={branches}
              assets={branchFilteredAssets}
              tickets={branchFilteredTickets}
              warranties={warranties}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onClearNotifications={handleClearNotifications}
              onNavigateToModule={setActiveTab}
            />
          )}

          {activeTab === 'users' && (
            <UserManagementView
              users={branchFilteredUsers}
              branches={branches}
              onAddUser={handleAddUser}
              onUpdateUser={handleUpdateUser}
              onDeleteUser={handleDeleteUser}
            />
          )}
        </main>

        {/* High Density Status Footer */}
        <footer
          id="app-status-footer"
          className="h-8 bg-slate-200 border-t border-slate-300 flex items-center px-4 md:px-6 justify-between text-[10px] font-medium text-slate-600 shrink-0"
        >
          <div className="flex gap-4 items-center">
            <span>Server Time: {new Date().toISOString().substring(11, 19)} UTC</span>
            <span className="hidden sm:inline">Region: us-east-1</span>
            <span className="hidden md:inline">Nodes Monitored: 6/6 Active</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="flex items-center gap-1 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Main DB Connected
            </span>
            <span className="flex items-center gap-1 text-slate-700 hidden sm:flex">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Monitoring API Active
            </span>
            <span className="text-slate-500 font-mono hidden lg:inline">14ms Latency</span>
          </div>
        </footer>
      </div>

      {/* Global Quick Ticket Modal */}
      {isQuickTicketModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <span>CREATE INCIDENT / SERVICE TICKET</span>
              </h2>
              <button
                onClick={() => setIsQuickTicketModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickTicketSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  Ticket Title
                </label>
                <input
                  type="text"
                  required
                  value={quickTicketData.title}
                  onChange={(e) => setQuickTicketData({ ...quickTicketData, title: e.target.value })}
                  placeholder="e.g. Core Switch link flap detected"
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Category
                  </label>
                  <select
                    value={quickTicketData.category}
                    onChange={(e) =>
                      setQuickTicketData({ ...quickTicketData, category: e.target.value as any })
                    }
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Network">Network</option>
                    <option value="Access & Security">Access & Security</option>
                    <option value="Printer">Printer</option>
                    <option value="Telephony">Telephony</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Priority
                  </label>
                  <select
                    value={quickTicketData.priority}
                    onChange={(e) =>
                      setQuickTicketData({ ...quickTicketData, priority: e.target.value as any })
                    }
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Branch Hub
                  </label>
                  <select
                    value={quickTicketData.branchId}
                    onChange={(e) => setQuickTicketData({ ...quickTicketData, branchId: e.target.value })}
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

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  Description & Context
                </label>
                <textarea
                  rows={3}
                  required
                  value={quickTicketData.description}
                  onChange={(e) =>
                    setQuickTicketData({ ...quickTicketData, description: e.target.value })
                  }
                  placeholder="Provide symptoms, error codes, and troubleshooting steps taken..."
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickTicketModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Credentials & Password Settings Modal */}
      {isUserSettingsOpen && (
        <UserSettingsModal
          currentUser={currentUser}
          onClose={() => setIsUserSettingsOpen(false)}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Session Authentication / Login Screen */}
      {!isLoggedIn && (
        <LoginModal
          users={users}
          onLoginSuccess={(authenticatedUser) => {
            setCurrentUser(authenticatedUser);
            setIsLoggedIn(true);
          }}
        />
      )}
    </div>
  );
}
