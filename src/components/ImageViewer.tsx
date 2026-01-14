'use client';

import React, { useState } from 'react';
import { ZoomIn, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageViewerProps {
  showDetections: boolean;
  onToggleDetections: () => void;
}

const images = [
  { id: 1, url: 'https://images.unsplash.com/photo-1762015918614-2c9087a95e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHRyYWluJTIwbG9jb21vdGl2ZXxlbnwxfHx8fDE3Njg0MDA3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080', label: 'Main View' },
  { id: 2, url: 'https://images.unsplash.com/photo-1666537072126-a80174ee54d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbiUyMGRldGFpbCUyMGNsb3NldXB8ZW58MXx8fHwxNzY4NDAwNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080', label: 'Detail' },
  { id: 3, url: 'https://images.unsplash.com/photo-1650472738255-b48e9e59e05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHRyYWluJTIwYm94JTIwcGFja2FnaW5nfGVufDF8fHx8MTc2ODQwMDcyOHww&ixlib=rb-4.1.0&q=80&w=1080', label: 'Box' },
];

const detections = [
  { id: 1, type: 'defect', label: 'Minor wheel wear', x: 45, y: 65, severity: 'low' },
  { id: 2, type: 'feature', label: 'Road Number: 8595', x: 35, y: 40, severity: 'info' },
  { id: 3, type: 'feature', label: 'PRR Logo', x: 25, y: 35, severity: 'info' },
  { id: 4, type: 'condition', label: 'Box wear on corner', x: 70, y: 20, severity: 'medium' },
];

export function ImageViewer({ showDetections, onToggleDetections }: ImageViewerProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageChange = (image: typeof images[0]) => {
    setSelectedImage(image);
    setImageLoaded(false); // Reset when image changes
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Image Intelligence</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onToggleDetections}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {showDetections ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="hidden sm:inline">{showDetections ? 'Hide' : 'Show'}</span> Detections
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <ZoomIn className="w-4 h-4" />
            <span className="hidden sm:inline">Zoom</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Re-run</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewer */}
      <div className="relative bg-gray-50 rounded-lg mb-4 aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={selectedImage.url}
          alt={selectedImage.label}
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
        />
        
        {/* AI Detection Overlays - Only show after image loads */}
        {showDetections && imageLoaded && detections.map((detection) => (
          <div
            key={detection.id}
            className="absolute"
            style={{ left: `${detection.x}%`, top: `${detection.y}%` }}
          >
            <div className={`relative w-3 h-3 rounded-full ${
              detection.severity === 'low' ? 'bg-yellow-400' :
              detection.severity === 'medium' ? 'bg-orange-400' :
              'bg-blue-400'
            } animate-pulse`}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  detection.severity === 'low' ? 'bg-yellow-100 text-yellow-900' :
                  detection.severity === 'medium' ? 'bg-orange-100 text-orange-900' :
                  'bg-blue-100 text-blue-900'
                }`}>
                  {detection.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex gap-3">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => handleImageChange(image)}
            className={`relative flex-1 aspect-[4/3] rounded-md overflow-hidden border-2 transition-all ${
              selectedImage.id === image.id
                ? 'border-[#8b4513] ring-2 ring-[#8b4513] ring-opacity-30'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <ImageWithFallback
              src={image.url}
              alt={image.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
              <span className="text-white text-xs font-medium">{image.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}