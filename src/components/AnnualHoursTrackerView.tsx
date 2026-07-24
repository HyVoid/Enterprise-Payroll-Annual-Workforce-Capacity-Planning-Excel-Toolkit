import React, { useState } from 'react';
import { DeptLogEntry, Employee, SettingsConfig, RiskStatus } from '../types';
import { calculateAnnualHoursTracker, formatHours, formatPercent } from '../utils/calculations';
import { Clock, AlertTriangle, Info, CheckCircle2, Search, Filter, ShieldAlert } from 'lucide-react';

interface AnnualHoursTrackerViewProps {
  allDeptLogs: Record<string, DeptLogEntry[]>;
  employees: Employee[];
  settings: SettingsConfig;
}

export const AnnualHoursTrackerView: React.FC<AnnualHoursTrackerViewProps> = ({
  allDeptLogs,
  employees,
  settings,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');

  const trackerItems = calculateAnnualHoursTracker(allDeptLogs, employees, settings);

  const filteredItems = trackerItems.filter((item) => {
    const matchesSearch =
      item.empName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.deptName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = selectedRiskFilter === 'ALL' || item.riskStatus === selectedRiskFilter;

    return matchesSearch && matchesRisk;
  });

  const highRiskCount = trackerItems.filter((i) => i.riskStatus === 'Overtime Risk').length;
  const idleCount = trackerItems.filter((i) => i.riskStatus === 'Capacity Idle').length;
  const normalCount = trackerItems.filter((i) => i.riskStatus === 'Normal Range').length;

  const totalContract = trackerItems.reduce((sum, i) => sum + i.contractHours, 0);
  const totalActual = trackerItems.reduce((sum, i) => sum + i.ytdActualHours, 0);
  const avgUtilization = totalContract > 0 ? totalActual / totalContract : 0;

  return (
    <div className="space-y-6 page-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
            Annual Hours & Capacity Risk Tracker (Sheet 11: Annual_Hours_Tracker)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Real-time workforce capacity forecasting engine. Tracks YTD consumed hours against annual contract limits to detect overtime depletion risks and idle labor capacity.
          </p>
        </div>
      </div>

      {/* Insight Explanatory Block */}
      <div className="insight-block p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#051C2C]">
          <Info className="w-4 h-4 text-[#2251FF]" />
          <span>Capacity Threshold Alert Engine</span>
        </div>
        <p className="text-xs text-[#051C2C]/80 leading-relaxed">
          Employees exceeding <span className="font-bold text-[#D32F2F]">{(settings.warnHigh * 100).toFixed(0)}%</span> of annual contract hours are flagged for <span className="font-bold text-[#D32F2F]">⚠️ Overtime Risk</span> to prevent burnout and compliance violations. Employees below <span className="font-bold text-[#2251FF]">{(settings.warnLow * 100).toFixed(0)}%</span> are flagged for <span className="font-bold text-[#2251FF]">🔵 Capacity Idle</span> to guide workload redistribution.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="app-card p-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
              Avg Utilization Rate
            </div>
            <div className="kpi-number text-2xl font-bold text-[#051C2C] mt-1">
              {formatPercent(avgUtilization)}
            </div>
            <div className="text-[11px] text-[#888888]">{formatHours(totalActual)} / {formatHours(totalContract)}</div>
          </div>
          <Clock className="w-8 h-8 text-[#051C2C]/20" />
        </div>

        <div
          onClick={() => setSelectedRiskFilter('Overtime Risk')}
          className="app-card p-4 flex items-center justify-between interactive-cell border-l-4 border-[#D32F2F]"
        >
          <div>
            <div className="text-[11px] font-semibold text-[#D32F2F] uppercase tracking-wider">
              Overtime Risk Count
            </div>
            <div className="kpi-number text-2xl font-bold text-[#D32F2F] mt-1">
              {highRiskCount} Employees
            </div>
            <div className="text-[11px] text-[#888888]">≥ {(settings.warnHigh * 100).toFixed(0)}% Capacity Threshold</div>
          </div>
          <AlertTriangle className="w-8 h-8 text-[#D32F2F]" />
        </div>

        <div
          onClick={() => setSelectedRiskFilter('Capacity Idle')}
          className="app-card p-4 flex items-center justify-between interactive-cell border-l-4 border-[#2251FF]"
        >
          <div>
            <div className="text-[11px] font-semibold text-[#2251FF] uppercase tracking-wider">
              Capacity Idle Count
            </div>
            <div className="kpi-number text-2xl font-bold text-[#2251FF] mt-1">
              {idleCount} Employees
            </div>
            <div className="text-[11px] text-[#888888]">≤ {(settings.warnLow * 100).toFixed(0)}% Capacity Threshold</div>
          </div>
          <Info className="w-8 h-8 text-[#2251FF]" />
        </div>

        <div
          onClick={() => setSelectedRiskFilter('Normal Range')}
          className="app-card p-4 flex items-center justify-between interactive-cell border-l-4 border-[#00C853]"
        >
          <div>
            <div className="text-[11px] font-semibold text-[#00C853] uppercase tracking-wider">
              Normal Capacity
            </div>
            <div className="kpi-number text-2xl font-bold text-[#00C853] mt-1">
              {normalCount} Employees
            </div>
            <div className="text-[11px] text-[#888888]">Balanced Capacity Range</div>
          </div>
          <CheckCircle2 className="w-8 h-8 text-[#00C853]" />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="app-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#888888]" />
          <input
            type="text"
            placeholder="Search employee, ID or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md focus:outline-none focus:border-[#2251FF]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-[#2251FF]" />
          <span className="text-xs font-medium text-[#888888]">Risk Status:</span>
          <select
            value={selectedRiskFilter}
            onChange={(e) => setSelectedRiskFilter(e.target.value)}
            className="text-xs bg-[#F5F5F2] border border-[#E8E8E6] rounded-md px-3 py-1.5 font-semibold text-[#051C2C]"
          >
            <option value="ALL">All Risk Statuses ({trackerItems.length})</option>
            <option value="Overtime Risk">⚠️ Overtime Risk ({highRiskCount})</option>
            <option value="Capacity Idle">🔵 Capacity Idle ({idleCount})</option>
            <option value="Normal Range">✅ Normal Range ({normalCount})</option>
          </select>
        </div>
      </div>

      {/* Main Annual Hours Tracker Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                <th className="py-3 px-4 table-header-cell">Emp ID</th>
                <th className="py-3 px-4 table-header-cell">Employee Name</th>
                <th className="py-3 px-4 table-header-cell">Department</th>
                <th className="py-3 px-4 table-header-cell">Position</th>
                <th className="py-3 px-4 table-header-cell text-right">Annual Contract</th>
                <th className="py-3 px-4 table-header-cell text-right">YTD Consumed</th>
                <th className="py-3 px-4 table-header-cell text-right">Remaining Balance</th>
                <th className="py-3 px-4 table-header-cell text-right min-w-[140px]">
                  Utilization % & Bar
                </th>
                <th className="py-3 px-4 table-header-cell text-center">Capacity Risk Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-[#888888]">
                    No employee capacity logs match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const utilPct = item.utilizationRate * 100;

                  return (
                    <tr key={item.empId} className="hover:bg-gray-50/80 transition-colors">
                      {/* Emp ID */}
                      <td className="py-3 px-4 font-mono font-bold text-[#051C2C]">
                        {item.empId}
                      </td>

                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-[#051C2C]">
                        {item.empName}
                      </td>

                      {/* Dept */}
                      <td className="py-3 px-4 text-[#051C2C]">
                        {item.deptName}
                      </td>

                      {/* Position */}
                      <td className="py-3 px-4 text-[#888888]">
                        {item.position}
                      </td>

                      {/* Contract Hours */}
                      <td className="py-3 px-4 text-right font-mono font-medium text-[#051C2C]">
                        {formatHours(item.contractHours)}
                      </td>

                      {/* YTD Consumed Hours */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#2251FF]">
                        {formatHours(item.ytdActualHours)}
                      </td>

                      {/* Remaining Hours Balance */}
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold ${
                          item.remainingHours < 0 ? 'text-[#D32F2F]' : 'text-[#051C2C]'
                        }`}
                      >
                        {formatHours(item.remainingHours)}
                      </td>

                      {/* Utilization % & Bar */}
                      <td className="py-3 px-4 text-right">
                        <div className="space-y-1">
                          <span className="font-mono font-semibold text-[#051C2C]">
                            {formatPercent(item.utilizationRate)}
                          </span>
                          <div className="data-bar-track">
                            <div
                              className={`data-bar-fill ${
                                item.riskStatus === 'Overtime Risk'
                                  ? 'bg-[#D32F2F]'
                                  : item.riskStatus === 'Capacity Idle'
                                  ? 'bg-[#2251FF]'
                                  : 'bg-[#00C853]'
                              }`}
                              style={{ width: `${Math.min(100, utilPct)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Risk Status Capsule Pill (Hover Interactive Cell) */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`interactive-cell inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-2xs ${
                            item.riskStatus === 'Overtime Risk'
                              ? 'bg-[#D32F2F]/10 text-[#D32F2F]'
                              : item.riskStatus === 'Capacity Idle'
                              ? 'bg-[#2251FF]/10 text-[#2251FF]'
                              : 'bg-[#00C853]/10 text-[#00C853]'
                          }`}
                        >
                          {item.riskStatus === 'Overtime Risk' && (
                            <ShieldAlert className="w-3.5 h-3.5" />
                          )}
                          {item.riskStatus === 'Capacity Idle' && (
                            <Info className="w-3.5 h-3.5" />
                          )}
                          {item.riskStatus === 'Normal Range' && (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          <span>{item.riskStatus}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
