'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-[#800000]/10 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-[#800000]/20 rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-bold text-[#800000]">404</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#600000] font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular pages:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/upload"
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#800000] hover:bg-[#800000]/5 rounded-lg transition-colors"
            >
              Upload Photos
            </Link>
            <Link
              href="/review"
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#800000] hover:bg-[#800000]/5 rounded-lg transition-colors"
            >
              Review Listings
            </Link>
            <Link
              href="/export"
              className="px-4 py-2 text-sm text-gray-600 hover:text-[#800000] hover:bg-[#800000]/5 rounded-lg transition-colors"
            >
              Export Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
