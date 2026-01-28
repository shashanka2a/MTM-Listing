'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ReviewScreen } from '@/components/screens/ReviewScreen';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useListings } from '@/contexts/ListingContext';

function ReviewPageContent() {
  const router = useRouter();
  const { isLoading, uploadedImages } = useListings();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to upload if no images (prevents showing review with mock data)
  useEffect(() => {
    if (mounted && !isLoading && uploadedImages.length === 0) {
      router.replace('/upload');
    }
  }, [mounted, isLoading, uploadedImages.length, router]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleApprove = (listing: any) => {
    // Navigate to export page after approval
    router.push('/export');
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    router.push('/upload');
  };

  const handleNavigate = (step: 'upload' | 'review' | 'export') => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    router.push(`/${step === 'upload' ? '' : step}`);
  };

  // Show loading while initializing
  if (isLoading || !mounted) {
    return (
      <div className="min-h-screen bg-[#faf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#800000]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#800000] rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading review...</p>
        </div>
      </div>
    );
  }

  return (
    <ReviewScreen 
      onApprove={handleApprove} 
      onBack={handleBack}
      onNavigate={handleNavigate}
      onUnsavedChange={setHasUnsavedChanges}
    />
  );
}

export default function ReviewPage() {
  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-[#faf8f6]">
        <ReviewPageContent />
      </div>
    </>
  );
}
