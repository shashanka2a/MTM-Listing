'use client';

import React from 'react';
import { X, Package, ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingPreviewModalProps {
  listing: any;
  onClose: () => void;
  images?: string[];
}

// Comprehensive item specifics (no hardcoded defaults – show only real data)
const itemSpecifics = [
  { label: 'Brand', key: 'brand' },
  { label: 'Line', key: 'line' },
  { label: 'Scale', key: 'scale' },
  { label: 'Gauge', key: 'gauge' },
  { label: 'Road Name', key: 'roadName' },
  { label: 'Road Number', key: 'roadNumber' },
  { label: 'Locomotive Type', key: 'locomotiveType' },
  { label: 'Phase', key: 'phase' },
  { label: 'Control', key: 'dcc' },
  { label: 'Decoder Brand', key: 'decoderBrand' },
  { label: 'Coupler Type', key: 'couplerType' },
  { label: 'Lighting', key: 'lighting' },
  { label: 'Material', key: 'material' },
  { label: 'Paint', key: 'paint' },
  { label: 'Packaging', key: 'packaging' },
  { label: 'Paperwork', key: 'paperwork' },
  { label: 'Wheel Wear', key: 'wheelWear' },
  { label: 'Running Condition', key: 'runningCondition' },
  { label: 'DCC Status', key: 'dccStatus' },
];

export function ListingPreviewModal({ listing, onClose, images }: ListingPreviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const nextImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images && images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full my-8 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#800000]/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-[#800000]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Listing Preview</h2>
              <p className="text-sm text-gray-600">SKU: {listing.sku}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              listing.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-purple-100 text-purple-800'
            }`}>
              {listing.status}
            </span>
            {listing.vendor && (
              <span className="text-sm text-gray-600">
                Vendor: <span className="font-medium">{listing.vendor}</span>
              </span>
            )}
          </div>

          {/* Product Images */}
          {images && images.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Images</h3>
              
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mb-4">
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
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Title</label>
            <p className="text-base text-gray-900">{listing.title}</p>
          </div>

          {/* Primary Details Grid */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Primary Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Condition</label>
                <p className="text-sm font-semibold text-gray-900">{listing.condition}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Scale</label>
                <p className="text-sm font-semibold text-gray-900">{listing.scale}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Brand</label>
                <p className="text-sm font-semibold text-gray-900">{listing.brand}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">DCC</label>
                <p className="text-sm font-semibold text-gray-900">{listing.dcc}</p>
              </div>
            </div>
          </div>

          {/* Item Specifics */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Item Specifics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {itemSpecifics.map((spec, index) => (
                <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">{spec.label}</span>
                  <span className="text-sm font-medium text-gray-900 text-right ml-2">
                    {listing[spec.key] || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Dimensions & Weight */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Dimensions & Weight</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Length</label>
                <p className="text-sm font-semibold text-gray-900">
                  {listing.length || '—'}{' '}
                  {listing.length && (
                    <span className="text-xs font-normal text-gray-600">in</span>
                  )}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Width</label>
                <p className="text-sm font-semibold text-gray-900">
                  {listing.width || '—'}{' '}
                  {listing.width && (
                    <span className="text-xs font-normal text-gray-600">in</span>
                  )}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Height</label>
                <p className="text-sm font-semibold text-gray-900">
                  {listing.height || '—'}{' '}
                  {listing.height && (
                    <span className="text-xs font-normal text-gray-600">in</span>
                  )}
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Weight</label>
                <p className="text-sm font-semibold text-gray-900">
                  {listing.weight?.replace(' oz', '') || '—'}{' '}
                  {listing.weight && (
                    <span className="text-xs font-normal text-gray-600">oz</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.description || 'No description provided yet.'}
              </p>
            </div>
          </div>

          {/* Additional Metadata */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">SKU</span>
                <span className="text-sm font-mono font-medium text-gray-900">{listing.sku}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">AI Confidence</span>
                <span className="text-sm font-medium text-gray-900">{listing.confidence || '87'}%</span>
              </div>
              {listing.createdAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Created</span>
                  <span className="text-sm font-medium text-gray-900">{listing.createdAt}</span>
                </div>
              )}
              {listing.processedAt && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Processed</span>
                  <span className="text-sm font-medium text-gray-900">{listing.processedAt}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          {listing.status === 'pending' && (
            <button className="px-6 py-2 text-sm font-medium text-white bg-[#800000] rounded-md hover:bg-[#660000]">
              Approve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}