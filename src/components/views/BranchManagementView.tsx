import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MapPin,
  Users,
  Network,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Branch, ITAsset, ITTicket } from '../../types';

interface BranchManagementViewProps {
  branches?: Branch[];
  assets?: ITAsset[];
  tickets?: ITTicket[];
  onAddBranch: (branch: Branch) => void;
  onUpdateBranch: (branch: Branch) => void;
  onDeleteBranch: (branchId: string) => void;
  onSelectBranchForDetails?: (branchId: string) => void;
}

export const BranchManagementView: React.FC<BranchManagementViewProps> = ({
  branches = [],
  assets = [],
  tickets = [],
  onAddBranch,
  onUpdateBranch,
  onDeleteBranch,
  onSelectBranchForDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

  const [formData, setFormData] = useState<Partial<Branch>>({
    name: '',
    code: '',
    region: 'Central',
    city: '',
    address: '',
    manager: '',
    managerEmail: '',
    phone: '',
    networkStatus: 'healthy',
    bandwidthUsage: 35,
    primarySubnet: '10.80.0.0/24',
    techniciansAssigned: 2,
  });

  const regions = Array.from(new Set(branches.map((b) => b.region)));

  const filteredBranches = branches.filter((branch) => {
    const matchesSearch =
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = regionFilter === 'ALL' || branch.region === regionFilter;
    const matchesStatus = statusFilter === 'ALL' || branch.networkStatus === statusFilter;

    return matchesSearch && matchesRegion && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      code: '',
      region: 'Central',
      city: '',
      address: '',
      manager: '',
      managerEmail: '',
      phone: '',
      networkStatus: 'healthy',
      bandwidthUsage: 35,
      primarySubnet: '10.80.0.0/24',
      techniciansAssigned: 2,
    });
    setEditingBranch(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormData({ ...branch });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    if (editingBranch) {
      onUpdateBranch({
        ...editingBranch,
        ...(formData as Branch),
      });
    } else {
      const newBranch: Branch = {
        id: `br-${Date.now()}`,
        name: formData.name || 'New Regional Branch',
        code: formData.code || 'BR-NEW',
        region: formData.region || 'Central',
        city: formData.city || 'Chicago, IL',
        address: formData.address || 'Corporate Park',
        manager: formData.manager || 'Unassigned',
        managerEmail: formData.managerEmail || 'ops@enterprise-it.corp',
        phone: formData.phone || '+1 (555) 000-0000',
        activeAssetsCount: 0,
        openTicketsCount: 0,
        networkStatus: (formData.networkStatus as 'healthy' | 'degraded' | 'critical') || 'healthy',
        bandwidthUsage: Number(formData.bandwidthUsage) || 30,
        primarySubnet: formData.primarySubnet || '10.80.0.0/24',
        techniciansAssigned: Number(formData.techniciansAssigned) || 1,
        lastAuditDate: new Date().toISOString().split('T')[0],
      };
      onAddBranch(newBranch);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Branch Infrastructure Management</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {branches.length} Hubs
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer regional branch offices, edge connectivity, IT asset allocation, and local technician crews.
          </p>
        </div>

        <button
          id="add-branch-modal-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Branch</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by branch title, code, city, or manager..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="healthy">Healthy</option>
            <option value="degraded">Degraded</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBranches.map((branch) => {
          const branchAssets = assets.filter((a) => a.branchId === branch.id);
          const branchTickets = tickets.filter((t) => t.branchId === branch.id && t.status !== 'Closed');

          return (
            <div
              key={branch.id}
              id={`branch-item-${branch.id}`}
              className="rounded-sm bg-white border border-slate-200 hover:border-blue-400 transition-all flex flex-col justify-between overflow-hidden shadow-sm"
            >
              <div className="p-3.5 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                        {branch.code}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">{branch.region}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1">
                      {branch.name}
                    </h3>
                  </div>

                  {branch.networkStatus === 'healthy' ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" />
                      HEALTHY
                    </span>
                  ) : branch.networkStatus === 'degraded' ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3" />
                      DEGRADED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
                      <XCircle className="w-3 h-3" />
                      CRITICAL
                    </span>
                  )}
                </div>

                {/* Location & Contact */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{branch.address}, {branch.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Mgr: {branch.manager}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-blue-700">
                    <Network className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Subnet: {branch.primarySubnet}</span>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">ASSETS</div>
                    <div className="text-xs font-bold font-mono text-slate-800">
                      {branchAssets.length || branch.activeAssetsCount}
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">OPEN TKT</div>
                    <div
                      className={`text-xs font-bold font-mono ${
                        branchTickets.length > 0 ? 'text-red-600' : 'text-slate-800'
                      }`}
                    >
                      {branchTickets.length || branch.openTicketsCount}
                    </div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">CREW</div>
                    <div className="text-xs font-bold font-mono text-slate-800">
                      {branch.techniciansAssigned} Staff
                    </div>
                  </div>
                </div>

                {/* Bandwidth Usage Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">WAN Bandwidth Load</span>
                    <span
                      className={`font-semibold font-mono ${
                        branch.bandwidthUsage > 85
                          ? 'text-red-600'
                          : branch.bandwidthUsage > 70
                          ? 'text-amber-600'
                          : 'text-green-700'
                      }`}
                    >
                      {branch.bandwidthUsage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        branch.bandwidthUsage > 85
                          ? 'bg-red-500'
                          : branch.bandwidthUsage > 70
                          ? 'bg-amber-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${branch.bandwidthUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-mono text-slate-500">
                  Last Audit: {branch.lastAuditDate}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(branch)}
                    className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors"
                    title="Edit Branch Settings"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to remove ${branch.name}?`)) {
                        onDeleteBranch(branch.id);
                      }
                    }}
                    className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-slate-200 transition-colors"
                    title="Delete Branch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Branch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{editingBranch ? 'EDIT BRANCH OFFICE' : 'REGISTER NEW BRANCH OFFICE'}</span>
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. South Logistics Center"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Branch Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. LOG-SOUTH"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Region
                  </label>
                  <select
                    value={formData.region || 'Central'}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Central">Central</option>
                    <option value="East Coast">East Coast</option>
                    <option value="West Coast">West Coast</option>
                    <option value="Midwest">Midwest</option>
                    <option value="Southeast">Southeast</option>
                    <option value="Southwest">Southwest</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    City, State
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Austin, TX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                  placeholder="e.g. 500 Technology Way"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Branch Manager
                  </label>
                  <input
                    type="text"
                    value={formData.manager || ''}
                    onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="Manager full name"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Manager Email
                  </label>
                  <input
                    type="email"
                    value={formData.managerEmail || ''}
                    onChange={(e) => setFormData({ ...formData, managerEmail: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="manager@enterprise.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Primary Subnet
                  </label>
                  <input
                    type="text"
                    value={formData.primarySubnet || ''}
                    onChange={(e) => setFormData({ ...formData, primarySubnet: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="10.x.0.0/24"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Tech Crew
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.techniciansAssigned || 1}
                    onChange={(e) => setFormData({ ...formData, techniciansAssigned: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Network Status
                  </label>
                  <select
                    value={formData.networkStatus || 'healthy'}
                    onChange={(e) => setFormData({ ...formData, networkStatus: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="healthy">Healthy</option>
                    <option value="degraded">Degraded</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  {editingBranch ? 'Save Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
