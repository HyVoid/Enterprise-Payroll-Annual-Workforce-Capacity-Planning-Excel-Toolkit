import React, { useState } from 'react';
import { Employee, DeptLogEntry } from '../types';
import { DEPARTMENTS } from '../data/defaultData';
import { parseEmployeeCSV, parseDeptLogCSV } from '../utils/csv';
import { FileSpreadsheet, AlertCircle, CheckCircle2 } from 'lucide-react';

interface BulkCsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportEmployees: (newEmployees: Employee[]) => void;
  onImportDeptLogs: (deptId: string, newLogs: DeptLogEntry[]) => void;
}

export const BulkCsvImportModal: React.FC<BulkCsvImportModalProps> = ({
  isOpen,
  onClose,
  onImportEmployees,
  onImportDeptLogs,
}) => {
  const [importTarget, setImportTarget] = useState<'EMPLOYEES' | 'DEPT_LOGS'>('EMPLOYEES');
  const [selectedDeptId, setSelectedDeptId] = useState<string>('dept_1');
  const [fileText, setFileText] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number>(0);
  const [parsedEmployees, setParsedEmployees] = useState<Employee[]>([]);
  const [parsedLogs, setParsedLogs] = useState<DeptLogEntry[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setFileText(text);

        if (importTarget === 'EMPLOYEES') {
          const emps = parseEmployeeCSV(text);
          if (emps.length === 0) {
            throw new Error('No valid employee records found in CSV.');
          }
          setParsedEmployees(emps);
          setParsedCount(emps.length);
        } else {
          const logs = parseDeptLogCSV(text, selectedDeptId);
          if (logs.length === 0) {
            throw new Error('No valid department log entries found in CSV.');
          }
          setParsedLogs(logs);
          setParsedCount(logs.length);
        }
      } catch (err: any) {
        setErrorMsg(err.message || 'Error parsing CSV file.');
        setParsedCount(0);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmBulkImport = () => {
    if (importTarget === 'EMPLOYEES') {
      if (parsedEmployees.length > 0) {
        onImportEmployees(parsedEmployees);
      }
    } else {
      if (parsedLogs.length > 0) {
        onImportDeptLogs(selectedDeptId, parsedLogs);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="app-card w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#00C853]" />
            <h3 className="font-garamond text-xl font-bold text-[#051C2C]">
              Bulk CSV Data Import
            </h3>
          </div>
          <button onClick={onClose} className="text-xs text-[#888888] hover:text-[#051C2C] px-2 py-1">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Target Selector */}
          <div>
            <label className="block font-medium text-[#051C2C] mb-1">Select Import Destination Target</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setImportTarget('EMPLOYEES');
                  setParsedCount(0);
                  setFileName('');
                }}
                className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  importTarget === 'EMPLOYEES'
                    ? 'border-[#2251FF] bg-[#2251FF]/10 text-[#2251FF]'
                    : 'border-[#E8E8E6] text-[#888888] hover:text-[#051C2C]'
                }`}
              >
                Employee Master Directory
              </button>

              <button
                type="button"
                onClick={() => {
                  setImportTarget('DEPT_LOGS');
                  setParsedCount(0);
                  setFileName('');
                }}
                className={`p-2.5 rounded-lg border text-xs font-semibold transition-all ${
                  importTarget === 'DEPT_LOGS'
                    ? 'border-[#2251FF] bg-[#2251FF]/10 text-[#2251FF]'
                    : 'border-[#E8E8E6] text-[#888888] hover:text-[#051C2C]'
                }`}
              >
                Department Monthly Log
              </button>
            </div>
          </div>

          {/* Department selector if DEPT_LOGS target */}
          {importTarget === 'DEPT_LOGS' && (
            <div>
              <label className="block font-medium text-[#051C2C] mb-1">Destination Department</label>
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className="input-editable w-full font-medium"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.shortName}: {d.name} ({d.deptCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-[#E8E8E6] hover:border-[#00C853] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#F5F5F2]/50">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-file-input"
            />
            <label htmlFor="csv-file-input" className="cursor-pointer space-y-2 block">
              <FileSpreadsheet className="w-8 h-8 text-[#00C853] mx-auto" />
              <div className="font-semibold text-[#051C2C]">
                {fileName ? fileName : 'Click to select or drop CSV file'}
              </div>
              <div className="text-[11px] text-[#888888]">
                {importTarget === 'EMPLOYEES'
                  ? 'Headers: Emp_ID, Emp_Name, Dept_ID, Position, Hourly_Rate, Contract_Hours'
                  : 'Headers: Month, Emp_ID, Regular_Hours, OT_Hours, Allowances, Notes'}
              </div>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 text-[#D32F2F] text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {parsedCount > 0 && (
            <div className="p-3 rounded-lg bg-[#00C853]/10 text-[#051C2C] text-xs flex items-center gap-2 border border-[#00C853]/30">
              <CheckCircle2 className="w-4 h-4 text-[#00C853] shrink-0" />
              <span>
                Successfully parsed <strong className="text-[#00C853]">{parsedCount}</strong> record(s) ready to merge into {importTarget === 'EMPLOYEES' ? 'Employee Directory' : 'Department Logs'}.
              </span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E8E8E6] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#888888] hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={parsedCount === 0}
            onClick={handleConfirmBulkImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] disabled:opacity-40 rounded-md transition-colors"
          >
            Import {parsedCount > 0 ? `${parsedCount} Records` : 'CSV'}
          </button>
        </div>
      </div>
    </div>
  );
};
