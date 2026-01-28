'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Home } from 'lucide-react';

interface HeaderProps {
  status: 'processing' | 'review' | 'approved' | 'pending' | 'exported';
  confidenceScore: number;
  showRoleSwitcher?: boolean;
}

export function Header({ status, confidenceScore }: HeaderProps) {
  const statusConfig = {
    processing: { label: 'AI Processing', color: 'bg-blue-100 text-blue-800' },
    review: { label: 'Needs Review', color: 'bg-amber-100 text-amber-800' },
    approved: { label: 'Ready for Export', color: 'bg-green-100 text-green-800' },
    pending: { label: 'Pending Review', color: 'bg-amber-100 text-amber-800' },
    exported: { label: 'Exported', color: 'bg-gray-100 text-gray-800' }
  };

  const currentStatus = statusConfig[status];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-2 sm:mb-3 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#800000]/20 bg-[#800000]/5 flex items-center justify-center">
                <Image
                  src="/favicon.ico"
                  alt="MTM Listings"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  priority
                />
              </div>
            </Link>
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto pb-1 flex-shrink min-w-0">
              <Link href="/" className="hover:text-gray-900 whitespace-nowrap">Home</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <Link href="/upload" className="hover:text-gray-900 whitespace-nowrap">Upload</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-[#800000] whitespace-nowrap">Review</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <Link href="/export" className="text-gray-400 hover:text-gray-600 whitespace-nowrap">Export</Link>
            </div>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>

        {/* Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Review Listing
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs sm:text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
              <div className="px-2.5 py-1 bg-gray-100 rounded-md">
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  {confidenceScore}% confidence
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