import React from 'react';
import {
  Server,
  Ticket,
  Activity,
  Boxes,
  ArrowRight,
  ShieldCheck,
  Monitor,
  ExternalLink,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';
import {
  Branch,
  ITAsset,
  ITTicket,
  MaintenanceTask,
  NetworkDevice,
  WarrantyContract,
  SparePart,
  ModuleTab,
} from '../../types';

export interface DashboardViewProps {
  branches?: Branch[];
  assets?: ITAsset[];
  tickets?: ITTicket[];
  maintenanceTasks?: MaintenanceTask[];
  networkDevices?: NetworkDevice[];
  warranties?: WarrantyContract[];
  spareParts?: SparePart[];
  onNavigate?: (tab: ModuleTab) => void;
  onNavigateTo?: (tab: ModuleTab) => void;
  onSelectTicket?: (ticket: ITTicket) => void;
  onOpenNewTicket?: () => void;
  onOpenRemote?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  branches = [],
  assets = [],
  tickets = [],
  maintenanceTasks = [],
  networkDevices = [],
  warranties = [],
  spareParts = [],
  onNavigate,
  onNavigateTo,
  onSelectTicket,
  onOpenNewTicket,
  onOpenRemote,
}) => {
  const navigate = (tab: ModuleTab) => {
    if (onNavigate) onNavigate(tab);
    else if (onNavigateTo) onNavigateTo(tab);
  };

  const handleOpenRemote = () => {
    if (onOpenRemote) onOpenRemote();
    else navigate('remote');
  };

  const handleOpenNewTicket = () => {
    if (onOpenNewTicket) onOpenNewTicket();
    else navigate('tickets');
  };

  const handleSelectTicket = (ticket: ITTicket) => {
    if (onSelectTicket) onSelectTicket(ticket);
    else navigate('tickets');
  };

  const safeTickets = Array.isArray(tickets) ? tickets : [];
  const safeMaintenance = Array.isArray(maintenanceTasks) ? maintenanceTasks : [];
  const safeNetworkDevices = Array.isArray(networkDevices) ? networkDevices : [];
  const safeWarranties = Array.isArray(warranties) ? warranties : [];
  const safeSpareParts = Array.isArray(spareParts) ? spareParts : [];
  const safeBranches = Array.isArray(branches) ? branches : [];

  const openTickets = safeTickets.filter((t) => t.status !== 'Closed' && t.status !== 'Resolved');
  const criticalTickets = openTickets.filter((t) => t.priority === 'Critical' || t.priority === 'High');
  const expiringWarranties = safeWarranties.filter((w) => w.status === 'Expiring Soon' || w.status === 'Expired');
  const onlineDevices = safeNetworkDevices.filter((d) => d.status === 'Online');
  const avgUptime = (
    safeNetworkDevices.reduce((acc, curr) => acc + (curr.uptimePercentage || 0), 0) / (safeNetworkDevices.length || 1)
  ).toFixed(1);

  // Combine maintenance tasks & tickets for Recent Maintenance & Incident Logs table
  const combinedLogs = [
    ...safeTickets.slice(0, 4).map((t) => ({
      id: t.id,
      timestamp: t.createdAt,
      assetId: t.assetTag || 'SYS-NET-01',
      category: t.category,
      description: t.title,
      status: t.status,
      type: 'ticket' as const,
      rawItem: t,
    })),
    ...safeMaintenance.slice(0, 3).map((m) => ({
      id: m.id,
      timestamp: m.scheduledDate,
      assetId: m.assetTag || 'BR-FACILITY',
      category: m.type,
      description: m.title,
      status: m.status,
      type: 'maintenance' as const,
      rawItem: m,
    })),
  ].slice(0, 6);

  return (
    <div className="space-y-4 text-slate-800">
      {/* 1. Top Row: 4 High-Density KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Network Health */}
        <div
          id="metric-card-network"
          onClick={() => navigate('network')}
          className="bg-white border border-slate-200 rounded-sm p-3 shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
            <span>Network Health</span>
            <span className="text-green-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Live
            </span>
          </div>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">{avgUptime}%</span>
            <span className="text-[10px] text-green-600 font-semibold mb-1">+0.2% SLA</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Nodes Active</span>
              <span className="font-semibold text-slate-800">
                {onlineDevices.length} / {safeNetworkDevices.length}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{
                  width: `${(onlineDevices.length / (safeNetworkDevices.length || 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] pt-1">
              <span className="text-slate-500">Critical Alerts</span>
              <span className="font-bold text-red-600">{criticalTickets.length}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Latency (Avg)</span>
              <span className="font-medium text-slate-700">14ms</span>
            </div>
          </div>
        </div>

        {/* Card 2: IT Ticket Distribution */}
        <div
          id="metric-card-tickets"
          onClick={() => navigate('tickets')}
          className="bg-white border border-slate-200 rounded-sm p-3 shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
            <span>IT Ticket Distribution</span>
            <span className="text-[10px] text-blue-600 font-semibold">{openTickets.length} Active</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] p-1.5 bg-red-50 text-red-700 rounded border border-red-100">
              <span className="font-medium">High / Critical</span>
              <span className="font-bold text-xs">
                {String(criticalTickets.length).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-1.5 bg-amber-50 text-amber-700 rounded border border-amber-100">
              <span className="font-medium">Maintenance Pending</span>
              <span className="font-bold text-xs">
                {String(safeMaintenance.filter((m) => m.status !== 'Completed').length).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] p-1.5 bg-slate-50 text-slate-700 rounded border border-slate-200">
              <span className="font-medium">Standard Support</span>
              <span className="font-bold text-xs">
                {String(openTickets.length - criticalTickets.length > 0 ? openTickets.length - criticalTickets.length : 22).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Asset Lifecycle */}
        <div
          id="metric-card-assets"
          onClick={() => navigate('assets')}
          className="bg-white border border-slate-200 rounded-sm p-3 shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Asset Lifecycle
          </div>
          <div className="space-y-2">
            <div className="text-center py-1">
              <span className="text-2xl font-bold text-slate-900 tracking-tight">
                {assets.length.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-500">Total Managed Hardware Assets</p>
            </div>
            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-center">
              <div className="border-r border-slate-100 pr-1">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Warranty Near Exp</p>
                <p className="text-base font-bold text-orange-600">
                  {String(expiringWarranties.length).padStart(2, '0')}
                </p>
              </div>
              <div className="pl-1">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">In Repair</p>
                <p className="text-base font-bold text-slate-800">
                  {String(assets.filter((a) => a.status === 'In Repair').length || 8).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Spare Parts Inventory */}
        <div
          id="metric-card-spares"
          onClick={() => navigate('spare-parts')}
          className="bg-white border border-slate-200 rounded-sm p-3 shadow-sm hover:border-blue-400 transition-colors cursor-pointer"
        >
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
            <span>Spare Parts Inventory</span>
            <span className="text-[10px] text-blue-600 font-semibold">{safeSpareParts.length} SKUs</span>
          </div>
          <table className="w-full text-[10px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left py-1 font-semibold text-slate-400">ITEM</th>
                <th className="text-right py-1 font-semibold text-slate-400">STOCK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {safeSpareParts.slice(0, 4).map((p) => {
                const isLow = p.quantityInStock <= p.minimumThreshold;
                return (
                  <tr key={p.id}>
                    <td className={`py-1 truncate max-w-[130px] ${isLow ? 'text-red-600 font-semibold italic' : 'text-slate-700'}`}>
                      {p.name}
                    </td>
                    <td className={`text-right py-1 font-medium ${isLow ? 'text-red-600 font-bold' : 'text-slate-900'}`}>
                      {String(p.quantityInStock).padStart(2, '0')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Middle Section: Recent Maintenance & Incident Logs + Remote Support dark accent card */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 cols: Recent Maintenance & Incident Logs */}
        <div className="lg:col-span-3 bg-white border border-slate-200 rounded-sm shadow-sm flex flex-col">
          <div className="p-3 border-b border-slate-100 flex justify-between items-center">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
              <span>Recent Maintenance & Incident Logs</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9px] font-semibold">
                Live Feed
              </span>
            </span>
            <button
              onClick={() => navigate('tickets')}
              className="text-blue-600 text-[10px] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium text-[11px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 font-semibold">Timestamp</th>
                  <th className="px-4 py-2 font-semibold">Asset ID</th>
                  <th className="px-4 py-2 font-semibold">Category</th>
                  <th className="px-4 py-2 font-semibold">Description</th>
                  <th className="px-4 py-2 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {combinedLogs.map((log) => {
                  let statusBadge = (
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {log.status}
                    </span>
                  );
                  if (log.status === 'Resolved' || log.status === 'Completed') {
                    statusBadge = (
                      <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {log.status}
                      </span>
                    );
                  } else if (log.status === 'Open' || log.status === 'Critical') {
                    statusBadge = (
                      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        {log.status}
                      </span>
                    );
                  } else if (log.status === 'In Progress') {
                    statusBadge = (
                      <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                        In Progress
                      </span>
                    );
                  }

                  return (
                    <tr
                      key={log.id}
                      onClick={() => {
                        if (log.type === 'ticket') {
                          handleSelectTicket(log.rawItem as ITTicket);
                        } else {
                          navigate('maintenance');
                        }
                      }}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-2 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-2 font-mono font-medium text-blue-600 whitespace-nowrap">
                        {log.assetId}
                      </td>
                      <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{log.category}</td>
                      <td className="px-4 py-2 text-slate-900 font-medium truncate max-w-xs">
                        {log.description}
                      </td>
                      <td className="px-4 py-2 text-right whitespace-nowrap">{statusBadge}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 col: Dark Accent Card for Remote Support Tools */}
        <div className="bg-slate-900 text-white border border-slate-800 rounded-sm p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10 space-y-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span>Remote Support Tools</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2">
              <div
                onClick={handleOpenRemote}
                className="p-2.5 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                    Launch Remote Shell
                  </p>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Direct diagnostic access for L2/L3 escalations
                </p>
              </div>

              <div
                onClick={() => navigate('remote')}
                className="p-2.5 bg-slate-800 rounded border border-slate-700 hover:border-blue-500 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">VPN Access & Tunnel Manager</p>
                  <Radio className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  6 Secure tunnels operational across hubs
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] text-slate-400 font-semibold mb-1.5 uppercase">
                Active On-Call Technicians
              </div>
              <div className="flex items-center -space-x-1.5 overflow-hidden">
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                  JD
                </div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-cyan-600 text-white text-[9px] font-bold flex items-center justify-center">
                  EW
                </div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  MP
                </div>
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 bg-slate-700 text-slate-300 text-[9px] font-bold flex items-center justify-center">
                  +3
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-3">
            <button
              onClick={handleOpenRemote}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded transition-colors text-center shadow-sm"
            >
              Open Diagnostics Console
            </button>
          </div>
        </div>
      </div>

      {/* 3. Lower Section: Branch Infrastructure Topology Across All 6 Hubs */}
      <div className="bg-white border border-slate-200 rounded-sm shadow-sm p-4">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <span>Branch Infrastructure Topology</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                {safeBranches.length} Nodes Online
              </span>
            </h2>
          </div>
          <button
            onClick={() => navigate('branches')}
            className="text-blue-600 text-xs font-semibold hover:underline flex items-center gap-1"
          >
            <span>Manage All Branches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {safeBranches.map((branch) => {
            const isHealthy = branch.networkStatus === 'healthy';
            const isDegraded = branch.networkStatus === 'degraded';

            return (
              <div
                key={branch.id}
                id={`branch-tile-${branch.id}`}
                onClick={() => navigate('branches')}
                className="p-2.5 rounded border border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-700">{branch.code}</span>
                  <span className="flex items-center gap-1 text-[10px] font-medium">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isHealthy ? 'bg-green-500' : isDegraded ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                    <span
                      className={
                        isHealthy ? 'text-green-700' : isDegraded ? 'text-amber-700' : 'text-red-700'
                      }
                    >
                      {branch.networkStatus}
                    </span>
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700 transition-colors">
                  {branch.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate mb-2">{branch.city}</div>

                <div className="grid grid-cols-2 gap-1 text-[10px] border-t border-slate-200/80 pt-1.5">
                  <div>
                    <span className="text-slate-400">Assets:</span>{' '}
                    <span className="font-bold text-slate-800">{branch.activeAssetsCount}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Tickets:</span>{' '}
                    <span
                      className={`font-bold ${
                        branch.openTicketsCount > 4 ? 'text-red-600' : 'text-slate-800'
                      }`}
                    >
                      {branch.openTicketsCount}
                    </span>
                  </div>
                </div>

                {/* Bandwidth meter */}
                <div className="mt-1.5">
                  <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                    <span>BW Load</span>
                    <span className="font-mono font-semibold text-slate-700">
                      {branch.bandwidthUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        branch.bandwidthUsage > 80
                          ? 'bg-red-500'
                          : branch.bandwidthUsage > 60
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${branch.bandwidthUsage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
