import React, { useState } from 'react';
import {
  Boxes,
  Plus,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { SparePart, Branch } from '../../types';

interface SparePartsViewProps {
  spareParts: SparePart[];
  branches: Branch[];
  onAddPart: (part: SparePart) => void;
  onUpdateStock: (partId: string, delta: number) => void;
}

export const SparePartsView: React.FC<SparePartsViewProps> = ({
  spareParts,
  branches,
  onAddPart,
  onUpdateStock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<SparePart>>({
    sku: '',
    name: '',
    category: 'Storage / SSD',
    quantityInStock: 5,
    minimumThreshold: 3,
    unitCost: 150,
    warehouseBin: 'Bin A-01',
    assignedBranch: branches[0]?.name || 'Metropolitan Headquarters',
    supplier: 'Direct IT Supply',
  });

  const categories = Array.from(new Set(spareParts.map((p) => p.category)));

  const filteredParts = spareParts.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      p.sku.toLowerCase().includes(term) ||
      p.warehouseBin.toLowerCase().includes(term) ||
      p.supplier.toLowerCase().includes(term);

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalInventoryValue = spareParts.reduce(
    (acc, curr) => acc + curr.quantityInStock * curr.unitCost,
    0
  );
  const lowStockItems = spareParts.filter((p) => p.quantityInStock <= p.minimumThreshold);

  const handleOpenAdd = () => {
    setFormData({
      sku: `SP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: '',
      category: 'Storage / SSD',
      quantityInStock: 6,
      minimumThreshold: 4,
      unitCost: 120,
      warehouseBin: 'Shelf B-02',
      assignedBranch: branches[0]?.name || 'Metropolitan Headquarters',
      supplier: 'Insight Logistics',
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPart: SparePart = {
      id: `spr-${Date.now()}`,
      sku: formData.sku || `SP-${Date.now().toString().slice(-4)}`,
      name: formData.name || 'New Spare Part',
      category: (formData.category as any) || 'Storage / SSD',
      quantityInStock: Number(formData.quantityInStock) || 1,
      minimumThreshold: Number(formData.minimumThreshold) || 2,
      reservedCount: 0,
      unitCost: Number(formData.unitCost) || 50,
      warehouseBin: formData.warehouseBin || 'Bin X-01',
      assignedBranch: formData.assignedBranch || 'Metropolitan Headquarters',
      compatibleModels: ['Standard Enterprise Hardware'],
      lastRestockedDate: new Date().toISOString().split('T')[0],
      supplier: formData.supplier || 'Tech Distributors',
    };
    onAddPart(newPart);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <Boxes className="w-4 h-4 text-blue-600" />
            <span>Spare Parts Inventory & Replenishment</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {spareParts.length} Tracked Component SKUs
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Critical component stockpiles, minimum reorder thresholds, shelf bin tracking, and rapid dispatch.
          </p>
        </div>

        <button
          id="add-spare-part-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Spare Part</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Spare Inventory Value</span>
          <div className="mt-1 text-xl font-bold font-mono text-blue-700">
            ${totalInventoryValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Available for emergency replacement</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Stock Threshold Alerts</span>
          <div className="mt-1 text-xl font-bold font-mono text-amber-700">
            {lowStockItems.length} SKUs Low
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Below required buffer threshold</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Monitored SKUs</span>
          <div className="mt-1 text-xl font-bold font-mono text-slate-800">{spareParts.length} Parts</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across regional storage bins</div>
        </div>
      </div>

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search spare parts by name, SKU, bin location, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

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
      </div>

      {/* Parts Table */}
      <div className="rounded-sm bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
                <th className="py-2.5 px-3.5">Part Name / SKU</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Warehouse Location</th>
                <th className="py-2.5 px-3">In Stock / Min</th>
                <th className="py-2.5 px-3">Unit Cost</th>
                <th className="py-2.5 px-3">Supplier</th>
                <th className="py-2.5 px-3.5 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.map((part) => {
                const isLow = part.quantityInStock <= part.minimumThreshold;

                return (
                  <tr key={part.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3.5">
                      <div className="font-mono font-bold text-blue-700">{part.sku}</div>
                      <div className="font-semibold text-slate-900 mt-0.5 line-clamp-1">{part.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Compatible: {part.compatibleModels.join(', ')}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-slate-700">{part.category}</td>

                    <td className="py-2.5 px-3">
                      <div className="font-mono text-slate-800 font-medium">{part.warehouseBin}</div>
                      <div className="text-[10px] text-slate-500">{part.assignedBranch}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1 font-mono">
                        <span
                          className={`text-xs font-bold ${
                            isLow ? 'text-amber-700 flex items-center gap-1' : 'text-slate-900'
                          }`}
                        >
                          {isLow && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                          {part.quantityInStock}
                        </span>
                        <span className="text-slate-400 text-xs">/ min {part.minimumThreshold}</span>
                      </div>
                      {isLow && (
                        <span className="text-[10px] text-amber-700 font-semibold">Reorder Required</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-800 font-medium">
                      ${part.unitCost}
                    </td>

                    <td className="py-2.5 px-3 text-slate-600">{part.supplier}</td>

                    {/* Stock Adjustment Controls */}
                    <td className="py-2.5 px-3.5 text-right">
                      <div className="flex items-center justify-end gap-1 font-mono">
                        <button
                          onClick={() => onUpdateStock(part.id, -1)}
                          disabled={part.quantityInStock <= 0}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 text-slate-700 text-xs font-bold transition-colors"
                          title="Consume 1 unit for work order"
                        >
                          -1
                        </button>
                        <button
                          onClick={() => onUpdateStock(part.id, 1)}
                          className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 text-xs font-bold transition-colors"
                          title="Add 1 unit to stock"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => onUpdateStock(part.id, 5)}
                          className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors"
                          title="Restock batch (+5 units)"
                        >
                          +5
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Spare Part Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <Boxes className="w-4 h-4 text-blue-600" />
                <span>Register Spare Part SKU</span>
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
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">SKU Number</label>
                  <input
                    type="text"
                    required
                    value={formData.sku || ''}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. SP-NVME-2TB"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Category</label>
                  <select
                    value={formData.category || 'Storage / SSD'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Storage / SSD">Storage / SSD</option>
                    <option value="RAM Modules">RAM Modules</option>
                    <option value="Power Supplies">Power Supplies</option>
                    <option value="Network Cables">Network Cables</option>
                    <option value="SFP Modules">SFP Modules</option>
                    <option value="Cooling Fans">Cooling Fans</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Part Name / Model</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  placeholder="e.g. Samsung 1.92TB NVMe U.2 Enterprise SSD"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Initial Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantityInStock || 5}
                    onChange={(e) => setFormData({ ...formData, quantityInStock: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Min Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minimumThreshold || 3}
                    onChange={(e) => setFormData({ ...formData, minimumThreshold: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Unit Cost ($)</label>
                  <input
                    type="number"
                    value={formData.unitCost || 100}
                    onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Warehouse Bin</label>
                  <input
                    type="text"
                    value={formData.warehouseBin || ''}
                    onChange={(e) => setFormData({ ...formData, warehouseBin: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Shelf A-04"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier || ''}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                    placeholder="e.g. Insight Direct"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                >
                  Save Part
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
