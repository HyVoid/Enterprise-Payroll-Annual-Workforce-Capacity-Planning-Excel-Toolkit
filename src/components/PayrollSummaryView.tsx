import React, { useState } from 'react';
import { DeptLogEntry, Employee, SettingsConfig } from '../types';
import { calculatePayrollSummary, formatCurrency, formatPercent } from '../utils/calculations';
import { PieChart, Calendar, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';

interface PayrollSummaryViewProps {
  allDeptLogs: Record<string, DeptLogEntry[]>;
  employees: Employee[];
  settings: SettingsConfig;
}

export const PayrollSummaryView: React.FC<PayrollSummaryViewProps> = ({
  allDeptLogs,
  employees,
  settings,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  const summaryData = calculatePayrollSummary(
    allDeptLogs,
    employees,
    settings,
    selectedMonth === 'ALL' ? undefined : selectedMonth
  );

  const grandTotalBase = summaryData.reduce((sum, item) => sum + item.totalBasePay, 0);
  const grandTotalOt = summaryData.reduce((sum, item) => sum + item.totalOtPay, 0);
  const grandTotalAllowances = summaryData.reduce((sum, item) => sum + item.totalAllowances, 0);
  const grandTotalGross = summaryData.reduce((sum, item) => sum + item.totalGrossPay, 0);
  const grandYtdGross = summaryData.reduce((sum, item) => sum + item.ytdGrossPay, 0);

  const overallOtRatio = grandTotalGross > 0 ? grandTotalOt / grandTotalGross : 0;
  const maxGrossPay = Math.max(...summaryData.map((d) => d.totalGrossPay), 1);

  // Composition %
  const basePct = grandTotalGross > 0 ? (grandTotalBase / grandTotalGross) * 100 : 0;
  const otPct = grandTotalGross > 0 ? (grandTotalOt / grandTotalGross) * 100 : 0;
  const allowPct = grandTotalGross > 0 ? (grandTotalAllowances / grandTotalGross) * 100 : 0;

  return (
    <div className="space-y-6 page-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
            Consolidated Payroll Summary (Sheet 10: Payroll_Summary)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Automated cross-departmental consolidation. Dynamically aggregates base salaries, overtime pay, and allowances across all 7 business units.
          </p>
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-lg border border-[#E8E8E6] shadow-xs text-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-[#2251FF]" />
          <span className="font-semibold text-[#051C2C]">Consolidation Scope:</span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-transparent font-bold text-[#2251FF] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All YTD Months</option>
            <option value="2026-01">2026-01</option>
            <option value="2026-02">2026-02</option>
            <option value="2026-03">2026-03</option>
            <option value="2026-04">2026-04</option>
          </select>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="app-card p-5 space-y-1">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Total Base Salaries
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C]">
            {formatCurrency(grandTotalBase, settings.currency)}
          </div>
          <div className="text-[11px] text-[#888888]">{basePct.toFixed(1)}% of total payroll</div>
        </div>

        <div className="app-card p-5 space-y-1">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Total Overtime Expense
          </div>
          <div className="kpi-number text-2xl font-bold text-[#2251FF]">
            {formatCurrency(grandTotalOt, settings.currency)}
          </div>
          <div className="text-[11px] text-[#2251FF] font-medium">{otPct.toFixed(1)}% OT ratio</div>
        </div>

        <div className="app-card p-5 space-y-1">
          <div className="text-[11px] font-semibold text-[#888888] uppercase tracking-wider">
            Total Allowances
          </div>
          <div className="kpi-number text-2xl font-bold text-[#051C2C]">
            {formatCurrency(grandTotalAllowances, settings.currency)}
          </div>
          <div className="text-[11px] text-[#888888]">{allowPct.toFixed(1)}% of total payroll</div>
        </div>

        <div className="app-card p-5 space-y-1 bg-[#051C2C] text-white">
          <div className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
            Consolidated Gross Pay
          </div>
          <div className="kpi-number text-2xl font-bold text-white">
            {formatCurrency(grandTotalGross, settings.currency)}
          </div>
          <div className="text-[11px] text-gray-300">YTD Total: {formatCurrency(grandYtdGross, settings.currency)}</div>
        </div>
      </div>

      {/* Expense Composition Progress Bar */}
      <div className="app-card p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#051C2C]">Payroll Structure Composition</span>
          <span className="text-[#888888] font-mono">
            Base: {basePct.toFixed(0)}% | OT: {otPct.toFixed(0)}% | Allowances: {allowPct.toFixed(0)}%
          </span>
        </div>

        <div className="h-3 w-full rounded-full overflow-hidden flex bg-gray-100">
          <div
            style={{ width: `${basePct}%` }}
            className="bg-[#051C2C] h-full"
            title={`Base Pay: ${formatCurrency(grandTotalBase, settings.currency)}`}
          />
          <div
            style={{ width: `${otPct}%` }}
            className="bg-[#2251FF] h-full"
            title={`OT Pay: ${formatCurrency(grandTotalOt, settings.currency)}`}
          />
          <div
            style={{ width: `${allowPct}%` }}
            className="bg-[#00C853] h-full"
            title={`Allowances: ${formatCurrency(grandTotalAllowances, settings.currency)}`}
          />
        </div>

        <div className="flex items-center gap-6 text-[11px] text-[#888888]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#051C2C]" />
            <span>Regular Base Pay</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2251FF]" />
            <span>Overtime Pay ({settings.otMultiplier}x)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00C853]" />
            <span>Allowances & Bonuses</span>
          </div>
        </div>
      </div>

      {/* Main Department Payroll Table */}
      <div className="app-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                <th className="py-3 px-4 table-header-cell">Code</th>
                <th className="py-3 px-4 table-header-cell">Department Name</th>
                <th className="py-3 px-4 table-header-cell text-right">Base Salary</th>
                <th className="py-3 px-4 table-header-cell text-right">OT Pay</th>
                <th className="py-3 px-4 table-header-cell text-right">Allowances</th>
                <th className="py-3 px-4 table-header-cell text-right">Period Gross Pay</th>
                <th className="py-3 px-4 table-header-cell text-right">YTD Gross Pay</th>
                <th className="py-3 px-4 table-header-cell text-right min-w-[140px]">
                  OT Ratio & Bar
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              {summaryData.map((item) => {
                const otRatioPct = item.otRatio * 100;
                const isOtHigh = item.otRatio > 0.20; // > 20% OT triggers anomaly badge

                return (
                  <tr key={item.deptId} className="hover:bg-gray-50/80 transition-colors">
                    {/* Dept Code */}
                    <td className="py-3 px-4 font-mono font-bold text-[#051C2C]">
                      {item.deptCode}
                    </td>

                    {/* Dept Name */}
                    <td className="py-3 px-4 font-semibold text-[#051C2C]">
                      {item.deptName}
                    </td>

                    {/* Base Salary */}
                    <td className="py-3 px-4 text-right font-mono text-[#051C2C]">
                      {formatCurrency(item.totalBasePay, settings.currency)}
                    </td>

                    {/* OT Pay */}
                    <td className="py-3 px-4 text-right font-mono font-semibold text-[#2251FF]">
                      {formatCurrency(item.totalOtPay, settings.currency)}
                    </td>

                    {/* Allowances */}
                    <td className="py-3 px-4 text-right font-mono text-[#051C2C]/80">
                      {formatCurrency(item.totalAllowances, settings.currency)}
                    </td>

                    {/* Period Gross Pay */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#051C2C]">
                      {formatCurrency(item.totalGrossPay, settings.currency)}
                    </td>

                    {/* YTD Gross Pay */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#051C2C] bg-[#051C2C]/[0.02]">
                      {formatCurrency(item.ytdGrossPay, settings.currency)}
                    </td>

                    {/* OT Ratio & Inline Bar */}
                    <td className="py-3 px-4 text-right">
                      <div className="space-y-1">
                        <div className="flex items-center justify-end gap-1.5 font-mono font-semibold">
                          <span className={isOtHigh ? 'text-[#D32F2F]' : 'text-[#2251FF]'}>
                            {formatPercent(item.otRatio)}
                          </span>
                          {isOtHigh && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-100 text-[#D32F2F]">
                              High OT
                            </span>
                          )}
                        </div>
                        <div className="data-bar-track">
                          <div
                            className={`data-bar-fill ${isOtHigh ? 'bg-[#D32F2F]' : 'bg-[#2251FF]'}`}
                            style={{ width: `${Math.min(100, otRatioPct * 2.5)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Total Footer Row */}
            <tfoot>
              <tr className="border-t-2 border-[#051C2C] bg-[#051C2C]/[0.05] font-bold text-xs">
                <td colSpan={2} className="py-3.5 px-4 font-garamond text-base text-[#051C2C]">
                  ORGANIZATION CONSOLIDATED TOTALS
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#051C2C]">
                  {formatCurrency(grandTotalBase, settings.currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#2251FF]">
                  {formatCurrency(grandTotalOt, settings.currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#051C2C]">
                  {formatCurrency(grandTotalAllowances, settings.currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#051C2C] text-sm">
                  {formatCurrency(grandTotalGross, settings.currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#051C2C] text-sm bg-[#051C2C]/[0.05]">
                  {formatCurrency(grandYtdGross, settings.currency)}
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-[#2251FF]">
                  {formatPercent(overallOtRatio)} Avg
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
