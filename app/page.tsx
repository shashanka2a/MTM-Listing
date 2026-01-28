'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  FileEdit, 
  Download, 
  Package, 
  ArrowRight,
  Wand2,
  LogOut,
  User,
  Trash2
} from 'lucide-react';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useAuth } from '@/contexts/AuthContext';
import { useListings } from '@/contexts/ListingContext';

export default function Home() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const { listings, getStats, clearAllData, isLoading: listingsLoading } = useListings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
    }
  };

  // Show loading while checking auth or loading listings
  if (authLoading || listingsLoading || !mounted) {
    return (
      <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#800000]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#800000] rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-[#800000]/60 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
          <p className="text-gray-400 text-sm mt-1">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  const stats = getStats();

  // Get recent listings (last 4)
  const recentListings = [...listings]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 4);

  // Format relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const workflowSteps = [
    {
      icon: Upload,
      title: 'Upload Photos',
      description: 'Drag & drop product images',
      href: '/upload',
      color: 'bg-blue-500',
      step: 1
    },
    {
      icon: Wand2,
      title: 'AI Processing',
      description: 'Automatic detection & grading',
      href: '/upload',
      color: 'bg-purple-500',
      step: 2
    },
    {
      icon: FileEdit,
      title: 'Review & Approve',
      description: 'Verify AI suggestions',
      href: '/review',
      color: 'bg-amber-500',
      step: 3
    },
    {
      icon: Download,
      title: 'Export',
      description: 'SixBit CSV/XML export',
      href: '/export',
      color: 'bg-green-500',
      step: 4
    }
  ];

  const quickStats = [
    { 
      label: 'Total Listings', 
      value: stats.total.toString(), 
      change: stats.todayProcessed > 0 ? `+${stats.todayProcessed}` : '0', 
      trend: 'up' as const, 
      icon: Package 
    },
    { 
      label: 'Exported', 
      value: stats.exported.toString(), 
      change: '', 
      trend: 'up' as const, 
      icon: Download 
    },
  ];

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-[#faf8f6]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#800000] rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Model Train Market</h1>
                  <p className="text-xs text-gray-500">Listing Onboarding System</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {user && (
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{user.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="hidden sm:inline">Sign out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome back{user ? `, ${user.name}` : ''}!
            </h2>
            <p className="text-gray-600">
              Upload photos, process with AI, review listings, and export to SixBit.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#800000]" />
                    </div>
                    {stat.change && (
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        stat.trend === 'up' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link 
                href="/upload"
                className="group relative overflow-hidden bg-gradient-to-br from-[#800000] to-[#600000] rounded-xl p-6 text-white hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <Upload className="w-8 h-8 mb-4" />
                <h4 className="text-lg font-semibold mb-2">Start New Upload</h4>
                <p className="text-white/80 text-sm mb-4">
                  Upload product photos for AI processing
                </p>
                <div className="flex items-center text-sm font-medium">
                  Get started <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link 
                href="/export"
                className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#800000] hover:shadow-lg transition-all"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2" />
                <Download className="w-8 h-8 mb-4 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Export Queue</h4>
                <p className="text-gray-600 text-sm mb-4">
                  {stats.total > 0 ? `${stats.total} in export workflow` : 'No listings yet'}
                </p>
                <div className="flex items-center text-sm font-medium text-[#800000]">
                  View queue <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>

          {/* Workflow Steps */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Workflow</h3>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="relative">
                      {index < workflowSteps.length - 1 && (
                        <div className="hidden sm:block absolute top-8 left-[60%] w-full h-0.5 bg-gray-200" />
                      )}
                      <Link href={step.href} className="relative z-10 flex flex-col items-center text-center group">
                        <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400 mb-1">Step {step.step}</span>
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <div className="flex items-center gap-4">
                {stats.total > 0 && (
                  <button
                    onClick={handleClearData}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                )}
                <Link href="/export" className="text-sm text-[#800000] hover:underline font-medium">
                  View all
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
              {recentListings.length === 0 ? (
                <div className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No listings yet. Start by uploading some photos!</p>
                  <Link 
                    href="/upload"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#600000] transition-colors text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photos
                  </Link>
                </div>
              ) : (
                recentListings.map((item, index) => (
                  <div key={item.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-[#800000]">{item.sku}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            item.status === 'approved' 
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'exported'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 truncate">{item.title}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {getRelativeTime(item.updatedAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Browser Storage Notice */}
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> All data is stored locally in your browser. Data will persist across sessions but will be lost if you clear your browser data.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                Model Train Market - Listing Onboarding System v2.0
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span>Built for high-volume processing</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Browser Storage Mode</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <PWAInstallPrompt />
    </>
  );
}
