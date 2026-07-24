import React from 'react';
import { DeptLogEntry, Employee, SettingsConfig, NavigationTab } from '../types';
import {
  calculateDashboardKPIs,
  calculatePayrollSummary,
  calculateAnnualHoursTracker,
  formatCurrency,
  formatHours,
  formatPercent,
} from '../utils/calculations';
import {
  DollarSign,
  Clock,
  BarChart2,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Info,
  Building2,
  FileSpreadsheet,
} from 'lucide-react';

interface DashboardViewProps {
  allDeptLogs: Record<string, DeptLogEntry[]>;
  employees: Employee[];
  settings: SettingsConfig;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  allDeptLogs,
  employees,
  settings,
  onNavigateTab,
}) => {
  const kpis = calculateDashboardKPIs(allDeptLogs, employees, settings);
  const summaryItems = calculatePayrollSummary(allDeptLogs, employees, settings);
  const trackerItems = calculateAnnualHoursTracker(allDeptLogs, employees, settings);

  const highRiskEmployees = trackerItems.filter((i) => i.riskStatus === 'Overtime Risk');
  const maxGrossPay = Math.max(...summaryItems.map((s) => s.ytdGrossPay), 1);

  return (
    <div className="space-y-6 page-fade-up">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
            Executive Decision Dashboard (Sheet 12: Dashboard)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Real-time executive cockpit for workforce capacity, payroll expenses, overtime risks, and department utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('payroll_summary')}
            className="px-3 py-1.5 text-xs font-semibold text-[#051C2C] bg-white border border-[#E8E8E6] hover:bg-gray-100 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <span>Payroll Summary</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#2251FF]" />
          </button>

          <button
            onClick={() => onNavigateTab('annual_hours_tracker')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <span>Hours Tracker</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>

      {/* Top Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* KPI 1: YTD Payroll */}
        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">YTD Gross Payroll</span>
            <DollarSign className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C]">
            {formatCurrency(kpis.totalYtdGrossPay, settings.currency)}
          </div>
          <div className="text-[10px] text-[#888888]">Consolidated 7 Departments</div>
        </div>

        {/* KPI 2: Contract Hours */}
        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Contract Capacity</span>
            <Clock className="w-4 h-4 text-[#051C2C]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C]">
            {formatHours(kpis.totalContractHours)}
          </div>
          <div className="text-[10px] text-[#888888]">Organization Total Hours</div>
        </div>

        {/* KPI 3: YTD Consumed Hours */}
        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">YTD Consumed Hours</span>
            <BarChart2 className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#2251FF]">
            {formatHours(kpis.totalYtdActualHours)}
          </div>
          <div className="text-[10px] text-[#888888]">Actual Work Executed</div>
        </div>

        {/* KPI 4: Avg Utilization */}
        <div className="app-card p-4 space-y-1">
          <div className="flex items-center justify-between text-[#888888]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Avg Capacity Util %</span>
            <TrendingUp className="w-4 h-4 text-[#00C853]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C]">
            {formatPercent(kpis.avgUtilizationRate)}
          </div>
          <div className="text-[10px] text-[#888888]">Workforce Avg Utilization</div>
        </div>

        {/* KPI 5: Overtime Risk Count */}
        <div
          onClick={() => onNavigateTab('annual_hours_tracker')}
          className="app-card p-4 space-y-1 interactive-cell border-l-4 border-[#D32F2F]"
        >
          <div className="flex items-center justify-between text-[#D32F2F]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Overtime Risk</span>
            <ShieldAlert className="w-4 h-4 text-[#D32F2F]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#D32F2F]">
            {kpis.highRiskCount} Staff
          </div>
          <div className="text-[10px] text-[#D32F2F] font-medium">≥ {(settings.warnHigh * 100).toFixed(0)}% Capacity Threshold</div>
        </div>

        {/* KPI 6: Capacity Idle Count */}
        <div
          onClick={() => onNavigateTab('annual_hours_tracker')}
          className="app-card p-4 space-y-1 interactive-cell border-l-4 border-[#2251FF]"
        >
          <div className="flex items-center justify-between text-[#2251FF]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Capacity Idle</span>
            <Info className="w-4 h-4 text-[#2251FF]" />
          </div>
          <div className="kpi-number text-2xl font-bold text-[#2251FF]">
            {kpis.idleCount} Staff
          </div>
          <div className="text-[10px] text-[#2251FF] font-medium">≤ {(settings.warnLow * 100).toFixed(0)}% Capacity Threshold</div>
        </div>
      </div>

      {/* Insight Block */}
      {kpis.highRiskCount > 0 && (
        <div className="insight-block p-4 space-y-1 bg-[#D32F2F]/[0.03] border-l-[3px] border-[#D32F2F]">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D32F2F]">
            <AlertTriangle className="w-4 h-4 text-[#D32F2F]" />
            <span>Capacity Risk Alert: {kpis.highRiskCount} Employee(s) Approaching Overtime Limit</span>
          </div>
          <p className="text-xs text-[#051C2C]/80 leading-relaxed">
            {highRiskEmployees.map((e) => `${e.empName} (${e.deptName}: ${formatPercent(e.utilizationRate)})`).join('; ')}. Reallocate upcoming task hours or shift project workloads to avoid overtime cost spikes.
          </p>
        </div>
      )}

      {/* Department Breakdown & High Risk Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Gross Payroll Breakdown */}
        <div className="app-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2251FF]" />
              <h3 className="font-garamond text-lg font-bold text-[#051C2C]">
                Department YTD Payroll Breakdown
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('payroll_summary')}
              className="text-xs text-[#2251FF] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View Table</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {summaryItems.map((item) => {
              const barPercent = Math.min(100, Math.max(8, (item.ytdGrossPay / maxGrossPay) * 100));

              return (
                <div
                  key={item.deptId}
                  onClick={() => onNavigateTab(item.deptId as NavigationTab)}
                  className="space-y-1 cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#051C2C] group-hover:text-[#2251FF] transition-colors">
                      {item.deptCode}: {item.deptName}
                    </span>
                    <span className="font-mono font-bold text-[#051C2C]">
                      {formatCurrency(item.ytdGrossPay, settings.currency)}
                    </span>
                  </div>
                  <div className="data-bar-track">
                    <div
                      className="data-bar-fill group-hover:bg-[#2251FF] transition-colors"
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Risk Employees Spotlight */}
        <div className="app-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#D32F2F]" />
              <h3 className="font-garamond text-lg font-bold text-[#051C2C]">
                Overtime Risk Spotlight (≥ {(settings.warnHigh * 100).toFixed(0)}%)
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('annual_hours_tracker')}
              className="text-xs text-[#2251FF] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {highRiskEmployees.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#888888] space-y-1">
              <CheckCircle2 className="w-8 h-8 text-[#00C853] mx-auto" />
              <p className="font-semibold text-[#051C2C]">No Overtime Risk Detected</p>
              <p>All employees are currently operating within safe capacity limits.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                    <th className="py-2 px-3 table-header-cell">Emp ID</th>
                    <th className="py-2 px-3 table-header-cell">Name</th>
                    <th className="py-2 px-3 table-header-cell">Department</th>
                    <th className="py-2 px-3 table-header-cell text-right">Consumed</th>
                    <th className="py-2 px-3 table-header-cell text-right">Util %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E8E6]">
                  {highRiskEmployees.map((emp) => (
                    <tr key={emp.empId} className="hover:bg-red-50/50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#051C2C]">
                        {emp.empId}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-[#051C2C]">{emp.empName}</td>
                      <td className="py-2.5 px-3 text-[#051C2C]">{emp.deptName}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D32F2F] font-bold">
                        {formatHours(emp.ytdActualHours)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="font-mono font-bold text-[#D32F2F] bg-red-100 px-2 py-0.5 rounded-full text-[11px]">
                          {formatPercent(emp.utilizationRate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
