'use client';

import React from 'react';
import { Shield, User } from 'lucide-react';
import { useRole, Role } from '../contexts/RoleContext';

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const roles: { value: Role; label: string; icon: React.ComponentType<any> }[] = [
    { value: 'vendor', label: 'Vendor', icon: User },
    { value: 'admin', label: 'Administrator', icon: Shield },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2 bg-white border border-gray-200 rounded-lg p-0.5 sm:p-1">
      {roles.map((roleOption) => {
        const Icon = roleOption.icon;
        const isActive = role === roleOption.value;
        
        return (
          <button
            key={roleOption.value}
            onClick={() => setRole(roleOption.value)}
            className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              isActive
                ? 'bg-[#800000] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hidden xs:inline">{roleOption.label}</span>
          </button>
        );
      })}
    </div>
  );
}