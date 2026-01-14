import React from 'react';
import { ChevronRight } from 'lucide-react';
import { RoleSwitcher } from './RoleSwitcher';
import { useRole } from '../contexts/RoleContext';

interface HeaderProps {
  status: 'processing' | 'review' | 'approved' | 'pending' | 'exported';
  confidenceScore: number;
  showRoleSwitcher?: boolean;
}

export function Header({ status, confidenceScore, showRoleSwitcher = false }: HeaderProps) {
  const { isVendor } = useRole();

  const statusConfig = {
    processing: { label: 'AI Processing', color: 'bg-blue-100 text-blue-800' },
    review: { label: 'Needs Review', color: 'bg-amber-100 text-amber-800' },
    approved: { label: 'Ready for Export', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending Admin Review', color: 'bg-purple-100 text-purple-800' },
    exported: { label: 'Exported', color: 'bg-gray-100 text-gray-800' }
  };

  const currentStatus = statusConfig[status];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 gap-4">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto pb-1 flex-shrink min-w-0">
            <span className="hover:text-gray-900 cursor-pointer whitespace-nowrap">Home</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="hover:text-gray-900 cursor-pointer whitespace-nowrap">Upload</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="font-medium text-gray-900 whitespace-nowrap">Review</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="text-gray-400 whitespace-nowrap">Export</span>
          </div>
          {showRoleSwitcher && (
            <div className="flex-shrink-0">
              <RoleSwitcher />
            </div>
          )}
        </div>

        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Listing Onboarding
              {isVendor && <span className="text-gray-500 ml-2 text-base">(Vendor)</span>}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
              <div className="px-2.5 py-1 bg-gray-100 rounded-md">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {confidenceScore}%
                </span>
              </div>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs sm:text-sm text-gray-500">SKU Auto-Generated</div>
            <div className="text-base sm:text-lg font-mono font-semibold text-gray-900">MTM-000768</div>
          </div>
        </div>
      </div>
    </header>
  );
}