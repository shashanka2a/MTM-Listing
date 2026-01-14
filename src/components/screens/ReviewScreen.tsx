'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { ImageViewer } from '../ImageViewer';
import { ListingForm } from '../ListingForm';
import { ActionBar } from '../ActionBar';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { ListingReviewModal } from '../ListingReviewModal';
import { useRole } from '../../contexts/RoleContext';
import { useToast } from '../../contexts/ToastContext';
import { Loader2 } from 'lucide-react';

// Mock images for demo
const mockImages = [
  'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
  'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80',
  'https://images.unsplash.com/photo-1581888227599-779811939961?w=800&q=80'
];

interface ReviewScreenProps {
  onApprove: (listing: any) => void;
  onBack: () => void;
  onNavigate?: (step: 'upload' | 'review' | 'export') => void;
  onUnsavedChange?: (hasChanges: boolean) => void;
}

export function ReviewScreen({ onApprove, onBack, onNavigate, onUnsavedChange }: ReviewScreenProps) {
  const { isAdmin, isVendor } = useRole();
  const toast = useToast();
  const [status, setStatus] = useState<'processing' | 'review' | 'approved' | 'pending'>('processing');
  const [showDetections, setShowDetections] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [listingData, setListingData] = useState({
    sku: 'MTM-000768',
    title: 'HO Bowser Executive 24688 PRR ALCO RS-3 Ph. III Diesel #8595 w/ DCC & Sound',
    condition: 7,
    brand: 'Bowser',
    scale: 'HO',
    dcc: 'DCC & Sound',
    weight: '8.5 oz'
  });
  const [originalData, setOriginalData] = useState(listingData);

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setStatus('review');
      // Auto-open modal when review is ready (only for admin)
      if (isAdmin) {
        setShowReviewModal(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [toast, isAdmin]);

  useEffect(() => {
    // Track unsaved changes - safely compare objects
    try {
      const hasChanges = JSON.stringify(listingData) !== JSON.stringify(originalData);
      onUnsavedChange?.(hasChanges);
    } catch (error) {
      // If JSON.stringify fails due to circular reference, skip comparison
      console.warn('Unable to track changes due to circular reference');
      onUnsavedChange?.(false);
    }
  }, [listingData, originalData, onUnsavedChange]);

  const handleSaveDraft = (updatedListing?: any) => {
    const dataToSave = updatedListing || listingData;
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      setIsSaving(false);
      setListingData(dataToSave);
      setOriginalData(dataToSave);
      onUnsavedChange?.(false);
    }, 1000);
  };

  const handleApprove = (updatedListing?: any) => {
    const dataToApprove = updatedListing || listingData;
    setIsProcessing(true);

    setTimeout(() => {
      if (isVendor) {
        // Vendor submits for review
        setStatus('pending');
        setListingData({ ...dataToApprove, status: 'pending' });
        toast.success('Listing Submitted', 'Your listing has been sent for admin approval');
        setShowReviewModal(false);
      } else {
        // Admin approves
        setStatus('approved');
        setListingData({ ...dataToApprove, status: 'approved' });
        toast.success('Listing Approved', 'Listing has been added to export queue');
        setShowReviewModal(false);
      }
      
      setIsProcessing(false);
      onUnsavedChange?.(false);
      
      setTimeout(() => {
        onApprove(dataToApprove);
      }, 500);
    }, 1000);
  };

  const handleReject = () => {
    setShowReviewModal(false);
    toast.warning('Listing Rejected', 'Returning to upload screen');
    onBack();
  };

  const handleExportToQueue = () => {
    setTimeout(() => onApprove(listingData), 500);
  };

  const shortcuts = [
    { key: 's', description: 'Save draft', action: handleSaveDraft },
    { key: 'a', description: isVendor ? 'Submit listing' : 'Approve listing', action: () => handleApprove() },
    { key: 'r', description: 'Reject listing', action: onBack },
    { key: 'd', description: 'Toggle detections', action: () => setShowDetections(!showDetections) },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <Header 
        status={status}
        confidenceScore={87}
        showRoleSwitcher={true}
      />

      {status === 'processing' ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Loader2 className="w-12 h-12 text-[#800000] animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              AI Processing Images...
            </h2>
            <p className="text-gray-600">
              Detecting features, condition, and generating listing data
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#800000] rounded-full animate-progress" style={{
                  animation: 'progress 2s ease-in-out forwards'
                }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <ImageViewer 
                showDetections={showDetections}
                onToggleDetections={() => setShowDetections(!showDetections)}
              />
              <ListingForm data={listingData} onChange={setListingData} />
            </div>
          </main>

          <ActionBar 
            onApprove={handleApprove}
            onReject={handleReject}
            onSaveDraft={handleSaveDraft}
            onExport={handleExportToQueue}
            isSaving={isSaving}
            isProcessing={isProcessing}
          />
          
          <KeyboardShortcuts shortcuts={shortcuts} />
        </>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {showReviewModal && (
        <ListingReviewModal
          listing={listingData}
          onClose={() => setShowReviewModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onSave={handleSaveDraft}
          images={mockImages}
          confidenceScore={87}
        />
      )}
    </div>
  );
}