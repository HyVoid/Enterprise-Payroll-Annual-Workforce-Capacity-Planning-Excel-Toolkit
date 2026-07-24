import React from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface ResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmReset: () => void;
}

export const ResetModal: React.FC<ResetModalProps> = ({ isOpen, onClose, onConfirmReset }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#051C2C]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="app-card w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 border-t-4 border-[#D32F2F]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-[#D32F2F] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-garamond text-xl font-bold text-[#051C2C]">
              Reset Application Data?
            </h3>
            <p className="text-xs text-[#888888]">This action cannot be undone.</p>
          </div>
        </div>

        <p className="text-xs text-[#051C2C]/80 leading-relaxed bg-[#F5F5F2] p-3 rounded-lg border border-[#E8E8E6]">
          Are you sure you want to restore the application to initial factory sample data? This will clear any custom employees, department logs, and settings stored in your browser's <span className="font-mono font-semibold text-[#051C2C]">localStorage</span>.
        </p>

        <div className="pt-3 border-t border-[#E8E8E6] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#888888] hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmReset();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#D32F2F] hover:bg-red-700 rounded-md shadow-xs transition-colors"
          >
            Yes, Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
