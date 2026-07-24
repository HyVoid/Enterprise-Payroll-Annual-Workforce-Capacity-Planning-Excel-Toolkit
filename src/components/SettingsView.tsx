import React from 'react';
import { SettingsConfig } from '../types';
import { HelpCircle, Sliders, DollarSign, Calendar, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

interface SettingsViewProps {
  settings: SettingsConfig;
  onUpdateSettings: (newSettings: SettingsConfig) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ settings, onUpdateSettings }) => {
  const handleChange = (field: keyof SettingsConfig, value: string | number) => {
    onUpdateSettings({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="space-y-6 page-fade-up">
      {/* Page Title & Explanation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E8E6]">
        <div>
          <h2 className="font-garamond text-2xl font-bold text-[#051C2C] tracking-tight">
            System Parameters & Settings (Sheet 1: Settings)
          </h2>
          <p className="text-xs text-[#888888] mt-1">
            Global configuration parameters for payroll formulas, currency display, overtime multipliers, and capacity risk thresholds.
          </p>
        </div>
      </div>

      {/* Insight Banner */}
      <div className="insight-block p-4 space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#051C2C]">
          <HelpCircle className="w-4 h-4 text-[#2251FF]" />
          <span>Zero-Hardcoding Architecture Rule</span>
        </div>
        <p className="text-xs text-[#051C2C]/80 leading-relaxed">
          All formulas in department logs and annual trackers dynamically reference these settings. Modifying any parameter below will immediately recalculate all payroll amounts, overtime pay rates, target hours, and capacity risk alerts across the entire application without manual edits.
        </p>
      </div>

      {/* Main Settings Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Currency & Fiscal Year */}
        <div className="app-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#051C2C] pb-2 border-b border-[#E8E8E6]">
            <DollarSign className="w-4 h-4 text-[#2251FF]" />
            <span>Currency & Financial Period</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                Default Currency Symbol (<span className="font-mono text-[#888888]">VAR_CURRENCY</span>)
              </label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="input-editable w-full text-sm font-medium"
                placeholder="$"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Controls financial display formatting across all payroll summary sheets ($ , €, £, ¥, etc.).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                Financial Year Start Date (<span className="font-mono text-[#888888]">VAR_FY_START</span>)
              </label>
              <input
                type="date"
                value={settings.fyStart}
                onChange={(e) => handleChange('fyStart', e.target.value)}
                className="input-editable w-full text-sm font-medium"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Defines the official start date for YTD cumulative hours and payroll calculations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                Annual Total Months (<span className="font-mono text-[#888888]">VAR_TOTAL_MONTHS</span>)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.totalMonths}
                onChange={(e) => handleChange('totalMonths', parseInt(e.target.value) || 12)}
                className="input-editable w-full text-sm font-medium"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Used to compute monthly target benchmark hours (Contract Hours / Total Months). Default is 12.
              </p>
            </div>
          </div>
        </div>

        {/* Overtime Multiplier & Risk Thresholds */}
        <div className="app-card p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#051C2C] pb-2 border-b border-[#E8E8E6]">
            <Sliders className="w-4 h-4 text-[#2251FF]" />
            <span>Overtime Multiplier & Capacity Risk Thresholds</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                Overtime Rate Multiplier (<span className="font-mono text-[#888888]">VAR_OT_MULTIPLIER</span>)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={settings.otMultiplier}
                onChange={(e) => handleChange('otMultiplier', parseFloat(e.target.value) || 1.5)}
                className="input-editable w-full text-sm font-medium"
              />
              <p className="text-[11px] text-[#888888] mt-1">
                Formula multiplier applied to regular hourly rates for OT hours (e.g. 1.5 = 150% time-and-a-half).
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                High Overtime Risk Threshold (<span className="font-mono text-[#888888]">VAR_WARN_HIGH</span>)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.5"
                  max="1.5"
                  value={settings.warnHigh}
                  onChange={(e) => handleChange('warnHigh', parseFloat(e.target.value) || 0.85)}
                  className="input-editable w-full text-sm font-medium"
                />
                <span className="text-xs font-bold text-[#D32F2F] shrink-0">
                  {(settings.warnHigh * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[11px] text-[#888888] mt-1">
                Utilization rate at which an employee is flagged as <span className="text-[#D32F2F] font-semibold">⚠️ Overtime Risk</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#051C2C] mb-1">
                Capacity Idle Threshold (<span className="font-mono text-[#888888]">VAR_WARN_LOW</span>)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="0.6"
                  value={settings.warnLow}
                  onChange={(e) => handleChange('warnLow', parseFloat(e.target.value) || 0.40)}
                  className="input-editable w-full text-sm font-medium"
                />
                <span className="text-xs font-bold text-[#2251FF] shrink-0">
                  {(settings.warnLow * 100).toFixed(0)}%
                </span>
              </div>
              <p className="text-[11px] text-[#888888] mt-1">
                Utilization rate below which an employee is flagged as <span className="text-[#2251FF] font-semibold">🔵 Capacity Idle</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Parameter Reference Dictionary Table */}
      <div className="app-card p-6 space-y-4">
        <h3 className="font-garamond text-lg font-bold text-[#051C2C]">
          System Parameter Call Reference
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E8E6] bg-[#051C2C]/[0.04]">
                <th className="py-2 px-3 table-header-cell">Parameter Name</th>
                <th className="py-2 px-3 table-header-cell">Code Identifier</th>
                <th className="py-2 px-3 table-header-cell">Current Value</th>
                <th className="py-2 px-3 table-header-cell">Target Sheets & Formula Use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E8E6] text-xs">
              <tr className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-[#051C2C]">Currency Symbol</td>
                <td className="py-2.5 px-3 font-mono text-[#888888]">VAR_CURRENCY</td>
                <td className="py-2.5 px-3 font-semibold text-[#2251FF]">{settings.currency}</td>
                <td className="py-2.5 px-3 text-[#051C2C]">Used in all financial formatting across Payroll Summary and Dashboard</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-[#051C2C]">FY Start Date</td>
                <td className="py-2.5 px-3 font-mono text-[#888888]">VAR_FY_START</td>
                <td className="py-2.5 px-3 font-semibold text-[#051C2C]">{settings.fyStart}</td>
                <td className="py-2.5 px-3 text-[#051C2C]">Annual Hours Tracker & YTD Payroll scope</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-[#051C2C]">Overtime Multiplier</td>
                <td className="py-2.5 px-3 font-mono text-[#888888]">VAR_OT_MULTIPLIER</td>
                <td className="py-2.5 px-3 font-semibold text-[#2251FF]">{settings.otMultiplier}x</td>
                <td className="py-2.5 px-3 text-[#051C2C]">Dept 1~7 calculation: <span className="font-mono">OT_Pay = OT_Hours * Base_Rate * VAR_OT_MULTIPLIER</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-[#051C2C]">High Risk Threshold</td>
                <td className="py-2.5 px-3 font-mono text-[#888888]">VAR_WARN_HIGH</td>
                <td className="py-2.5 px-3 font-semibold text-[#D32F2F]">{(settings.warnHigh * 100).toFixed(0)}%</td>
                <td className="py-2.5 px-3 text-[#051C2C]">Annual Hours Tracker: flags employees exceeding capacity threshold</td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2.5 px-3 font-medium text-[#051C2C]">Idle Risk Threshold</td>
                <td className="py-2.5 px-3 font-mono text-[#888888]">VAR_WARN_LOW</td>
                <td className="py-2.5 px-3 font-semibold text-[#2251FF]">{(settings.warnLow * 100).toFixed(0)}%</td>
                <td className="py-2.5 px-3 text-[#051C2C]">Annual Hours Tracker: flags employees underutilized below baseline</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
