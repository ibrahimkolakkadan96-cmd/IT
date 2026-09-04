import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Search,
  CheckSquare,
  Square,
} from 'lucide-react';
import { MaintenanceTask, Branch, ITAsset } from '../../types';

interface MaintenanceViewProps {
  tasks: MaintenanceTask[];
  branches: Branch[];
  assets: ITAsset[];
  onAddTask: (task: MaintenanceTask) => void;
  onUpdateTask: (task: MaintenanceTask) => void;
}

export const MaintenanceView: React.FC<MaintenanceViewProps> = ({
  tasks,
  branches,
  onAddTask,
  onUpdateTask,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Form State for new task
  const [formData, setFormData] = useState<Partial<MaintenanceTask>>({
    title: '',
    branchId: branches[0]?.id || 'br-01',
    type: 'Preventive',
    frequency: 'Monthly',
    scheduledDate: new Date().toISOString().split('T')[0],
    leadEngineer: 'Alex Rivera (Network Admin)',
    estimatedHours: 3,
    notes: '',
  });
  const [checklistItemsInput, setChecklistItemsInput] = useState('Verify power feeds\nClean air filters\nTest failover circuit');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.jobCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leadEngineer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.branchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleToggleChecklist = (task: MaintenanceTask, itemId: string) => {
    const updatedChecklist = task.checklist.map((c) =>
      c.id === itemId ? { ...c, completed: !c.completed } : c
    );

    const allDone = updatedChecklist.every((c) => c.completed);
    const updated: MaintenanceTask = {
      ...task,
      checklist: updatedChecklist,
      status: allDone ? 'Completed' : task.status === 'Scheduled' ? 'In Progress' : task.status,
      completedAt: allDone ? new Date().toISOString() : undefined,
    };
    onUpdateTask(updated);
  };

  const handleOpenSchedule = () => {
    setFormData({
      title: '',
      branchId: branches[0]?.id || 'br-01',
      type: 'Preventive',
      frequency: 'Monthly',
      scheduledDate: new Date().toISOString().split('T')[0],
      leadEngineer: 'Alex Rivera (Network Admin)',
      estimatedHours: 2,
      notes: '',
    });
    setChecklistItemsInput('Step 1: Visual inspection\nStep 2: Configuration snapshot\nStep 3: Firmware verification');
    setIsScheduleModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const branch = branches.find((b) => b.id === formData.branchId);
    const rawChecklist = checklistItemsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newTask: MaintenanceTask = {
      id: `mnt-${Date.now()}`,
      jobCode: `PM-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title || 'Scheduled Hardware Maintenance',
      branchId: formData.branchId || branches[0]?.id || 'br-01',
      branchName: branch?.name || 'Metropolitan Headquarters',
      type: (formData.type as any) || 'Preventive',
      frequency: (formData.frequency as any) || 'Monthly',
      scheduledDate: formData.scheduledDate || new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      leadEngineer: formData.leadEngineer || 'Field Technician',
      estimatedHours: Number(formData.estimatedHours) || 2,
      checklist: rawChecklist.map((taskText, idx) => ({
        id: `c-${Date.now()}-${idx}`,
        task: taskText,
        completed: false,
      })),
      notes: formData.notes || 'Routine infrastructure servicing.',
    };

    onAddTask(newTask);
    setIsScheduleModalOpen(false);
  };

  return (
    <div className="space-y-4 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-sm p-3.5 shadow-sm">
        <div>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-blue-600" />
            <span>Preventive Maintenance & Servicing</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
              {tasks.length} Maintenance Schedules
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated maintenance windows, firmware patch rollouts, datacenter calibrations, and technician checklists.
          </p>
        </div>

        <button
          id="schedule-maintenance-btn"
          onClick={handleOpenSchedule}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Schedule Maintenance Job</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 p-2.5 rounded-sm bg-white border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search maintenance job title, engineer, or job code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded bg-white border border-slate-300 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Types</option>
            <option value="Preventive">Preventive</option>
            <option value="Firmware Patch">Firmware Patch</option>
            <option value="Calibration">Calibration</option>
            <option value="Hardware Upgrade">Hardware Upgrade</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {filteredTasks.map((task) => {
          const completedCount = task.checklist.filter((c) => c.completed).length;
          const totalChecklist = task.checklist.length;
          const progressPercent = totalChecklist > 0 ? (completedCount / totalChecklist) * 100 : 0;

          return (
            <div
              key={task.id}
              id={`maintenance-card-${task.id}`}
              className="rounded-sm bg-white border border-slate-200 hover:border-slate-300 shadow-sm p-3.5 space-y-3 flex flex-col justify-between transition-all"
            >
              <div className="space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 px-1.5 py-0.2 rounded bg-blue-50 border border-blue-100">
                        {task.jobCode}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">{task.type}</span>
                      <span className="text-[11px] text-slate-400">· {task.frequency}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1">{task.title}</h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      task.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : task.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Location & Engineer */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono pt-0.5">
                  <span className="font-sans">Branch: <strong className="text-slate-700 font-medium">{task.branchName}</strong></span>
                  <span className="font-sans">Lead: <strong className="text-slate-700 font-medium">{task.leadEngineer.split(' ')[0]}</strong> ({task.estimatedHours}h)</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Task Checklist Progress</span>
                    <span className="text-blue-700 font-bold">
                      {completedCount}/{totalChecklist} ({Math.round(progressPercent)}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        progressPercent === 100 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Checklist items toggle */}
                <div className="space-y-1 pt-0.5">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Execution Steps:</div>
                  <div className="space-y-1">
                    {task.checklist.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleToggleChecklist(task, item.id)}
                        className={`flex items-start gap-2 p-1.5 rounded cursor-pointer transition-colors text-xs border ${
                          item.completed
                            ? 'bg-green-50 text-green-800 line-through border-green-200'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        {item.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        )}
                        <span className="leading-tight">{item.task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer notes */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Scheduled: <strong className="text-slate-700 font-mono">{task.scheduledDate}</strong></span>
                {task.completedAt && (
                  <span className="text-green-700 font-mono font-semibold">
                    Completed: {new Date(task.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Maintenance Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-sm bg-white border border-slate-200 shadow-2xl p-5 space-y-3.5 max-h-[90vh] overflow-y-auto text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                <span>Schedule Preventive Maintenance Task</span>
              </h2>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs px-2 py-0.5 rounded bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  placeholder="e.g. Core Switch Firmware Security Patching"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Branch Location</label>
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
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Maintenance Type</label>
                  <select
                    value={formData.type || 'Preventive'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="Preventive">Preventive</option>
                    <option value="Firmware Patch">Firmware Patch</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Hardware Upgrade">Hardware Upgrade</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Frequency</label>
                  <select
                    value={formData.frequency || 'Monthly'}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  >
                    <option value="One-time">One-time</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Biannual">Biannual</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate || ''}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Est. Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.estimatedHours || 2}
                    onChange={(e) => setFormData({ ...formData, estimatedHours: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">Lead Engineer</label>
                <input
                  type="text"
                  value={formData.leadEngineer || ''}
                  onChange={(e) => setFormData({ ...formData, leadEngineer: e.target.value })}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                  placeholder="e.g. Alex Rivera"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[11px] uppercase">
                  Checklist Items (One per line)
                </label>
                <textarea
                  rows={3}
                  value={checklistItemsInput}
                  onChange={(e) => setChecklistItemsInput(e.target.value)}
                  className="w-full p-2 rounded bg-white border border-slate-300 text-slate-800 font-mono text-[11px] focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  Schedule Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
