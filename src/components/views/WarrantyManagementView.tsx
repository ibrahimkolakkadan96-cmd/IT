import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  Phone,
  Mail,
} from 'lucide-react';
import { WarrantyContract, ITAsset } from '../../types';

interface WarrantyManagementViewProps {
  warranties: WarrantyContract[];
  assets: ITAsset[];
  onAddWarranty: (warranty: WarrantyContract) => void;
  onRenewWarranty: (contractId: string, additionalDays: number) => void;
}

export const WarrantyManagementView: React.FC<WarrantyManagementViewProps> = ({
  warranties,
  onAddWarranty,
  onRenewWarranty,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedWarrantyForClaim, setSelectedWarrantyForClaim] = useState<WarrantyContract | null>(null);
  const [claimSubject, setClaimSubject] = useState('');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  const filteredWarranties = warranties.filter((w) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      w.vendor.toLowerCase().includes(term) ||
      w.contractNumber.toLowerCase().includes(term) ||
      w.coverageType.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAnnualCost = warranties.reduce((acc, curr) => acc + curr.annualCost, 0);
  const expiringCount = warranties.filter((w) => w.status === 'Expiring Soon').length;
  const expiredCount = warranties.filter((w) => w.status === 'Expired').length;

  const handleOpenClaim = (w: WarrantyContract) => {
    setSelectedWarrantyForClaim(w);
    setClaimSubject('');
    setClaimSuccessMsg('');
    setIsClaimModalOpen(true);
  };

  const handleSubmitClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccessMsg(
      `Claim successfully dispatched to ${selectedWarrantyForClaim?.vendor} TAC. Support ticket #TAC-${Math.floor(
        100000 + Math.random() * 900000
      )} created.`
    );
    setTimeout(() => {
      setIsClaimModalOpen(false);
      setClaimSuccessMsg('');
    }, 2000);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>OEM Warranty & Service Contract Management</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {warranties.length} Active SLA Contracts
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Vendor service level agreements, mission-critical warranty expiration radars, and automated RMA claims.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const newContract: WarrantyContract = {
                id: `war-${Date.now()}`,
                contractNumber: `WTY-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`,
                vendor: 'HPE Pointnext Complete Care',
                vendorSupportPhone: '+1 (800) 474-6836',
                vendorSupportEmail: 'support@hpe.com',
                coverageType: '24/7 Onsite Mission-Critical',
                status: 'Active',
                startDate: '2026-01-01',
                endDate: '2028-01-01',
                daysRemaining: 480,
                annualCost: 12400,
                coveredAssetsCount: 18,
                coveredCategories: ['Server', 'SAN Storage'],
                slaResponseHours: 4,
              };
              onAddWarranty(newContract);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Service Contract</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Annual OEM Contract Investment</span>
          <div className="mt-1 text-xl font-bold font-mono text-blue-700">
            ${totalAnnualCost.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across infrastructure vendors</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Expiring Within 90 Days</span>
          <div className="mt-1 text-xl font-bold font-mono text-amber-700">
            {expiringCount} Contracts
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Renewal countdown active</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Lapsed / Expired Contracts</span>
          <div className="mt-1 text-xl font-bold font-mono text-red-700">
            {expiredCount} Uncovered
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Operating without vendor SLA</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search contracts, vendors, or coverage types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Expiring Soon">Expiring Soon</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredWarranties.map((w) => {
          return (
            <div
              key={w.id}
              className="rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-3.5 space-y-3 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-100">
                        {w.contractNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-semibold">
                        SLA: {w.slaResponseHours}h Onsite
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">{w.vendor}</h3>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{w.coverageType}</div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      w.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : w.status === 'Expiring Soon'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {w.status}
                  </span>
                </div>

                {/* Covered items and timeline */}
                <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-slate-100 text-center">
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">COVERED NODES</div>
                    <div className="text-xs font-bold font-mono text-slate-800">{w.coveredAssetsCount} Assets</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">DAYS REMAINING</div>
                    <div
                      className={`text-xs font-bold font-mono ${
                        w.daysRemaining <= 0
                          ? 'text-red-600'
                          : w.daysRemaining < 90
                          ? 'text-amber-700'
                          : 'text-green-700'
                      }`}
                    >
                      {w.daysRemaining > 0 ? `${w.daysRemaining} days` : 'EXPIRED'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-100">
                    <div className="text-[9px] text-slate-400 font-semibold uppercase">ANNUAL COST</div>
                    <div className="text-xs font-bold font-mono text-blue-700">
                      ${w.annualCost.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Vendor direct contacts */}
                <div className="space-y-1 text-xs text-slate-600 font-mono p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Support Hotline: {w.vendorSupportPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Support Desk: {w.vendorSupportEmail}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-500">
                  Expiry: {w.endDate}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenClaim(w)}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-blue-700 font-semibold text-xs transition-colors"
                  >
                    Submit Claim / RMA
                  </button>

                  <button
                    onClick={() => onRenewWarranty(w.id, 365)}
                    className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    Extend +1 Yr
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Modal */}
      {isClaimModalOpen && selectedWarrantyForClaim && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                <span>Submit OEM Warranty Claim / RMA</span>
              </h2>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            {claimSuccessMsg ? (
              <div className="p-3.5 rounded bg-green-50 border border-green-200 text-green-800 text-xs text-center font-medium">
                {claimSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Contract / Vendor</label>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-800 font-mono">
                    {selectedWarrantyForClaim.contractNumber} ({selectedWarrantyForClaim.vendor})
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Incident or Defective Part</label>
                  <textarea
                    rows={3}
                    required
                    value={claimSubject}
                    onChange={(e) => setClaimSubject(e.target.value)}
                    placeholder="Describe defective component (e.g. PSU module blinking amber, thermal head defect, ECC RAM failure)..."
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>

                <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono space-y-1">
                  <div>Dispatch Tier: {selectedWarrantyForClaim.coverageType}</div>
                  <div>Direct Phone: {selectedWarrantyForClaim.vendorSupportPhone}</div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsClaimModalOpen(false)}
                    className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                  >
                    Transmit Claim
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
