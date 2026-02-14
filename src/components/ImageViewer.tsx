'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { ZoomIn, Eye, EyeOff, RefreshCw, X, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ListingImage, AIAnalysis } from '../contexts/ListingContext';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export interface Detection {
  id: number;
  type: 'defect' | 'feature' | 'condition';
  label: string;
  x: number;
  y: number;
  severity: 'low' | 'medium' | 'high' | 'info';
}

interface ImageViewerProps {
  showDetections: boolean;
  onToggleDetections: () => void;
  images?: ListingImage[];
  aiAnalysis?: AIAnalysis | null;
  onRerunAnalysis?: () => void;
}

// Default demo images if no images provided
const defaultImages = [
  { id: '1', url: 'https://images.unsplash.com/photo-1762015918614-2c9087a95e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHRyYWluJTIwbG9jb21vdGl2ZXxlbnwxfHx8fDE3Njg0MDA3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080', label: 'Main View' },
  { id: '2', url: 'https://images.unsplash.com/photo-1666537072126-a80174ee54d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFpbiUyMGRldGFpbCUyMGNsb3NldXB8ZW58MXx8fHwxNzY4NDAwNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080', label: 'Detail' },
  { id: '3', url: 'https://images.unsplash.com/photo-1650472738255-b48e9e59e05a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHRyYWluJTIwYm94JTIwcGFja2FnaW5nfGVufDF8fHx8MTc2ODQwMDcyOHww&ixlib=rb-4.1.0&q=80&w=1080', label: 'Box' },
];

// Spread defect markers across the image so each issue has its own spot and the popup sits above it
const DEFECT_POSITIONS: { x: number; y: number }[] = [
  { x: 22, y: 28 }, { x: 52, y: 22 }, { x: 78, y: 32 },
  { x: 18, y: 52 }, { x: 50, y: 48 }, { x: 82, y: 55 },
  { x: 28, y: 72 }, { x: 58, y: 68 }, { x: 75, y: 78 },
];

// Generate detections from AI analysis — issues (defects) only; each marker has popup on top
function generateDetectionsFromAI(analysis: AIAnalysis | null | undefined): Detection[] {
  if (!analysis?.defects?.length) return [];

  return analysis.defects.map((defect, index) => {
    const pos = DEFECT_POSITIONS[index % DEFECT_POSITIONS.length];
    return {
      id: index + 1,
      type: 'defect' as const,
      label: defect,
      x: pos.x,
      y: pos.y,
      severity: (index === 0 ? 'medium' : 'low') as 'low' | 'medium' | 'high' | 'info',
    };
  });
}

