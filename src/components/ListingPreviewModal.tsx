'use client';

import React from 'react';
import Image from 'next/image';
import { X, Package, Database, Ruler, Scale, ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingPreviewModalProps {
  listing: any;
  onClose: () => void;
  images?: string[];
}

// Comprehensive item specifics
const itemSpecifics = [
  { label: 'Brand', key: 'brand' },
  { label: 'Line', key: 'line', defaultValue: 'Executive Line' },
  { label: 'Scale', key: 'scale' },
  { label: 'Gauge', key: 'gauge', defaultValue: 'HO' },
  { label: 'Road Name', key: 'roadName', defaultValue: 'Pennsylvania' },
  { label: 'Road Number', key: 'roadNumber', defaultValue: '8595' },
  { label: 'Locomotive Type', key: 'locomotiveType', defaultValue: 'ALCO RS-3' },
  { label: 'Phase', key: 'phase', defaultValue: 'III' },
  { label: 'Control', key: 'dcc' },
  { label: 'Decoder Brand', key: 'decoderBrand', defaultValue: 'ESU LokSound V5' },
  { label: 'Coupler Type', key: 'couplerType', defaultValue: 'Knuckle' },
  { label: 'Lighting', key: 'lighting', defaultValue: 'Directional' },
  { label: 'Material', key: 'material', defaultValue: 'Plastic' },
  { label: 'Paint', key: 'paint', defaultValue: 'Factory' },
  { label: 'Packaging', key: 'packaging', defaultValue: 'Original Box' },
  { label: 'Paperwork', key: 'paperwork', defaultValue: 'Included' },
  { label: 'Wheel Wear', key: 'wheelWear', defaultValue: 'Minor' },
  { label: 'Running Condition', key: 'runningCondition', defaultValue: 'Tested, Runs Well' },
  { label: 'DCC Status', key: 'dccStatus', defaultValue: 'Dual Mode' },
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
                    {listing[spec.key] || spec.defaultValue || '—'}
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
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {listing.length || '6.75'} <span className="text-xs font-normal text-gray-600">in</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
                  <Database className="w-3 h-3" />
                  <span>Catalog</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Width</label>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {listing.width || '1.25'} <span className="text-xs font-normal text-gray-600">in</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  <Ruler className="w-3 h-3" />
                  <span>Scale</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Height</label>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {listing.height || '1.75'} <span className="text-xs font-normal text-gray-600">in</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                  <Ruler className="w-3 h-3" />
                  <span>Scale</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">
                <label className="block text-xs font-medium text-gray-500 mb-2">Weight</label>
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  {listing.weight?.replace(' oz', '') || '8.5'} <span className="text-xs font-normal text-gray-600">oz</span>
                </p>
                <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded">
                  <Scale className="w-3 h-3" />
                  <span>Estimated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Description</h3>
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-gray-700 leading-relaxed">
                {listing.description || 
                  'Bowser HO Scale Executive Line Pennsylvania Railroad (PRR) ALCO RS-3 Phase III diesel locomotive, road number 8595. Factory equipped with ESU LokSound V5 DCC decoder with premium sound. Features directional lighting, knuckle couplers, and fine detail. Tested and runs smoothly in both DC and DCC modes. Includes original packaging and documentation. Condition shows minor wheel wear consistent with light use. Paint is factory original with no touch-ups or modifications.'}
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