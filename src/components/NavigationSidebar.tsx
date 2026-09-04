import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Laptop2,
  Ticket,
  CalendarClock,
  Activity,
  MonitorPlay,
  ShieldCheck,
  Boxes,
  BarChart3,
  Bell,
  Users2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ModuleTab } from '../types';
import { PremierLogo } from './PremierLogo';

interface NavigationSidebarProps {
  activeTab: ModuleTab;
  setActiveTab: (tab: ModuleTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  openTicketsCount: number;
  criticalAlertsCount: number;
  lowStockPartsCount: number;
}

interface NavSection {
  title: string;
  items: {
    id: ModuleTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[];
}

export const NavigationSidebar: React.FC<NavigationSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  openTicketsCount,
  criticalAlertsCount,
  lowStockPartsCount,
}) => {
  const sections: NavSection[] = [
    {
      title: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'branches', label: 'Branch Management', icon: Building2 },
        { id: 'assets', label: 'Asset Management', icon: Laptop2 },
        {
          id: 'tickets',
          label: 'IT Tickets',
          icon: Ticket,
          badge: openTicketsCount,
          badgeColor: 'bg-red-500 text-white',
        },
        { id: 'maintenance', label: 'Maintenance', icon: CalendarClock },
      ],
    },
    {
      title: 'Monitoring & Support',
      items: [
        {
          id: 'network',
          label: 'Network Monitoring',
          icon: Activity,
          badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
          badgeColor: 'bg-red-500 text-white',
        },
        { id: 'remote', label: 'Remote Support', icon: MonitorPlay },
      ],
    },
    {
      title: 'Inventory & Admin',
      items: [
        { id: 'warranties', label: 'Warranty Management', icon: ShieldCheck },
        {
          id: 'spare-parts',
          label: 'Spare Parts',
          icon: Boxes,
          badge: lowStockPartsCount > 0 ? lowStockPartsCount : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        { id: 'reports', label: 'Reports', icon: BarChart3 },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          badge: criticalAlertsCount > 0 ? criticalAlertsCount : undefined,
          badgeColor: 'bg-blue-500 text-white',
        },
        { id: 'users', label: 'User Directory', icon: Users2 },
      ],
    },
  ];

  return (
    <aside
      id="main-navigation-sidebar"
      className={`bg-slate-900 flex-shrink-0 flex flex-col border-r border-slate-800 select-none z-30 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Brand Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        {!collapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <PremierLogo size="sm" showText={false} />
            <div className="flex flex-col min-w-0">
              <span className="text-white font-bold text-xs tracking-tight uppercase truncate">
                Premier <span className="text-blue-400">IT</span>
              </span>
              <span className="text-[9px] text-slate-400 font-mono tracking-wider truncate">
                Asset Control
              </span>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center py-0.5">
            <PremierLogo size="sm" showText={false} />
          </div>
        )}

        <button
          id="toggle-sidebar-button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors ml-1 cursor-pointer"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 py-2 text-slate-300 text-xs font-medium overflow-y-auto custom-scrollbar">
        {sections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-3' : ''}>
            {!collapsed && (
              <div className="px-4 py-1 text-slate-500 uppercase text-[10px] tracking-wider mb-1">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-4 py-2 transition-colors text-xs text-left relative ${
                      isActive
                        ? 'bg-slate-800 text-white border-l-2 border-blue-500 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white border-l-2 border-transparent'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!collapsed && <span className="ml-3 truncate flex-1">{item.label}</span>}
                    {!collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`ml-auto text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                          item.badgeColor || 'bg-red-500 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Version & Status */}
      <div className="p-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center justify-between">
        {!collapsed ? (
          <>
            <span className="truncate">v2.4.12-Enterprise</span>
            <span className="flex items-center gap-1 shrink-0 text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </>
        ) : (
          <div className="w-full flex justify-center" title="v2.4.12-Enterprise Build">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </aside>
  );
};

