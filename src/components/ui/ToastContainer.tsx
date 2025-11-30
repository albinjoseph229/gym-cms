'use client';

import { Toast } from '@/context/ToastContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(onRemove, 300); // Wait for animation
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-gray-800 border-green-500/50',
    error: 'bg-gray-800 border-red-500/50',
    info: 'bg-gray-800 border-blue-500/50',
  };

  return (
    <div
      className={`
        pointer-events-auto
        flex items-center p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md
        transform transition-all duration-300 ease-in-out
        ${bgColors[toast.type]}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="mr-3">{icons[toast.type]}</div>
      <p className="text-white text-sm font-medium flex-1">{toast.message}</p>
      <button
        onClick={handleRemove}
        className="ml-3 text-gray-400 hover:text-white transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
