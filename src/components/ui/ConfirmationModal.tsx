'use client';

import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-gray-800 rounded-xl border border-gray-700 shadow-2xl w-full max-w-md transform transition-all scale-100 opacity-100"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white flex items-center">
            {isDangerous && <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />}
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-gray-300">{message}</p>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 bg-gray-800/50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`
              px-4 py-2 rounded-lg text-white font-bold transition-colors
              ${isDangerous 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-primary hover:bg-orange-600'}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
