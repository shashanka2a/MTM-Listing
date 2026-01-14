'use client';

import React, { useState } from 'react';
import { Check, X, Save, Download, Send } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';
import { ConfirmDialog } from './ConfirmDialog';
import { LoadingButton } from './LoadingButton';

interface ActionBarProps {
  onApprove: () => void;
  onReject: () => void;
  onSaveDraft: () => void;
  onExport: () => void;
  isSaving?: boolean;
  isProcessing?: boolean;
}

export function ActionBar({ 
  onApprove, 
  onReject, 
  onSaveDraft, 
  onExport,
  isSaving = false,
  isProcessing = false
}: ActionBarProps) {
  const { isAdmin, isVendor } = useRole();
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {isAdmin && (
                <>
                  <LoadingButton
                    onClick={onApprove}
                    loading={isProcessing}
                    icon={Check}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Approve Listing
                  </LoadingButton>
                  <LoadingButton
                    onClick={onExport}
                    icon={Download}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto bg-[#900000] hover:bg-[#700000]"
                  >
                    <span className="hidden sm:inline">Send to</span> Export Queue
                  </LoadingButton>
                </>
              )}

              {isVendor && (
                <>
                  <LoadingButton
                    onClick={onApprove}
                    loading={isProcessing}
                    icon={Send}
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    Submit Listing
                  </LoadingButton>
                  <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-xs sm:text-sm text-blue-800">
                      <strong>Note:</strong> Listing will be sent to admin for approval
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <LoadingButton
                onClick={onSaveDraft}
                loading={isSaving}
                icon={Save}
                variant="secondary"
                size="md"
                className="flex-1 sm:flex-none"
              >
                <span className="hidden sm:inline">Save</span> Draft
              </LoadingButton>
              <LoadingButton
                onClick={handleReject}
                icon={X}
                variant="danger"
                size="md"
                className="flex-1 sm:flex-none"
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