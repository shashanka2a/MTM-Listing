'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'vendor' | 'admin';

export type ListingStatus = 'draft' | 'pending' | 'approved' | 'exported';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isVendor: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('vendor');

  const value: RoleContextType = {
    role,
    setRole,
    isAdmin: role === 'admin',
    isVendor: role === 'vendor',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
