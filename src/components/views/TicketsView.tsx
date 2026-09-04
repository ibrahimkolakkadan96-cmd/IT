import React, { useState } from 'react';
import {
  Ticket,
  Plus,
  Search,
  Kanban,
  List,
  Tag,
  Send,
} from 'lucide-react';
import { ITTicket, Branch, TicketStatus, UserStaff } from '../../types';

interface TicketsViewProps {
  tickets?: ITTicket[];
  branches?: Branch[];
  staff?: UserStaff[];
  onAddTicket?: (ticket: ITTicket) => void;
  onUpdateTicket?: (ticket: ITTicket) => void;
  onOpenCreateTicket?: () => void;
  selectedTicket?: ITTicket | null;
  setSelectedTicket?: (ticket: ITTicket | null) => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  tickets = [],
  branches = [],
  staff = [],
  onAddTicket,
  onUpdateTicket,
  onOpenCreateTicket,
  selectedTicket,
  setSelectedTicket,
}) => {
  const [internalSelectedTicket, setInternalSelectedTicket] = useState<ITTicket | null>(null);
  const activeTicket = selectedTicket !== undefined && selectedTicket !== null ? selectedTicket : internalSelectedTicket;

  const handleSelectTicket = (ticket: ITTicket | null) => {
    if (setSelectedTicket) {
      setSelectedTicket(ticket);
    }
    setInternalSelectedTicket(ticket);
  };

  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [newComment, setNewComment] = useState('');

  const statuses: TicketStatus[] = ['Open', 'In Progress', 'Pending Vendor', 'Resolved', 'Closed'];

  const safeTickets = Array.isArray(tickets) ? tickets : [];

  const filteredTickets = safeTickets.filter((ticket) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.title.toLowerCase().includes(term) ||
      ticket.ticketNumber.toLowerCase().includes(term) ||
      ticket.requesterName.toLowerCase().includes(term) ||
      ticket.assigneeName.toLowerCase().includes(term) ||
      (ticket.assetTag && ticket.assetTag.toLowerCase().includes(term));

    const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'ALL' || ticket.category === categoryFilter;
    const matchesBranch = branchFilter === 'ALL' || ticket.branchId === branchFilter;

    return matchesSearch && matchesPriority && matchesCategory && matchesBranch;
  });

  const handleStatusChange = (ticket: ITTicket, newStatus: TicketStatus) => {
    const updated: ITTicket = {
      ...ticket,
      status: newStatus,
      resolutionDate: newStatus === 'Resolved' || newStatus === 'Closed' ? new Date().toISOString() : ticket.resolutionDate,
      activityHistory: [
        ...(ticket.activityHistory || []),
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'Current User',
          action: `Status changed to ${newStatus}`,
        },
      ],
    };
    if (onUpdateTicket) {
      onUpdateTicket(updated);
    }
    if (activeTicket?.id === ticket.id) {
      handleSelectTicket(updated);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !newComment.trim()) return;

    const updated: ITTicket = {
      ...activeTicket,
      activityHistory: [
        ...(activeTicket.activityHistory || []),
        {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          author: 'IT Operations Team',
          action: 'Added Note',
          note: newComment.trim(),
        },
      ],
    };
    if (onUpdateTicket) {
      onUpdateTicket(updated);
    }
    handleSelectTicket(updated);
    setNewComment('');
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-600" />
            <span>Service Desk & Incident Management</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {tickets.length} Incidents Tracked
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Multi-branch incident ticketing, priority SLA tracking, technician dispatch, and resolution workflows.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle */}
          <div className="flex items-center p-0.5 rounded bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('board')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'board' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Kanban Board"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            id="create-ticket-view-btn"
            onClick={onOpenCreateTicket}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tickets, issue description, ticket #, requester, or asset tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Hardware">Hardware</option>
            <option value="Network">Network</option>
            <option value="Software">Software</option>
            <option value="Access & Security">Access & Security</option>
            <option value="Printer">Printer</option>
            <option value="Telephony">Telephony</option>
          </select>

          {/* Branch Filter */}
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'board' ? (
        /* Kanban Board View */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 items-start">
          {statuses.filter(s => s !== 'Closed').map((status) => {
            const columnTickets = filteredTickets.filter((t) => t.status === status);

            return (
              <div
                key={status}
                className="rounded-sm bg-slate-100/70 border border-slate-200 p-2.5 space-y-2 flex flex-col max-h-[78vh]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        status === 'Open'
                          ? 'bg-blue-600'
                          : status === 'In Progress'
                          ? 'bg-cyan-600'
                          : status === 'Pending Vendor'
                          ? 'bg-amber-500'
                          : 'bg-green-600'
                      }`}
                    />
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {status}
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[10px] font-mono text-slate-700 font-bold">
                    {columnTickets.length}
                  </span>
                </div>

                {/* Ticket Cards */}
                <div className="overflow-y-auto space-y-2 flex-1 pr-0.5 custom-scrollbar">
                  {columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      id={`ticket-card-${ticket.id}`}
                      onClick={() => handleSelectTicket(ticket)}
                      className="p-2.5 rounded-sm bg-white border border-slate-200 hover:border-blue-400 shadow-xs transition-all cursor-pointer group space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-mono text-[11px] font-bold text-blue-700">
                          {ticket.ticketNumber}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                            ticket.priority === 'Critical'
                              ? 'bg-red-100 text-red-700'
                              : ticket.priority === 'High'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                        {ticket.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {ticket.description}
                      </p>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="truncate max-w-[100px]">{ticket.branchName.split(' ')[0]}</span>
                        <span className="text-slate-700 font-sans font-medium">{ticket.assigneeName.split(' ')[0]}</span>
                      </div>

                      {ticket.assetTag && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{ticket.assetTag}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {columnTickets.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-[11px]">No incidents in this lane</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Tabular List View */
        <div className="rounded-sm bg-white border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-4">Ticket # / Title</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Branch Location</th>
                  <th className="py-2.5 px-3">Requester</th>
                  <th className="py-2.5 px-3">Assignee</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-4">
                      <div className="font-mono font-bold text-blue-700">{ticket.ticketNumber}</div>
                      <div className="font-semibold text-slate-900 line-clamp-1">{ticket.title}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{ticket.category}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ticket.priority === 'Critical'
                            ? 'bg-red-100 text-red-700'
                            : ticket.priority === 'High'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{ticket.branchName}</td>
                    <td className="py-2.5 px-3 text-slate-500">{ticket.requesterName}</td>
                    <td className="py-2.5 px-3 text-slate-800 font-medium">{ticket.assigneeName}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          ticket.status === 'Open'
                            ? 'bg-blue-100 text-blue-700'
                            : ticket.status === 'In Progress'
                            ? 'bg-cyan-100 text-cyan-700'
                            : ticket.status === 'Pending Vendor'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTicket(ticket);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold text-[11px]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ticket Detail Drawer / Modal */}
      {activeTicket && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto text-slate-900">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-2.5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-700">{activeTicket.ticketNumber}</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.2 rounded ${
                      activeTicket.priority === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {activeTicket.priority} Priority
                  </span>
                  <span className="text-xs text-slate-500">· {activeTicket.category}</span>
                </div>
                <h2 className="text-sm font-bold text-slate-900 mt-1">{activeTicket.title}</h2>
              </div>
              <button
                onClick={() => handleSelectTicket(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Workflow Changer */}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600 uppercase text-[10px]">Workflow Stage:</span>
              <div className="flex flex-wrap gap-1.5">
                {statuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(activeTicket, s)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      activeTicket.status === s
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">LOCATION</span>
                <div className="font-semibold text-slate-800 truncate">{activeTicket.branchName}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">REQUESTER</span>
                <div className="font-semibold text-slate-800 truncate">{activeTicket.requesterName}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">ASSIGNEE</span>
                <div className="font-semibold text-slate-800 truncate">{activeTicket.assigneeName}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-[9px] text-slate-400 font-semibold uppercase">ASSET TAG</span>
                <div className="font-mono font-bold text-blue-700 truncate">{activeTicket.assetTag || 'None'}</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-slate-500 uppercase text-[10px]">Description & Root Issue</span>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed">
                {activeTicket.description}
              </div>
            </div>

            {/* Resolution Notes if available */}
            {activeTicket.resolutionNotes && (
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-green-700 uppercase text-[10px]">Engineering Resolution Note</span>
                <div className="p-2.5 rounded bg-green-50 border border-green-200 text-green-900 leading-relaxed">
                  {activeTicket.resolutionNotes}
                </div>
              </div>
            )}

            {/* Activity History & Work Log */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-500 uppercase text-[10px]">Activity Audit Trail</span>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {(activeTicket.activityHistory || []).map((act) => (
                  <div key={act.id} className="p-2 rounded bg-slate-50 border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-800">{act.author}</span>
                      <span className="text-[10px] font-mono text-slate-400">{new Date(act.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-blue-700 font-medium">{act.action}</div>
                    {act.note && <div className="text-slate-600 text-[11px] mt-0.5">{act.note}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Add note / comment input */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add technician comment or work log note..."
                className="flex-1 px-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Log Note</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
