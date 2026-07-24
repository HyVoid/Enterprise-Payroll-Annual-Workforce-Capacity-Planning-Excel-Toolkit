import React, { useState } from 'react';
import { DeptLogEntry, Employee, SettingsConfig, DepartmentMeta } from '../types';
import { DEPARTMENTS } from '../data/defaultData';
import { calculateLogEntry, formatCurrency, formatHours } from '../utils/calculations';
import { Building2, Plus, Trash2, Calendar, FileText, ChevronRight, Layers } from 'lucide-react';

interface DeptDataViewProps {
  deptId: string; // e.g. 'dept_1', 'dept_2', ...
  allDeptLogs: Record<string, DeptLogEntry[]>;
  employees: Employee[];
  settings: SettingsConfig;
  onSelectDeptTab: (deptId: string) => void;
  onAddLogEntry: (deptId: string, entry: DeptLogEntry) => void;
  onUpdateLogEntry: (deptId: string, entry: DeptLogEntry) => void;
  onDeleteLogEntry: (deptId: string, logId: string) => void;
}

export const DeptDataView: React.FC<DeptDataViewProps> = ({
  deptId,
  allDeptLogs,
  employees,
  settings,
  onSelectDeptTab,
  onAddLogEntry,
  onUpdateLogEntry,
  onDeleteLogEntry,
}) => {
  const currentDeptMeta = DEPARTMENTS.find((d) => d.id === deptId) || DEPARTMENTS[0];
  const logs = allDeptLogs[deptId] || [];

  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New log form state
  const [newLog, setNewLog] = useState<{
    month: string;
    empId: string;
    regularHours: number;
    otHours: number;
    allowances: number;
    notes: string;
  }>({
    month: '2026-01',
    empId: employees.length > 0 ? employees[0].empId : '',
    regularHours: 160,
    otHours: 10,
    allowances: 0,
    notes: '',
  });

  // Department employees matching current deptCode
  const deptEmployees = employees.filter(
    (e) => e.deptId.trim().toLowerCase() === currentDeptMeta.deptCode.trim().toLowerCase()
  );

  // Calculate formulas for each log entry
  const calculatedLogs = logs.map((log) => calculateLogEntry(log, employees, settings));

  // Filter logs by month if selected
  const filteredLogs = calculatedLogs.filter((log) => {
    if (selectedMonth === 'ALL') return true;
    return log.month === selectedMonth;
  });

  // Calculate maximum total hours for data bar proportional fill
  const maxTotalHours = Math.max(...calculatedLogs.map((l) => l.totalHours), 220);

  // Totals for header summary
  const monthTotalHours = filteredLogs.reduce((sum, l) => sum + l.totalHours, 0);
  const monthTotalGrossPay = filteredLogs.reduce((sum, l) => sum + l.grossPay, 0);
  const monthTotalOtPay = filteredLogs.reduce((sum, l) => sum + l.otPay, 0);

  const handleCreateLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.empId) return;

    const createdEntry: DeptLogEntry = {
      id: `log-${Date.now()}`,
      deptId,
      month: newLog.month,
      empId: newLog.empId,
      regularHours: newLog.regularHours,
      otHours: newLog.otHours,
      allowances: newLog.allowances,
      notes: newLog.notes,
    };

    onAddLogEntry(deptId, createdEntry);
    setShowAddModal(false);
  };

  const handleFieldChange = (logId: string, field: keyof DeptLogEntry, value: string | number) => {
    const target = logs.find((l) => l.id === logId);
    if (!target) return;

    onUpdateLogEntry(deptId, {
      ...target,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 page-fade-up">
      {/* Department Tab Quick Switch Bar */}
      <div className="app-card p-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-xs font-semibold text-[#888888] px-2 shrink-0 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-[#2251FF]" />
          <span>Sheets:</span>
        </span>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onSelectDeptTab(dept.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 ${
              dept.id === deptId
                ? 'bg-[#051C2C] text-white shadow-xs font-semibold'
                : 'text-[#051C2C] bg-[#F5F5F2] hover:bg-gray-200'
            }`}
          >
            <span>{dept.shortName}</span>
            <span className="opacity-60 text-[10px]">({dept.deptCode})</span>
          </button>
        ))}
      </div>

      {/* Main Department Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-[#2251FF]/10 text-[#2251FF]">
              {currentDeptMeta.deptCode}
            </span>
            <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
              {currentDeptMeta.name} ({currentDeptMeta.shortName})
            </h2>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            Departmental labor log data collector. Edit regular hours, overtime, and allowances in pale yellow cells to propagate real-time payroll calculations.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Month Selector */}
          <div className="flex items-center gap-1.5 text-xs text-[#888888] bg-white px-3 py-1.5 rounded-lg border border-[#E8E8E6] shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#2251FF]" />
            <span className="font-medium text-[#051C2C]">Month:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-semibold text-[#051C2C] focus:outline-none"
            >
              <option value="ALL">All Months</option>
              <option value="2026-01">2026-01</option>
              <option value="2026-02">2026-02</option>
              <option value="2026-03">2026-03</option>
              <option value="2026-04">2026-04</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] rounded-lg flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Monthly Entry</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards for this Dept */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="app-card p-4">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Filtered Total Hours
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C] mt-1">
            {formatHours(monthTotalHours)}
          </div>
          <p className="text-[11px] text-[#888888] mt-0.5">Regular + Overtime Hours</p>
        </div>

        <div className="app-card p-4">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Filtered Gross Payroll
          </div>
          <div className="kpi-number text-2xl font-bold text-[#2251FF] mt-1">
            {formatCurrency(monthTotalGrossPay, settings.currency)}
          </div>
          <p className="text-[11px] text-[#888888] mt-0.5">Base + OT Pay + Allowances</p>
        </div>

        <div className="app-card p-4">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Filtered Overtime Pay
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C] mt-1">
            {formatCurrency(monthTotalOtPay, settings.currency)}
          </div>
          <p className="text-[11px] text-[#888888] mt-0.5">
            Multiplier: {settings.otMultiplier}x
          </p>
        </div>
      </div>

      {/* Main Data Collector Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                <th className="py-3 px-3 table-header-cell">Month</th>
                <th className="py-3 px-3 table-header-cell">Emp ID</th>
                <th className="py-3 px-3 table-header-cell">Emp Name (XLOOKUP)</th>
                <th className="py-3 px-3 table-header-cell text-right">Reg. Hours</th>
                <th className="py-3 px-3 table-header-cell text-right">OT Hours</th>
                <th className="py-3 px-3 table-header-cell text-right">Allowances</th>
                <th className="py-3 px-3 table-header-cell text-right min-w-[130px]">
                  Total Hours & Bar
                </th>
                <th className="py-3 px-3 table-header-cell text-right">Base Pay</th>
                <th className="py-3 px-3 table-header-cell text-right">OT Pay</th>
                <th className="py-3 px-3 table-header-cell text-right">Gross Pay</th>
                <th className="py-3 px-3 table-header-cell">Notes</th>
                <th className="py-3 px-3 table-header-cell text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-10 text-center text-[#888888]">
                    No entries logged for this department for the selected month.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const barPercent = Math.min(100, Math.max(5, (log.totalHours / maxTotalHours) * 100));

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Month */}
                      <td className="py-2.5 px-3">
                        <input
                          type="month"
                          value={log.month}
                          onChange={(e) => handleFieldChange(log.id, 'month', e.target.value)}
                          className="input-editable font-mono text-xs w-28"
                        />
                      </td>

                      {/* Emp ID Select */}
                      <td className="py-2.5 px-3">
                        <select
                          value={log.empId}
                          onChange={(e) => handleFieldChange(log.id, 'empId', e.target.value)}
                          className="input-editable font-mono text-xs font-semibold text-[#051C2C] w-28"
                        >
                          {employees.map((e) => (
                            <option key={e.empId} value={e.empId}>
                              {e.empId} ({e.empName.split(' ')[0]})
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Emp Name Auto-Lookup */}
                      <td className="py-2.5 px-3 font-medium text-[#051C2C] bg-[#051C2C]/[0.02]">
                        {log.empName}
                      </td>

                      {/* Regular Hours (Editable Yellow) */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={log.regularHours}
                          onChange={(e) =>
                            handleFieldChange(log.id, 'regularHours', parseFloat(e.target.value) || 0)
                          }
                          className="input-editable font-mono text-right font-medium w-20"
                        />
                      </td>

                      {/* OT Hours (Editable Yellow) */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={log.otHours}
                          onChange={(e) =>
                            handleFieldChange(log.id, 'otHours', parseFloat(e.target.value) || 0)
                          }
                          className="input-editable font-mono text-right font-semibold text-[#2251FF] w-20"
                        />
                      </td>

                      {/* Allowances (Editable Yellow) */}
                      <td className="py-2.5 px-3 text-right">
                        <input
                          type="number"
                          step="10"
                          min="0"
                          value={log.allowances}
                          onChange={(e) =>
                            handleFieldChange(log.id, 'allowances', parseFloat(e.target.value) || 0)
                          }
                          className="input-editable font-mono text-right w-24"
                        />
                      </td>

                      {/* Total Hours & Data Bar */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-[#051C2C]">
                            {log.totalHours.toFixed(1)} hrs
                          </span>
                          <div className="data-bar-track">
                            <div className="data-bar-fill" style={{ width: `${barPercent}%` }} />
                          </div>
                        </div>
                      </td>

                      {/* Base Pay (Formula) */}
                      <td className="py-2.5 px-3 text-right font-mono text-[#051C2C]/80 bg-[#051C2C]/[0.02]">
                        {formatCurrency(log.basePay, settings.currency)}
                      </td>

                      {/* OT Pay (Formula) */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-[#2251FF] bg-[#051C2C]/[0.02]">
                        {formatCurrency(log.otPay, settings.currency)}
                      </td>

                      {/* Gross Pay (Formula) */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#051C2C] bg-[#051C2C]/[0.03]">
                        {formatCurrency(log.grossPay, settings.currency)}
                      </td>

                      {/* Notes */}
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={log.notes}
                          onChange={(e) => handleFieldChange(log.id, 'notes', e.target.value)}
                          className="input-editable text-xs text-[#051C2C] w-full min-w-[100px]"
                          placeholder="Note..."
                        />
                      </td>

                      {/* Delete Action */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => onDeleteLogEntry(deptId, log.id)}
                          className="p-1 text-[#888888] hover:text-[#D32F2F] hover:bg-red-50 rounded transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="app-card w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
              <h3 className="font-garamond text-xl font-bold text-[#051C2C]">
                Add Monthly Log for {currentDeptMeta.shortName}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-[#888888] hover:text-[#051C2C] px-2 py-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLogSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Business Month</label>
                  <input
                    type="month"
                    required
                    value={newLog.month}
                    onChange={(e) => setNewLog({ ...newLog, month: e.target.value })}
                    className="input-editable w-full font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Select Employee</label>
                  <select
                    value={newLog.empId}
                    onChange={(e) => setNewLog({ ...newLog, empId: e.target.value })}
                    className="input-editable w-full font-medium"
                  >
                    {employees.map((e) => (
                      <option key={e.empId} value={e.empId}>
                        {e.empId} - {e.empName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Regular Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newLog.regularHours}
                    onChange={(e) =>
                      setNewLog({ ...newLog, regularHours: parseFloat(e.target.value) || 0 })
                    }
                    className="input-editable w-full font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">OT Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newLog.otHours}
                    onChange={(e) =>
                      setNewLog({ ...newLog, otHours: parseFloat(e.target.value) || 0 })
                    }
                    className="input-editable w-full font-mono font-semibold text-[#2251FF]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#051C2C] mb-1">Allowances ({settings.currency})</label>
                  <input
                    type="number"
                    step="10"
                    min="0"
                    value={newLog.allowances}
                    onChange={(e) =>
                      setNewLog({ ...newLog, allowances: parseFloat(e.target.value) || 0 })
                    }
                    className="input-editable w-full font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#051C2C] mb-1">Notes / Task Remarks</label>
                <input
                  type="text"
                  value={newLog.notes}
                  onChange={(e) => setNewLog({ ...newLog, notes: e.target.value })}
                  className="input-editable w-full"
                  placeholder="e.g. Q1 Project Deployment"
                />
              </div>

              <div className="pt-3 border-t border-[#E8E8E6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-[#888888] hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] rounded-md transition-colors"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
