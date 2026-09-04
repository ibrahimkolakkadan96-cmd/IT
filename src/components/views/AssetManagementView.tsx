import React, { useState } from 'react';
import {
  Laptop2,
  Plus,
  Search,
  QrCode,
  Tag,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Edit2,
  Ticket,
  MonitorPlay,
} from 'lucide-react';
import { ITAsset, Branch, AssetCategory, AssetStatus } from '../../types';

interface AssetManagementViewProps {
  assets?: ITAsset[];
  branches?: Branch[];
  onAddAsset: (asset: ITAsset) => void;
  onUpdateAsset: (asset: ITAsset) => void;
  onDeleteAsset: (assetId: string) => void;
  onOpenCreateTicketForAsset?: (asset: ITAsset) => void;
  onCreateTicketForAsset?: (asset: ITAsset) => void;
  onOpenRemoteForAsset?: (asset: ITAsset) => void;
}

export const AssetManagementView: React.FC<AssetManagementViewProps> = ({
  assets = [],
  branches = [],
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onOpenCreateTicketForAsset,
  onCreateTicketForAsset,
  onOpenRemoteForAsset,
}) => {
  const handleCreateTicket = (asset: ITAsset) => {
    if (onOpenCreateTicketForAsset) onOpenCreateTicketForAsset(asset);
    else if (onCreateTicketForAsset) onCreateTicketForAsset(asset);
  };

  const handleRemoteConnect = (asset: ITAsset) => {
    if (onOpenRemoteForAsset) onOpenRemoteForAsset(asset);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<ITAsset | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<ITAsset | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ITAsset>>({
    tag: '',
    name: '',
    category: 'Workstation',
    model: '',
    manufacturer: '',
    serialNumber: '',
    branchId: branches[0]?.id || 'br-01',
    assignedToUser: '',
    ipAddress: '',
    os: '',
    status: 'Operational',
    condition: 'Excellent',
    purchaseCost: 1500,
    warrantyExpiry: '2027-12-31',
    specifications: {
      cpu: '',
      ram: '',
      storage: '',
    },
  });

  const categories: AssetCategory[] = [
    'Workstation',
    'Server',
    'Networking',
    'Firewall',
    'Printer & Peripheral',
    'Mobile Device',
    'VoIP System',
  ];

  const filteredAssets = assets.filter((asset) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      asset.name.toLowerCase().includes(term) ||
      asset.tag.toLowerCase().includes(term) ||
      asset.serialNumber.toLowerCase().includes(term) ||
      asset.assignedToUser.toLowerCase().includes(term) ||
      asset.model.toLowerCase().includes(term) ||
      (asset.ipAddress && asset.ipAddress.includes(term));

    const matchesCategory = categoryFilter === 'ALL' || asset.category === categoryFilter;
    const matchesBranch = branchFilter === 'ALL' || asset.branchId === branchFilter;
    const matchesStatus = statusFilter === 'ALL' || asset.status === statusFilter;

    return matchesSearch && matchesCategory && matchesBranch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingAsset(null);
    setFormData({
      tag: `AST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Workstation',
      model: '',
      manufacturer: 'Dell Technologies',
      serialNumber: `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      branchId: branches[0]?.id || 'br-01',
      assignedToUser: 'Staff User',
      ipAddress: '10.10.5.12',
      os: 'Windows 11 Pro',
      status: 'Operational',
      condition: 'Excellent',
      purchaseCost: 1800,
      warrantyExpiry: '2027-09-01',
      specifications: {
        cpu: 'Intel Core i7',
        ram: '32 GB DDR5',
        storage: '1TB NVMe',
      },
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (asset: ITAsset) => {
    setEditingAsset(asset);
    setFormData({ ...asset });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetBranch = branches.find((b) => b.id === formData.branchId);

    if (editingAsset) {
      onUpdateAsset({
        ...editingAsset,
        ...(formData as ITAsset),
        branchName: targetBranch?.name || editingAsset.branchName,
      });
    } else {
      const newAsset: ITAsset = {
        id: `ast-${Date.now()}`,
        tag: formData.tag || `AST-${Date.now().toString().slice(-4)}`,
        name: formData.name || 'Enterprise Endpoint',
        category: (formData.category as AssetCategory) || 'Workstation',
        model: formData.model || 'Standard Enterprise Hardware',
        manufacturer: formData.manufacturer || 'Dell',
        serialNumber: formData.serialNumber || 'SN-UNKNOWN',
        branchId: formData.branchId || branches[0]?.id || 'br-01',
        branchName: targetBranch?.name || 'Metropolitan Headquarters',
        assignedToUser: formData.assignedToUser || 'IT Pool',
        ipAddress: formData.ipAddress || '10.10.x.x',
        os: formData.os || 'Windows 11',
        status: (formData.status as AssetStatus) || 'Operational',
        condition: formData.condition || 'Excellent',
        purchaseDate: new Date().toISOString().split('T')[0],
        warrantyExpiry: formData.warrantyExpiry || '2027-12-31',
        purchaseCost: Number(formData.purchaseCost) || 1200,
        specifications: formData.specifications || {},
        lastMaintenanceDate: new Date().toISOString().split('T')[0],
      };
      onAddAsset(newAsset);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Laptop2 className="w-4 h-4 text-blue-600" />
            <span>IT Asset & Hardware Lifecycle Management</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {assets.length} Assets Registered
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Enterprise hardware inventory, specification audits, assignment tracking, and serial tagging.
          </p>
        </div>

        <button
          id="add-asset-modal-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Asset</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, asset tag, serial #, user, or IP address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Operational">Operational</option>
            <option value="In Maintenance">In Maintenance</option>
            <option value="In Storage">In Storage</option>
            <option value="Decommissioned">Decommissioned</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="rounded-sm bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Asset Tag / Model</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Branch Location</th>
                <th className="py-2.5 px-3">Assigned User / IP</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Warranty</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => {
                const isExpiredWarranty = new Date(asset.warrantyExpiry) < new Date();

                return (
                  <tr
                    key={asset.id}
                    id={`asset-row-${asset.id}`}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Tag & Name */}
                    <td className="py-2.5 px-4">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => setSelectedAssetForDetail(asset)}
                          className="p-1 rounded bg-slate-100 text-blue-600 hover:bg-slate-200 transition-colors shrink-0 mt-0.5"
                          title="View Tag & Barcode"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className="font-mono font-bold text-blue-700 flex items-center gap-1.5">
                            <span>{asset.tag}</span>
                            <span className="text-[10px] text-slate-400 font-sans">({asset.serialNumber})</span>
                          </div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{asset.name}</div>
                          <div className="text-[11px] text-slate-500">{asset.manufacturer} {asset.model}</div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {asset.category}
                      </span>
                    </td>

                    {/* Branch */}
                    <td className="py-2.5 px-3 text-slate-700">
                      <div>{asset.branchName}</div>
                    </td>

                    {/* Assigned User & IP */}
                    <td className="py-2.5 px-3">
                      <div className="text-slate-800 font-medium truncate max-w-[130px]">{asset.assignedToUser}</div>
                      {asset.ipAddress && (
                        <div className="text-[10px] font-mono text-blue-600">{asset.ipAddress}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          asset.status === 'Operational'
                            ? 'bg-green-100 text-green-700'
                            : asset.status === 'In Maintenance'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {asset.status === 'Operational' && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {asset.status === 'In Maintenance' && <AlertTriangle className="w-2.5 h-2.5" />}
                        {asset.status}
                      </span>
                    </td>

                    {/* Warranty */}
                    <td className="py-2.5 px-3">
                      <div
                        className={`text-[11px] font-mono ${
                          isExpiredWarranty ? 'text-red-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        {asset.warrantyExpiry}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">${asset.purchaseCost.toLocaleString()}</div>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleCreateTicket(asset)}
                          className="p-1 rounded text-slate-500 hover:text-amber-600 hover:bg-slate-100 transition-colors"
                          title="Open Ticket for this Asset"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoteConnect(asset)}
                          className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                          title="Launch Remote Session"
                        >
                          <MonitorPlay className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(asset)}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Edit Asset"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Remove asset ${asset.tag} (${asset.name})?`)) {
                              onDeleteAsset(asset.id);
                            }
                          }}
                          className="p-1 rounded text-slate-500 hover:text-red-600 hover:bg-slate-100 transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAssets.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No IT assets match the selected search and filter criteria.
          </div>
        )}
      </div>

      {/* Asset Tag & QR Modal Preview */}
      {selectedAssetForDetail && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                  HARDWARE TAG & AUDIT DETAILS
                </span>
              </div>
              <button
                onClick={() => setSelectedAssetForDetail(null)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Asset Barcode / Tag Simulation Card */}
            <div className="p-4 rounded border border-slate-200 bg-slate-50 text-center space-y-2">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold">
                Enterprise Infrastructure Property
              </div>
              <div className="text-2xl font-black font-mono tracking-widest text-slate-900">
                {selectedAssetForDetail.tag}
              </div>

              {/* Simulated 1D Barcode lines */}
              <div className="flex items-center justify-center gap-[2px] h-10 py-1 px-4 bg-white rounded border border-slate-200">
                {Array.from({ length: 36 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900 h-full"
                    style={{
                      width: idx % 3 === 0 ? '3px' : idx % 5 === 0 ? '1px' : '2px',
                    }}
                  />
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-600">
                S/N: {selectedAssetForDetail.serialNumber} · {selectedAssetForDetail.branchName}
              </div>
            </div>

            {/* Specifications breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-700 text-[11px] uppercase tracking-tight">
                Technical Specifications
              </div>
              <div className="p-3 rounded bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Model:</span>
                  <span className="text-slate-800 font-medium">
                    {selectedAssetForDetail.manufacturer} {selectedAssetForDetail.model}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">OS / Firmware:</span>
                  <span className="text-slate-800 font-medium">{selectedAssetForDetail.os || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CPU / ASIC:</span>
                  <span className="text-slate-800 font-medium">{selectedAssetForDetail.specifications?.cpu || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Memory:</span>
                  <span className="text-slate-800 font-medium">{selectedAssetForDetail.specifications?.ram || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Storage:</span>
                  <span className="text-slate-800 font-medium">{selectedAssetForDetail.specifications?.storage || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Warranty Expiry:</span>
                  <span className="text-blue-700 font-bold">{selectedAssetForDetail.warrantyExpiry}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleCreateTicket(selectedAssetForDetail);
                  setSelectedAssetForDetail(null);
                }}
                className="px-3 py-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                Log Ticket
              </button>
              <button
                onClick={() => setSelectedAssetForDetail(null)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-4 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Laptop2 className="w-4 h-4 text-blue-600" />
                <span>{editingAsset ? 'EDIT IT HARDWARE RECORD' : 'REGISTER NEW IT HARDWARE ASSET'}</span>
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
                    Asset Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.tag || ''}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. AST-SRV-009"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Category
                  </label>
                  <select
                    value={formData.category || 'Workstation'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  Asset Name / Role
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                  placeholder="e.g. Core Distribution Switch Stack"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Manufacturer
                  </label>
                  <input
                    type="text"
                    value={formData.manufacturer || ''}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Dell, Cisco, Zebra"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. PowerEdge R750"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Serial Number
                  </label>
                  <input
                    type="text"
                    value={formData.serialNumber || ''}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. SN-8829-X01"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Branch Location
                  </label>
                  <select
                    value={formData.branchId || branches[0]?.id}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
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
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Assigned User / Department
                  </label>
                  <input
                    type="text"
                    value={formData.assignedToUser || ''}
                    onChange={(e) => setFormData({ ...formData, assignedToUser: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Sarah Jenkins (Finance)"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    IP Address (Static/DHCP)
                  </label>
                  <input
                    type="text"
                    value={formData.ipAddress || ''}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="10.x.x.x"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Status
                  </label>
                  <select
                    value={formData.status || 'Operational'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Operational">Operational</option>
                    <option value="In Maintenance">In Maintenance</option>
                    <option value="In Storage">In Storage</option>
                    <option value="Decommissioned">Decommissioned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Cost ($)
                  </label>
                  <input
                    type="number"
                    value={formData.purchaseCost || 0}
                    onChange={(e) => setFormData({ ...formData, purchaseCost: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                    Warranty Expiry
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyExpiry || ''}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
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
                  {editingAsset ? 'Save Asset' : 'Register Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
