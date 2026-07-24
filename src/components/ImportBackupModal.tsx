import React, { useState } from 'react';
import { AppDataBackup } from '../types';
import { Upload, AlertCircle, FileJson, CheckCircle2 } from 'lucide-react';

interface ImportBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (backup: AppDataBackup) => void;
}

export const ImportBackupModal: React.FC<ImportBackupModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [parsedBackup, setParsedBackup] = useState<AppDataBackup | null>(null);
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
        const data = JSON.parse(text);

        if (!data.settings || !data.employees || !data.deptLogs) {
          throw new Error('Invalid backup schema: missing settings, employees, or deptLogs.');
        }

        setFileContent(text);
        setParsedBackup(data);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to parse JSON file.');
        setParsedBackup(null);
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!parsedBackup) return;
    onImportSuccess(parsedBackup);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="app-card w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E6]">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#2251FF]" />
            <h3 className="font-garamond text-xl font-bold text-[#051C2C]">
              Import JSON Data Backup
            </h3>
          </div>
          <button onClick={onClose} className="text-xs text-[#888888] hover:text-[#051C2C] px-2 py-1">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <p className="text-[#888888]">
            Select a valid <span className="font-mono text-[#051C2C]">.json</span> backup file exported from this application to restore settings, employee directory, and department logs.
          </p>

          <div className="border-2 border-dashed border-[#E8E8E6] hover:border-[#2251FF] rounded-xl p-6 text-center cursor-pointer transition-colors bg-[#F5F5F2]/50">
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
              id="json-file-input"
            />
            <label htmlFor="json-file-input" className="cursor-pointer space-y-2 block">
              <FileJson className="w-8 h-8 text-[#2251FF] mx-auto" />
              <div className="font-semibold text-[#051C2C]">
                {fileName ? fileName : 'Click to browse or drop JSON file here'}
              </div>
              <div className="text-[11px] text-[#888888]">JSON backup files only</div>
            </label>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 text-[#D32F2F] text-xs flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {parsedBackup && (
            <div className="p-3 rounded-lg bg-[#00C853]/10 text-[#051C2C] text-xs space-y-1.5 border border-[#00C853]/30">
              <div className="flex items-center gap-1.5 font-bold text-[#00C853]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Backup Schema Validated</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-[#051C2C]/80">
                <div>Employees: <span className="font-semibold">{parsedBackup.employees.length}</span></div>
                <div>Exported At: <span className="font-semibold">{parsedBackup.exportedAt || 'Unknown'}</span></div>
                <div>Dept Logs: <span className="font-semibold">{Object.values(parsedBackup.deptLogs).reduce((s: number, l: any) => s + (Array.isArray(l) ? l.length : 0), 0)}</span></div>
                <div>Currency: <span className="font-semibold">{parsedBackup.settings.currency}</span></div>
              </div>
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
            disabled={!parsedBackup}
            onClick={handleConfirmImport}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#051C2C] hover:bg-[#2251FF] disabled:opacity-40 rounded-md transition-colors"
          >
            Restore Backup
          </button>
        </div>
      </div>
    </div>
  );
};
