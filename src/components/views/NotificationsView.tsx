import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  CheckCheck,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { SystemNotification, ModuleTab } from '../../types';

interface NotificationsViewProps {
  notifications: SystemNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onClearNotifications: () => void;
  onNavigateToModule: (tab: ModuleTab) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onClearNotifications,
  onNavigateToModule,
}) => {
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (severityFilter === 'ALL') return true;
    return n.severity === severityFilter;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <span>Infrastructure Alerts & System Notifications</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {unreadCount} Unread Alerts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time threshold triggers, warranty countdown alerts, SLA breach warnings, and hardware telemetry events.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Mark All Read</span>
            </button>
          )}

          <button
            onClick={onClearNotifications}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-red-50 text-slate-600 hover:text-red-700 text-xs font-semibold border border-slate-300 transition-colors shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-sm bg-white border border-slate-200 shadow-sm text-xs w-fit">
        {['ALL', 'critical', 'warning', 'info', 'success'].map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`px-3 py-1 rounded text-xs font-semibold capitalize transition-colors ${
              severityFilter === sev
                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {sev === 'ALL' ? 'All Alerts' : sev}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.map((item) => {
          const icon =
            item.severity === 'critical' ? (
              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
            ) : item.severity === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            ) : item.severity === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
            );

          return (
            <div
              key={item.id}
              onClick={() => onMarkRead(item.id)}
              className={`p-3 rounded-sm border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${
                item.isRead
                  ? 'bg-slate-50/70 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded bg-slate-100 mt-0.5">{icon}</div>

                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{item.message}</p>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                    <span>{item.timestamp}</span>
                    <span>· Domain: {item.targetModule.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkRead(item.id);
                    onNavigateToModule(item.targetModule);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
                >
                  <span>Open Module</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-10 text-center text-slate-400 text-xs rounded-sm bg-white border border-slate-200 shadow-xs">
            No system notifications match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
};
