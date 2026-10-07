import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete Permanently',
  cancelLabel = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleDismiss = onCancel || onClose || (() => {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>

          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleDismiss}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm shadow-rose-600/30 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>{isLoading ? 'Deleting...' : confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
