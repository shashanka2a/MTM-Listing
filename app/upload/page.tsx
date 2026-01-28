'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadScreen } from '@/components/screens/UploadScreen';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useListings } from '@/contexts/ListingContext';

export default function UploadPage() {
  const router = useRouter();
  const { isLoading } = useListings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleComplete = () => {
    // Navigate to review page after upload
    router.push('/review');
  };

  const handleNavigate = (step: 'upload' | 'review' | 'export') => {
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
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-[#faf8f6]">
        <UploadScreen 
          onComplete={handleComplete} 
          onNavigate={handleNavigate}
        />
      </div>
    </>
  );
}
