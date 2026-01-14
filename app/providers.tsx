'use client';

import { RoleProvider } from '@/contexts/RoleContext';
import { ToastProvider } from '@/contexts/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </RoleProvider>
  );
}
