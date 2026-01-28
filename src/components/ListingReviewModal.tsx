'use client';

import React, { useState } from 'react';
import { X, Package, Check, XCircle, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { TitleGenerator } from './listing/TitleGenerator';
import { ConditionGrading } from './listing/ConditionGrading';
import { ItemSpecifics } from './listing/ItemSpecifics';
import { DimensionsWeight } from './listing/DimensionsWeight';
import { Description } from './listing/Description';

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
    <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full my-2 sm:my-8 max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10 gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#800000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#800000]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Review Listing
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">SKU: {listingData.sku}</p>
            </div>
            <div className="hidden sm:block ml-4 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
              {confidenceScore}% AI Confidence
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content - Split view */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-2 min-h-full">
            {/* Left: Images */}
            <div className="bg-gray-50 p-3 sm:p-6 lg:border-r border-b lg:border-b-0 border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 sm:mb-4">Product Images</h3>
              
              {images.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {/* Main Image */}
                  <div className="relative aspect-[4/3] sm:aspect-square bg-white rounded-lg overflow-hidden border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[currentImageIndex]}
                      alt={`Product ${currentImageIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    
                    {/* Image Navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Strip */}
                  {images.length > 1 && (
                    <div className="flex sm:grid sm:grid-cols-4 gap-2 overflow-x-auto pb-1 sm:pb-0">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative flex-shrink-0 w-16 h-16 sm:w-auto sm:h-auto sm:aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentImageIndex
                              ? 'border-[#800000] ring-2 ring-[#800000]/20'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] sm:aspect-square bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images uploaded</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="p-3 sm:p-6 overflow-auto">
              <div className="space-y-4 sm:space-y-6 max-w-2xl">
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
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={onReject}
            className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors order-2 sm:order-1"
          >
            <XCircle className="w-4 h-4" />
            <span>Reject</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3 order-1 sm:order-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Draft</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleApprove}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 text-sm font-medium text-white bg-[#800000] rounded-md hover:bg-[#660000] transition-colors"
            >
              <Check className="w-4 h-4" />
              <span className="hidden sm:inline">Approve Listing</span>
              <span className="sm:hidden">Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