export function ImageViewer({ showDetections, onToggleDetections, images: propImages, aiAnalysis, onRerunAnalysis }: ImageViewerProps) {
  // Convert uploaded images to display format or use defaults
  const displayImages = propImages && propImages.length > 0 
    ? propImages.map((img, index) => ({
        id: img.id,
        url: img.url,
        label: img.name || `Photo ${index + 1}`
      }))
    : defaultImages;
  
  const [selectedImage, setSelectedImage] = useState(displayImages[0]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Generate detections from AI analysis
  const detections = useMemo(() => generateDetectionsFromAI(aiAnalysis), [aiAnalysis]);

  // Update selected image when images change
  React.useEffect(() => {
    if (displayImages.length > 0) {
      setSelectedImage(displayImages[0]);
    }
  }, [propImages]);

  const openZoom = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
    setZoomOpen(true);
  }, []);

  const closeZoom = useCallback(() => {
    setZoomOpen(false);
  }, []);

  const zoomIn = useCallback(() => {
    setZoomLevel((z) => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoomLevel((z) => Math.max(MIN_ZOOM, z - ZOOM_STEP));
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  }, [zoomIn, zoomOut]);

  React.useEffect(() => {
    if (!zoomOpen || !zoomContainerRef.current) return;
    const el = zoomContainerRef.current;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [zoomOpen, handleWheel]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!zoomOpen) return;
    if (e.key === 'Escape') closeZoom();
    if (e.key === 'ArrowLeft') { e.preventDefault(); goPrev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goNext(); }
  }, [zoomOpen, closeZoom, goPrev, goNext]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageChange = (image: typeof displayImages[0]) => {
    setSelectedImage(image);
    setImageLoaded(false); // Reset when image changes
  };

  const currentIndex = displayImages.findIndex((img) => img.id === selectedImage.id);
  const canGoPrev = displayImages.length > 1;
  const canGoNext = displayImages.length > 1;
  const goPrev = useCallback(() => {
    if (!canGoPrev) return;
    const prevIndex = currentIndex <= 0 ? displayImages.length - 1 : currentIndex - 1;
    setSelectedImage(displayImages[prevIndex]);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [canGoPrev, currentIndex, displayImages]);
  const goNext = useCallback(() => {
    if (!canGoNext) return;
    const nextIndex = currentIndex >= displayImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(displayImages[nextIndex]);
    setZoomLevel(1);
    setPan({ x: 0, y: 0 });
  }, [canGoNext, currentIndex, displayImages]);

  const handleMainImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openZoom();
    }
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
            <span className="hidden sm:inline">{showDetections ? 'Hide' : 'Show'}</span> Issues
          </button>
          <button
            onClick={openZoom}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
            <span className="hidden sm:inline">Zoom</span>
          </button>
          <button 
            onClick={onRerunAnalysis}
            disabled={!onRerunAnalysis}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Re-run AI</span>
          </button>
        </div>
      </div>

      {/* Main Image Viewer — click to open zoom */}
      <div
        role="button"
        tabIndex={0}
        onClick={openZoom}
        onKeyDown={handleMainImageKeyDown}
        className="relative bg-gray-50 rounded-lg mb-4 aspect-[16/10] sm:aspect-[4/3] overflow-hidden cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-[#8b4513] focus:ring-inset"
      >
        <ImageWithFallback
          src={selectedImage.url}
          alt={selectedImage.label}
          className="w-full h-full object-contain"
          onLoad={handleImageLoad}
        />
        
        {/* AI Detection Overlays — issues only; popup on top of each marker */}
        {showDetections && imageLoaded && detections.map((detection) => (
          <div
            key={detection.id}
            className="absolute flex flex-col items-center"
            style={{ left: `${detection.x}%`, top: `${detection.y}%`, transform: 'translate(-50%, 0)' }}
          >
            {/* Popup directly above the marker */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap z-10">
              <div className={`px-2 py-1 rounded text-xs font-medium shadow-sm ${
                detection.severity === 'low' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                detection.severity === 'medium' ? 'bg-orange-100 text-orange-900 border border-orange-200' :
                'bg-red-100 text-red-900 border border-red-200'
              }`}>
                {detection.label}
              </div>
            </div>
            {/* Marker dot under the popup */}
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
              detection.severity === 'low' ? 'bg-amber-500' :
              detection.severity === 'medium' ? 'bg-orange-500' :
              'bg-red-500'
            } animate-pulse ring-2 ring-white shadow`} />
          </div>
        ))}
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1">
        {displayImages.map((image) => (
          <button
            key={image.id}
            onClick={() => handleImageChange(image)}
            className={`relative flex-shrink-0 w-20 sm:w-auto sm:flex-1 aspect-[4/3] rounded-md overflow-hidden border-2 transition-all ${
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
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1 sm:p-2">
              <span className="text-white text-[10px] sm:text-xs font-medium">{image.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Zoom lightbox */}
      {zoomOpen && (
        <div
          ref={zoomContainerRef}
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          style={{ touchAction: 'none' }}
        >
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent z-10">
            <span className="text-white text-sm font-medium truncate mr-4">{selectedImage.label}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={zoomOut}
                disabled={zoomLevel <= MIN_ZOOM}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-white text-sm tabular-nums min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={zoomLevel >= MAX_ZOOM}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={resetZoom}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Reset zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={closeZoom}
                className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center overflow-auto min-h-0 p-4 relative">
            {/* Left / Right navigation when multiple photos */}
            {canGoPrev && (
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                title="Previous photo"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {canGoNext && (
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                title="Next photo"
                aria-label="Next photo"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
            <div
              className="flex-shrink-0 transition-transform duration-150 origin-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
              }}
            >
              <ImageWithFallback
                src={selectedImage.url}
                alt={selectedImage.label}
                className="max-w-none object-contain select-none"
                style={{ maxHeight: 'calc(100vh - 6rem)' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}