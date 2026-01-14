'use client';

import { useState, useEffect } from 'react';
import { UploadScreen } from '@/components/screens/UploadScreen';
import { ReviewScreen } from '@/components/screens/ReviewScreen';
import { ExportScreen } from '@/components/screens/ExportScreen';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/OfflineIndicator';
import { useRole } from '@/contexts/RoleContext';

type Step = 'upload' | 'review' | 'export';

export default function Home() {
  const { isAdmin } = useRole();
  const [currentStep, setCurrentStep] = useState<Step>(isAdmin ? 'export' : 'upload');
  const [listings, setListings] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Update initial step when role changes
  useEffect(() => {
    setCurrentStep(isAdmin ? 'export' : 'upload');
  }, [isAdmin]);

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

  const handleUploadComplete = () => {
    setCurrentStep('review');
    setHasUnsavedChanges(true);
  };

  const handleReviewApprove = (listing: any) => {
    setListings([...listings, listing]);
    setCurrentStep('export');
    setHasUnsavedChanges(false);
  };

  const handleNewUpload = () => {
    setCurrentStep('upload');
    setHasUnsavedChanges(false);
  };

  const handleNavigate = (step: Step) => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    setCurrentStep(step);
    setHasUnsavedChanges(false);
  };

  return (
    <>
      <OfflineIndicator />
      <div className="min-h-screen bg-[#faf8f6]">
        {currentStep === 'upload' && (
          <UploadScreen 
            onComplete={handleUploadComplete} 
            onNavigate={handleNavigate}
          />
        )}
        {currentStep === 'review' && (
          <ReviewScreen 
            onApprove={handleReviewApprove} 
            onBack={() => handleNavigate('upload')}
            onNavigate={handleNavigate}
            onUnsavedChange={(hasChanges) => setHasUnsavedChanges(hasChanges)}
          />
        )}
        {currentStep === 'export' && (
          <ExportScreen 
            listings={listings} 
            onNewUpload={handleNewUpload}
          />
        )}
      </div>
      <PWAInstallPrompt />
    </>
  );
}
