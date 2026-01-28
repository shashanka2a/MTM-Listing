'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { ListingProvider } from '@/contexts/ListingContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ListingProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ListingProvider>
    </AuthProvider>
  );
}
