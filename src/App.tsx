import React, { useState, useEffect } from 'react';
import {
  SettingsConfig,
  Employee,
  DeptLogEntry,
  NavigationTab,
  AppDataBackup,
} from './types';
import {
  DEFAULT_SETTINGS,
  DEFAULT_EMPLOYEES,
  DEFAULT_DEPT_LOGS,
  DEPARTMENTS,
} from './data/defaultData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { SettingsView } from './components/SettingsView';
import { EmployeeMasterView } from './components/EmployeeMasterView';
import { DeptDataView } from './components/DeptDataView';
import { PayrollSummaryView } from './components/PayrollSummaryView';
import { AnnualHoursTrackerView } from './components/AnnualHoursTrackerView';
import { ImportBackupModal } from './components/ImportBackupModal';
import { BulkCsvImportModal } from './components/BulkCsvImportModal';
import { ResetModal } from './components/ResetModal';

const LOCAL_STORAGE_KEY = 'WORKFORCE_PAYROLL_APP_STATE_V1';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');

  // Application Core State
  const [settings, setSettings] = useState<SettingsConfig>(DEFAULT_SETTINGS);
  const [employees, setEmployees] = useState<Employee[]>(DEFAULT_EMPLOYEES);
  const [deptLogs, setDeptLogs] = useState<Record<string, DeptLogEntry[]>>(DEFAULT_DEPT_LOGS);
  const [lastSaved, setLastSaved] = useState<string>('');

  // Modals
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isBulkCsvModalOpen, setIsBulkCsvModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Initial Load from localStorage
  useEffect(() => {
    try {
      const savedStateStr = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateStr) {
        const parsed = JSON.parse(savedStateStr);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.employees && Array.isArray(parsed.employees)) setEmployees(parsed.employees);
        if (parsed.deptLogs && typeof parsed.deptLogs === 'object') setDeptLogs(parsed.deptLogs);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      } else {
        const nowStr = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setLastSaved(nowStr);
      }
    } catch (e) {
      console.error('Error restoring localStorage state:', e);
    }
  }, []);

  // 2. Auto-Save trigger on any state update
  const saveToLocalStorage = (
    updatedSettings: SettingsConfig,
    updatedEmployees: Employee[],
    updatedDeptLogs: Record<string, DeptLogEntry[]>
  ) => {
    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    const payload = {
      version: '1.0',
      lastSaved: timestamp,
      settings: updatedSettings,
      employees: updatedEmployees,
      deptLogs: updatedDeptLogs,
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
      setLastSaved(timestamp);
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  };

  // State Handlers
  const handleUpdateSettings = (newSettings: SettingsConfig) => {
    setSettings(newSettings);
    saveToLocalStorage(newSettings, employees, deptLogs);
    showToast('Settings saved successfully');
  };

  const handleAddEmployee = (newEmp: Employee) => {
    const updated = [...employees, newEmp];
    setEmployees(updated);
    saveToLocalStorage(settings, updated, deptLogs);
    showToast(`Employee ${newEmp.empName} added`);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    const updated = employees.map((e) => (e.empId === updatedEmp.empId ? updatedEmp : e));
    setEmployees(updated);
    saveToLocalStorage(settings, updated, deptLogs);
  };

  const handleDeleteEmployee = (empId: string) => {
    const updated = employees.filter((e) => e.empId !== empId);
    setEmployees(updated);
    saveToLocalStorage(settings, updated, deptLogs);
    showToast(`Employee ${empId} deleted`);
  };

  const handleAddLogEntry = (deptId: string, newEntry: DeptLogEntry) => {
    const currentList = deptLogs[deptId] || [];
    const updatedDeptLogs = {
      ...deptLogs,
      [deptId]: [newEntry, ...currentList],
    };
    setDeptLogs(updatedDeptLogs);
    saveToLocalStorage(settings, employees, updatedDeptLogs);
    showToast(`Log entry added for ${newEntry.empId}`);
  };

  const handleUpdateLogEntry = (deptId: string, updatedEntry: DeptLogEntry) => {
    const currentList = deptLogs[deptId] || [];
    const updatedList = currentList.map((entry) =>
      entry.id === updatedEntry.id ? updatedEntry : entry
    );
    const updatedDeptLogs = {
      ...deptLogs,
      [deptId]: updatedList,
    };
    setDeptLogs(updatedDeptLogs);
    saveToLocalStorage(settings, employees, updatedDeptLogs);
  };

  const handleDeleteLogEntry = (deptId: string, logId: string) => {
    const currentList = deptLogs[deptId] || [];
    const updatedList = currentList.filter((entry) => entry.id !== logId);
    const updatedDeptLogs = {
      ...deptLogs,
      [deptId]: updatedList,
    };
    setDeptLogs(updatedDeptLogs);
    saveToLocalStorage(settings, employees, updatedDeptLogs);
    showToast(`Log entry removed`);
  };

  // Export Backup JSON
  const handleExportBackup = () => {
    const backupData: AppDataBackup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      employees,
      deptLogs,
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payroll_workforce_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported successfully');
  };

  // Import Backup JSON
  const handleImportBackupSuccess = (backup: AppDataBackup) => {
    setSettings(backup.settings);
    setEmployees(backup.employees);
    setDeptLogs(backup.deptLogs);
    saveToLocalStorage(backup.settings, backup.employees, backup.deptLogs);
    showToast('Backup JSON imported successfully');
  };

  // Bulk CSV Imports
  const handleBulkImportEmployees = (newEmployees: Employee[]) => {
    // Append or update existing by empId
    const employeeMap = new Map<string, Employee>();
    employees.forEach((e) => employeeMap.set(e.empId.toLowerCase(), e));
    newEmployees.forEach((e) => employeeMap.set(e.empId.toLowerCase(), e));

    const updated = Array.from(employeeMap.values());
    setEmployees(updated);
    saveToLocalStorage(settings, updated, deptLogs);
    showToast(`Merged ${newEmployees.length} employee record(s) from CSV`);
  };

  const handleBulkImportDeptLogs = (deptId: string, newLogs: DeptLogEntry[]) => {
    const currentLogs = deptLogs[deptId] || [];
    const updatedDeptLogs = {
      ...deptLogs,
      [deptId]: [...newLogs, ...currentLogs],
    };
    setDeptLogs(updatedDeptLogs);
    saveToLocalStorage(settings, employees, updatedDeptLogs);
    showToast(`Imported ${newLogs.length} log entry(ies) into ${deptId}`);
  };

  // Reset to Factory Defaults
  const handleConfirmReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setSettings(DEFAULT_SETTINGS);
    setEmployees(DEFAULT_EMPLOYEES);
    setDeptLogs(DEFAULT_DEPT_LOGS);
    saveToLocalStorage(DEFAULT_SETTINGS, DEFAULT_EMPLOYEES, DEFAULT_DEPT_LOGS);
    showToast('All application data reset to initial defaults');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F2] text-[#051C2C] flex flex-col antialiased">
      {/* Top Sticky Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lastSaved={lastSaved}
        onExportBackup={handleExportBackup}
        onOpenImportBackup={() => setIsImportModalOpen(true)}
        onOpenBulkCsv={() => setIsBulkCsvModalOpen(true)}
        onOpenResetModal={() => setIsResetModalOpen(true)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#051C2C] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#00C853]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Area - Max 1400px centered, 40px left/right padding */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-10 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            allDeptLogs={deptLogs}
            employees={employees}
            settings={settings}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {activeTab === 'employee_master' && (
          <EmployeeMasterView
            employees={employees}
            settings={settings}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        )}

        {activeTab.startsWith('dept_') && (
          <DeptDataView
            deptId={activeTab}
            allDeptLogs={deptLogs}
            employees={employees}
            settings={settings}
            onSelectDeptTab={(dId) => setActiveTab(dId as NavigationTab)}
            onAddLogEntry={handleAddLogEntry}
            onUpdateLogEntry={handleUpdateLogEntry}
            onDeleteLogEntry={handleDeleteLogEntry}
          />
        )}

        {activeTab === 'payroll_summary' && (
          <PayrollSummaryView
            allDeptLogs={deptLogs}
            employees={employees}
            settings={settings}
          />
        )}

        {activeTab === 'annual_hours_tracker' && (
          <AnnualHoursTrackerView
            allDeptLogs={deptLogs}
            employees={employees}
            settings={settings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E8E6] bg-white py-4 text-center text-xs text-[#888888]">
        <div className="max-w-[1400px] mx-auto px-10 flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              Enterprise Payroll & Annual Workforce Capacity Planning Excel Toolkit &copy; {new Date().getFullYear()}
            </div>
            <div className="flex items-center gap-4">
              <span>Status: <strong className="text-[#00C853]">Auto-save Active</strong></span>
              <span>Frontend Engine: <strong className="text-[#051C2C]">React + TypeScript</strong></span>
            </div>
          </div>
          <div className="text-[11px] text-[#888888] pt-1 border-t border-gray-100 flex items-center justify-center gap-1.5">
            <span className="font-semibold text-[#051C2C]">Privacy & Data Security Notice:</span>
            <span>All data storage operates strictly within your browser's localStorage. The application itself does not retain or store any user data on external servers.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ImportBackupModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportBackupSuccess}
      />

      <BulkCsvImportModal
        isOpen={isBulkCsvModalOpen}
        onClose={() => setIsBulkCsvModalOpen(false)}
        onImportEmployees={handleBulkImportEmployees}
        onImportDeptLogs={handleBulkImportDeptLogs}
      />

      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirmReset={handleConfirmReset}
      />
    </div>
  );
}
