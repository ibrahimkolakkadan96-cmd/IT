import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
} from 'lucide-react';
import { Branch, ITAsset, ITTicket, WarrantyContract } from '../../types';

interface ReportsViewProps {
  branches: Branch[];
  assets: ITAsset[];
  tickets: ITTicket[];
  warranties: WarrantyContract[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  branches,
  assets,
  tickets,
}) => {
  const [timeRange, setTimeRange] = useState('Last 30 Days');

  const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;
  const breachedTickets = tickets.filter((t) => t.isBreachedSla).length;
  const slaCompliance = totalTickets > 0 ? (((totalTickets - breachedTickets) / totalTickets) * 100).toFixed(1) : '100';

  const categoryBreakdown = [
    { name: 'Network Incidents', count: tickets.filter((t) => t.category === 'Network').length, mttr: '1.8 hrs' },
    { name: 'Hardware Failures', count: tickets.filter((t) => t.category === 'Hardware').length, mttr: '4.2 hrs' },
    { name: 'Access & Security', count: tickets.filter((t) => t.category === 'Access & Security').length, mttr: '2.1 hrs' },
    { name: 'Printer / Logistics', count: tickets.filter((t) => t.category === 'Printer').length, mttr: '3.0 hrs' },
    { name: 'Telephony & Conf', count: tickets.filter((t) => t.category === 'Telephony').length, mttr: '1.4 hrs' },
  ];

  const handleExportCSV = () => {
    const headers = ['Branch Code', 'Branch Name', 'City', 'Active Assets', 'Open Tickets', 'Network Status'];
    const rows = branches.map((b) => [
      b.code,
      `"${b.name}"`,
      `"${b.city}"`,
      b.activeAssetsCount,
      b.openTicketsCount,
      b.networkStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Enterprise_IT_Operations_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Infrastructure Analytics & SLA Performance Reports</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              Quarterly Operations Audit
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Executive audit benchmarks, Mean Time To Resolution (MTTR), branch failure density, and capital depreciation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-600 font-semibold text-[11px] uppercase">Audit Window:</span>
          {['Last 7 Days', 'Last 30 Days', 'Quarter to Date', 'Year to Date'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                timeRange === range
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="text-slate-500 font-mono text-[11px]">
          Audited at {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">SLA Resolution Rate</span>
          <div className="mt-1 text-xl font-bold font-mono text-green-700">{slaCompliance}%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Contract target &gt; 95.0%</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Mean Time to Resolution (MTTR)</span>
          <div className="mt-1 text-xl font-bold font-mono text-blue-700">2.7 hrs</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Down 14% vs previous quarter</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Total Capital Hardware Base</span>
          <div className="mt-1 text-xl font-bold font-mono text-slate-900">
            ${assets.reduce((sum, a) => sum + a.purchaseCost, 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{assets.length} monitored machines</div>
        </div>

        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Resolved Incident Volume</span>
          <div className="mt-1 text-xl font-bold font-mono text-blue-700">
            {resolvedTickets} / {totalTickets}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In current audit period</div>
        </div>
      </div>

      {/* Main Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Incident Breakdown by Category */}
        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Incident Volume & MTTR by Technology Domain
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Service Benchmarks</span>
          </div>

          <div className="space-y-2.5">
            {categoryBreakdown.map((cat) => {
              const maxCount = Math.max(...categoryBreakdown.map((c) => c.count), 1);
              const barWidth = Math.round((cat.count / maxCount) * 100);

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-800 font-semibold">{cat.name}</span>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="text-slate-500">{cat.count} tickets</span>
                      <span className="text-blue-700 font-bold">MTTR: {cat.mttr}</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${Math.max(barWidth, 12)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch Failure Frequency & Infrastructure Load */}
        <div className="p-3.5 rounded-sm bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-tight">
              Branch Incident Density & Failure Index
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Regional Comparison</span>
          </div>

          <div className="space-y-2">
            {branches.map((b) => {
              const branchTickets = tickets.filter((t) => t.branchId === b.id);
              const failRate = ((branchTickets.length / (b.activeAssetsCount || 1)) * 100).toFixed(1);

              return (
                <div
                  key={b.id}
                  className="p-2 rounded bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{b.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {b.city} · {b.activeAssetsCount} assets
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="font-bold text-slate-900">{branchTickets.length} Incidents</div>
                    <div
                      className={`text-[10px] font-semibold ${
                        Number(failRate) > 3 ? 'text-red-600' : 'text-green-700'
                      }`}
                    >
                      Failure Index: {failRate}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
