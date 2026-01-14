'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
  index?: number;
}

export function Toast({ id, title, message, type, onClose, duration = 5000, index = 0 }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle2,
      className: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900'
    },
    error: {
      icon: XCircle,
      className: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900'
    },
    warning: {
      icon: AlertCircle,
      className: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900'
    },
    info: {
      icon: Info,
      className: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900'
    }
  };

  const { icon: Icon, className, iconColor, titleColor } = config[type];

  return (
    <div 
      className={`max-w-sm w-full bg-white border rounded-lg shadow-lg p-4 transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${className}`}
      style={{ marginBottom: index > 0 ? '12px' : '0' }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${titleColor}`}>{title}</p>
          {message && (
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          )}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(onClose, 300);
          }}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Container for multiple toasts
interface ToastContainerProps {
  toasts: Array<{ id: string; title: string; message?: string; type: ToastType }>;
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 flex flex-col-reverse items-end gap-3 max-w-sm">
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.title}
          message={toast.message}
          type={toast.type}
          onClose={() => onDismiss(toast.id)}
          index={index}
        />
      ))}
    </div>
  );
}

// Legacy hook for backward compatibility
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  const showToast = (message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainerLegacy = () => (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          title={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );

  return { showToast, ToastContainer: ToastContainerLegacy };
}