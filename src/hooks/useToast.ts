import { useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((
    type: ToastMessage['type'],
    title: string,
    message: string,
    duration: number = 5000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastMessage = { id, type, title, message };
    
    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const success = useCallback((title: string, message: string = '') => {
    return showToast('success', title, message);
  }, [showToast]);

  const error = useCallback((title: string, message: string = '') => {
    return showToast('error', title, message);
  }, [showToast]);

  const warning = useCallback((title: string, message: string = '') => {
    return showToast('warning', title, message);
  }, [showToast]);

  const info = useCallback((title: string, message: string = '') => {
    return showToast('info', title, message);
  }, [showToast]);

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    success,
    error,
    warning,
    info,
    dismiss
  };
}
