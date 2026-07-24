import React, { useState } from 'react';
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
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  lastSaved: string;
  onExportBackup: () => void;
  onOpenImportBackup: () => void;
  onOpenBulkCsv: () => void;
  onOpenResetModal: () => void;
}

export const Navbar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  lastSaved,
  onExportBackup,
  onOpenImportBackup,
  onOpenBulkCsv,
  onOpenResetModal,
}) => {
  const isDeptActive = activeTab.startsWith('dept_');
  // State for Depts sub-menu collapse/expand (defaults to expanded if a dept is active)
  const [isDeptsExpanded, setIsDeptsExpanded] = useState<boolean>(true);
  // Mobile sidebar open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const activeDeptMeta = DEPARTMENTS.find((d) => d.id === activeTab);

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu after selection
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4 space-y-4 text-xs select-none">
      {/* Top Header Section: Title & Badge without Icon */}
      <div className="space-y-3 pb-4 border-b border-[#E8E8E6]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#2251FF]/10 text-[#2251FF]">
              SaaS Edition
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[#00C853] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C853] animate-pulse" />
              Auto-Save
            </span>
          </div>
          {/* Main Title - Pure Typography without Icon */}
          <h1 className="font-garamond text-lg font-bold text-[#051C2C] leading-snug tracking-tight">
            Enterprise Payroll & Annual Workforce Capacity Planning Excel Toolkit
          </h1>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#888888] bg-[#F5F5F2] px-2.5 py-1.5 rounded-lg border border-[#E8E8E6]">
          <Save className="w-3.5 h-3.5 text-[#00C853] shrink-0" />
          <span className="truncate">Saved: {lastSaved || 'Just now'}</span>
        </div>
      </div>

      {/* Navigation Links List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        <div className="px-2 py-1 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
          Core Modules
        </div>

        {/* 1. Dashboard */}
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C] hover:bg-gray-100'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
          <span className="text-xs">Dashboard</span>
        </button>

        {/* 2. Settings */}
        <button
          onClick={() => handleTabClick('settings')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C] hover:bg-gray-100'
          }`}
        >
          <SettingsIcon className={`w-4 h-4 ${activeTab === 'settings' ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
          <span className="text-xs">Settings</span>
        </button>

        {/* 3. Employees */}
        <button
          onClick={() => handleTabClick('employee_master')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'employee_master'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C] hover:bg-gray-100'
          }`}
        >
          <Users className={`w-4 h-4 ${activeTab === 'employee_master' ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
          <span className="text-xs">Employees</span>
        </button>

        {/* 4. Depts Accordion Sub-Menu */}
        <div className="space-y-1 pt-1">
          <button
            onClick={() => setIsDeptsExpanded(!isDeptsExpanded)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
              isDeptActive
                ? 'bg-[#2251FF]/10 text-[#2251FF] font-semibold'
                : 'text-[#051C2C] hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${isDeptActive ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
              <span className="text-xs">Depts</span>
            </div>
            <div className="flex items-center gap-1">
              {isDeptActive && (
                <span className="text-[10px] bg-[#2251FF] text-white font-bold px-1.5 py-0.2 rounded-full">
                  {activeDeptMeta?.deptCode}
                </span>
              )}
              {isDeptsExpanded ? (
                <ChevronDown className="w-3.5 h-3.5 text-[#888888]" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-[#888888]" />
              )}
            </div>
          </button>

          {/* Expanded Dept Sub-Items */}
          {isDeptsExpanded && (
            <div className="pl-3 space-y-1 border-l-2 border-[#E8E8E6] ml-4 my-1">
              {DEPARTMENTS.map((dept) => {
                const isThisDeptActive = activeTab === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => handleTabClick(dept.id as NavigationTab)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                      isThisDeptActive
                        ? 'bg-[#051C2C] text-white font-semibold shadow-2xs'
                        : 'text-[#051C2C] hover:bg-gray-100 hover:text-[#2251FF]'
                    }`}
                  >
                    <span className="truncate">{dept.shortName}: {dept.name}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ml-1 ${
                        isThisDeptActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-200/80 text-[#051C2C]'
                      }`}
                    >
                      {dept.deptCode}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Payroll Summary */}
        <button
          onClick={() => handleTabClick('payroll_summary')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'payroll_summary'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C] hover:bg-gray-100'
          }`}
        >
          <PieChart className={`w-4 h-4 ${activeTab === 'payroll_summary' ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
          <span className="text-xs">Payroll Summary</span>
        </button>

        {/* 6. Hours Tracker */}
        <button
          onClick={() => handleTabClick('annual_hours_tracker')}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition-all ${
            activeTab === 'annual_hours_tracker'
              ? 'bg-[#051C2C] text-white font-semibold shadow-xs'
              : 'text-[#051C2C] hover:bg-gray-100'
          }`}
        >
          <Clock className={`w-4 h-4 ${activeTab === 'annual_hours_tracker' ? 'text-[#2251FF]' : 'text-[#888888]'}`} />
          <span className="text-xs">Hours Tracker</span>
        </button>

        {/* Data Tools Section */}
        <div className="pt-4 pb-1">
          <div className="px-2 py-1 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
            Data & Backup
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-1">
            <button
              onClick={onExportBackup}
              className="px-2.5 py-2 rounded-lg bg-[#F5F5F2] hover:bg-[#E8E8E6] text-[#051C2C] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors border border-[#E8E8E6]"
            >
              <Download className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Export</span>
            </button>

            <button
              onClick={onOpenImportBackup}
              className="px-2.5 py-2 rounded-lg bg-[#F5F5F2] hover:bg-[#E8E8E6] text-[#051C2C] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors border border-[#E8E8E6]"
            >
              <Upload className="w-3.5 h-3.5 text-[#2251FF]" />
              <span>Import</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-1.5">
            <button
              onClick={onOpenBulkCsv}
              className="px-2.5 py-2 rounded-lg bg-[#F5F5F2] hover:bg-[#E8E8E6] text-[#051C2C] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors border border-[#E8E8E6]"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#00C853]" />
              <span>Bulk CSV</span>
            </button>

            <button
              onClick={onOpenResetModal}
              className="px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-[#D32F2F] font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors border border-red-200"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D32F2F]" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Privacy Statement */}
      <div className="pt-3 border-t border-[#E8E8E6] space-y-1 text-[10px] text-[#888888]">
        <div className="flex items-center gap-1 font-semibold text-[#051C2C]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2251FF]" />
          <span>Privacy & Security Notice</span>
        </div>
        <p className="leading-tight text-[10px] opacity-90">
          All data storage operates strictly within your browser's localStorage. The application itself does not retain or store any user data on external servers.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Permanent Sidebar (1024px and up) */}
      <aside className="hidden lg:block w-72 h-screen sticky top-0 bg-white border-r border-[#E8E8E6] shrink-0 z-30 shadow-xs">
        {navContent}
      </aside>

      {/* Mobile Top Header with Hamburger */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-[#E8E8E6] px-4 py-3 flex items-center justify-between shadow-xs">
        <div>
          <h1 className="font-garamond text-sm font-bold text-[#051C2C] leading-tight">
            Enterprise Payroll & Capacity Planning
          </h1>
          <p className="text-[10px] text-[#888888]">Excel Toolkit SaaS</p>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-[#F5F5F2] hover:bg-[#E8E8E6] text-[#051C2C] transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#051C2C]/50 backdrop-blur-xs flex">
          <div className="w-80 max-w-[85vw] bg-white h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
        </div>
      )}
    </>
  );
};
