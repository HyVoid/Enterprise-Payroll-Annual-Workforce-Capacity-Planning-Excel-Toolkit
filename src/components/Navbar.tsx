import React from 'react';
import { NavigationTab } from '../types';
import { DEPARTMENTS } from '../data/defaultData';
import {
  BarChart3,
  Settings as SettingsIcon,
  Users,
  Building2,
  PieChart,
  Clock,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  Save,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  lastSaved: string;
  onExportBackup: () => void;
  onOpenImportBackup: () => void;
  onOpenBulkCsv: () => void;
  onOpenResetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lastSaved,
  onExportBackup,
  onOpenImportBackup,
  onOpenBulkCsv,
  onOpenResetModal,
}) => {
  const [deptMenuOpen, setDeptMenuOpen] = React.useState(false);

  const isDeptActive = activeTab.startsWith('dept_');
  const activeDeptMeta = DEPARTMENTS.find((d) => d.id === activeTab);

  return (
    <header className="sticky top-0 z-50 h-[56px] bg-white border-b border-[#E8E8E6] shadow-xs select-none">
      <div className="max-w-[1400px] h-full mx-auto px-10 flex items-center justify-between gap-4">
        {/* Left: Logo & Brand Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#051C2C] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            W
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-garamond text-lg font-bold text-[#051C2C] leading-none tracking-tight">
                Workforce Capacity & Payroll
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#2251FF]/10 text-[#2251FF]">
                SaaS Edition
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#888888] mt-0.5">
              <Save className="w-3 h-3 text-[#00C853]" />
              <span>Last saved: {lastSaved || 'Just now'}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Tab Switcher */}
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar h-full pt-1">
          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#2251FF] font-semibold'
                : 'text-[#888888] hover:text-[#051C2C]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Dashboard</span>
            {activeTab === 'dashboard' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
            )}
          </button>

          {/* 2. Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'settings'
                ? 'text-[#2251FF] font-semibold'
                : 'text-[#888888] hover:text-[#051C2C]'
            }`}
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span>Settings</span>
            {activeTab === 'settings' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
            )}
          </button>

          {/* 3. Employee Master */}
          <button
            onClick={() => setActiveTab('employee_master')}
            className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'employee_master'
                ? 'text-[#2251FF] font-semibold'
                : 'text-[#888888] hover:text-[#051C2C]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Employees</span>
            {activeTab === 'employee_master' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
            )}
          </button>

          {/* 4. Dept 1~7 Dropdown/Tabs */}
          <div className="relative h-full">
            <button
              onClick={() => setDeptMenuOpen(!deptMenuOpen)}
              onBlur={() => setTimeout(() => setDeptMenuOpen(false), 200)}
              className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isDeptActive
                  ? 'text-[#2251FF] font-semibold'
                  : 'text-[#888888] hover:text-[#051C2C]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{isDeptActive && activeDeptMeta ? activeDeptMeta.shortName : 'Depts (1~7)'}</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
              {isDeptActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
              )}
            </button>

            {deptMenuOpen && (
              <div className="absolute top-[52px] left-0 w-60 bg-white border border-[#E8E8E6] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[10px] font-semibold text-[#888888] uppercase tracking-wider">
                  Select Department (Sheet)
                </div>
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      setActiveTab(dept.id as NavigationTab);
                      setDeptMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#F5F5F2] transition-colors ${
                      activeTab === dept.id ? 'text-[#2251FF] font-semibold bg-[#2251FF]/5' : 'text-[#051C2C]'
                    }`}
                  >
                    <span className="truncate">{dept.shortName}: {dept.name}</span>
                    <span className="text-[10px] text-[#888888] font-mono px-1.5 py-0.5 rounded bg-gray-100">
                      {dept.deptCode}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Payroll Summary */}
          <button
            onClick={() => setActiveTab('payroll_summary')}
            className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'payroll_summary'
                ? 'text-[#2251FF] font-semibold'
                : 'text-[#888888] hover:text-[#051C2C]'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>Payroll Summary</span>
            {activeTab === 'payroll_summary' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
            )}
          </button>

          {/* 6. Annual Hours Tracker */}
          <button
            onClick={() => setActiveTab('annual_hours_tracker')}
            className={`relative h-full px-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'annual_hours_tracker'
                ? 'text-[#2251FF] font-semibold'
                : 'text-[#888888] hover:text-[#051C2C]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hours Tracker</span>
            {activeTab === 'annual_hours_tracker' && (
              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2251FF] rounded-t-full" />
            )}
          </button>
        </nav>

        {/* Far Right: Utility Buttons (Backup Export/Import, CSV, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onExportBackup}
            title="Export full JSON backup"
            className="px-2.5 py-1.5 text-xs font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-md flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#2251FF]" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={onOpenImportBackup}
            title="Import JSON backup"
            className="px-2.5 py-1.5 text-xs font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-md flex items-center gap-1 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
            <span className="hidden sm:inline">Import</span>
          </button>

          <button
            onClick={onOpenBulkCsv}
            title="Bulk CSV Import"
            className="px-2.5 py-1.5 text-xs font-medium text-[#051C2C] bg-[#F5F5F2] hover:bg-[#E8E8E6] rounded-md flex items-center gap-1 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#00C853]" />
            <span className="hidden sm:inline">Bulk CSV</span>
          </button>

          <button
            onClick={onOpenResetModal}
            title="Reset data to defaults"
            className="p-1.5 text-xs text-[#888888] hover:text-[#D32F2F] hover:bg-red-50 rounded-md transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
