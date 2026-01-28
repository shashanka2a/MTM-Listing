'use client';

import React, { useState } from 'react';
import { Check, X, Save } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { LoadingButton } from './LoadingButton';

interface ActionBarProps {
  onApprove: () => void;
  onReject: () => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
  isProcessing?: boolean;
}

export function ActionBar({ 
  onApprove, 
  onReject, 
  onSaveDraft,
  isSaving = false,
  isProcessing = false
}: ActionBarProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    onReject();
  };

  return (
    <>
      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <LoadingButton
              onClick={onApprove}
              loading={isProcessing}
              icon={Check}
              variant="primary"
              size="lg"
            >
              <span className="hidden sm:inline">Approve</span> Listing
            </LoadingButton>

            <div className="flex items-center gap-2 sm:gap-3">
              <LoadingButton
                onClick={onSaveDraft}
                loading={isSaving}
                icon={Save}
                variant="secondary"
                size="md"
              >
                <span className="hidden sm:inline">Save</span> Draft
              </LoadingButton>
              <LoadingButton
                onClick={handleReject}
                icon={X}
                variant="danger"
                size="md"
              >
                Reject
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showRejectDialog}
        onClose={() => setShowRejectDialog(false)}
        onConfirm={confirmReject}
        title="Reject Listing?"
        message="Are you sure you want to reject this listing? This action will discard all current data and return you to the upload screen."
        confirmText="Reject"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  );
}