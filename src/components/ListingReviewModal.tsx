'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Package, Check, XCircle, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { TitleGenerator } from './listing/TitleGenerator';
import { ConditionGrading } from './listing/ConditionGrading';
import { ItemSpecifics } from './listing/ItemSpecifics';
import { DimensionsWeight } from './listing/DimensionsWeight';
import { Description } from './listing/Description';
import { useRole } from '../contexts/RoleContext';

interface ListingReviewModalProps {
  listing: any;
  onClose: () => void;
  onApprove: (listing: any) => void;
  onReject: () => void;
  onSave: (listing: any) => void;
  images?: string[];
  confidenceScore?: number;
}

export function ListingReviewModal({ 
  listing, 
  onClose, 
  onApprove, 
  onReject, 
  onSave,
  images = [],
  confidenceScore = 87
}: ListingReviewModalProps) {
  const { isAdmin, isVendor } = useRole();
  const [listingData, setListingData] = useState(listing);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const updateData = (key: string, value: any) => {
    setListingData({ ...listingData, [key]: value });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSave(listingData);
      setIsSaving(false);
    }, 500);
  };

  const handleApprove = () => {
    onApprove(listingData);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-8 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#800000]/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#800000]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {isAdmin ? 'Review Listing' : 'Submit Listing'}
              </h2>
              <p className="text-sm text-gray-600">SKU: {listingData.sku}</p>
            </div>
            <div className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              {confidenceScore}% AI Confidence
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content - Split view */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-full">
            {/* Left: Images */}
            <div className="bg-gray-50 p-6 border-r border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Images</h3>
              
              {images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`Product ${currentImageIndex + 1}`}
                      fill
                      className="object-contain"
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? 'border-[#800000] ring-2 ring-[#800000]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="p-6 overflow-auto">
              <div className="space-y-6 max-w-2xl">
                {/* Title */}
                <TitleGenerator 
                  title={listingData.title} 
                  onTitleChange={(title) => updateData('title', title)} 
                />

                {/* Condition */}
                <div className="border-t border-gray-200 pt-6">
                  <ConditionGrading 
                    condition={listingData.condition} 
                    onConditionChange={(condition) => updateData('condition', condition)} 
                  />
                </div>

                {/* Item Specifics */}
                <div className="border-t border-gray-200 pt-6">
                  <ItemSpecifics />
                </div>

                {/* Dimensions & Weight */}
                <div className="border-t border-gray-200 pt-6">
                  <DimensionsWeight />
                </div>

                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <Description />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onReject}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Draft
                </>
              )}
            </button>
            
            <button
              onClick={handleApprove}
              className="inline-flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-[#800000] rounded-md hover:bg-[#660000] transition-colors"
            >
              <Check className="w-4 h-4" />
              {isVendor ? 'Submit Listing' : 'Approve Listing'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
