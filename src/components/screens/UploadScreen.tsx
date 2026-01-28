'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, Image, Camera, Wand2, Trash2, Package, Home } from 'lucide-react';
import { Breadcrumbs } from '../Breadcrumbs';
import { useToast } from '../../contexts/ToastContext';
import { useListings } from '../../contexts/ListingContext';
import { Loader2 } from 'lucide-react';

interface UploadScreenProps {
  onComplete: () => void;
  onNavigate?: (step: 'upload' | 'review' | 'export') => void;
}

export function UploadScreen({ onComplete }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const toast = useToast();
  const { uploadedImages, addImages, removeImage, clearImages, isUploading, analyzeImages, isAnalyzing } = useListings();

  const validateFile = (file: File): string | null => {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      return `${file.name} is not a supported image format`;
    }
    if (file.size > maxSize) {
      return `${file.name} exceeds 50MB limit`;
    }
    return null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    processFiles(files);
  };

  const processFiles = async (files: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      await addImages(validFiles);
    }

    if (errors.length > 0) {
      toast.error('Upload errors', errors[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleProcess = async () => {
    if (uploadedImages.length === 0) {
      toast.warning('No photos uploaded', 'Please upload at least one photo');
      return;
    }

    // Get image URLs for AI analysis
    const imageUrls = uploadedImages.map(img => img.url);
    
    toast.info('Analyzing...', 'AI is examining your photos');
    
    // Analyze images with Gemini AI
    const analysis = await analyzeImages(imageUrls);
    
    if (analysis) {
      toast.success('Analysis complete', `Detected: ${analysis.brand || 'Unknown'} ${analysis.scale || ''} ${analysis.locomotiveType || 'item'}`);
    } else {
      toast.warning('Analysis limited', 'Could not fully analyze images, please fill in details manually');
    }
    
    onComplete();
  };

  const breadcrumbItems = [
    { label: 'Upload', href: '/upload', active: true },
    { label: 'Review', href: '/review', disabled: true },
    { label: 'Export', href: '/export', disabled: true }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#800000] rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </Link>
              <Breadcrumbs items={breadcrumbItems} showHome={true} />
            </div>
            <Link 
              href="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            Upload Product Photos
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upload multiple angles for best AI results: main view, detail shots, packaging, paperwork
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24">
        {/* Upload Area */}
        <div className="max-w-4xl mx-auto">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`bg-white rounded-lg border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
              isDragging
                ? 'border-[#800000] bg-[#800000]/5 scale-[1.02]'
                : 'border-gray-300 hover:border-[#800000]'
            }`}
          >
            <div className="flex justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                isDragging ? 'bg-[#800000]/10' : 'bg-[#faf8f6]'
              }`}>
                <Upload className={`w-10 h-10 transition-colors ${
                  isDragging ? 'text-[#800000]' : 'text-[#800000]'
                }`} />
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {isDragging ? 'Drop files here' : 'Drop photos here or click to browse'}
            </h2>
            <p className="text-gray-600 mb-6">
              Upload multiple angles: main view, detail shots, box, paperwork
            </p>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              aria-label="Upload product photos"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-md hover:bg-[#660000] font-medium cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[#800000] focus-within:ring-offset-2"
            >
              <Image className="w-5 h-5" />
              Select Photos
            </label>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                JPG, PNG, HEIC, WebP
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div>Max 50MB per file</div>
            </div>
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6 text-center">
              <Loader2 className="w-8 h-8 text-[#800000] animate-spin mx-auto mb-3" />
              <p className="text-gray-900 font-medium">Uploading to cloud...</p>
              <p className="text-gray-500 text-sm mt-1">Images are being optimized and stored securely</p>
            </div>
          )}

          {/* Uploaded Files Preview */}
          {uploadedImages.length > 0 && !isUploading && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Uploaded Photos ({uploadedImages.length})
                  {uploadedImages.some(img => img.publicId) && (
                    <span className="ml-2 text-xs font-normal text-green-600 bg-green-50 px-2 py-1 rounded">
                      ☁️ Cloud stored
                    </span>
                  )}
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={clearImages}
                    disabled={isUploading}
                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 font-medium transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                  <button
                    onClick={handleProcess}
                    disabled={isAnalyzing || isUploading}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#800000] text-white rounded-md hover:bg-[#660000] font-medium cursor-pointer transition-colors focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing with AI...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Process with AI
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((file, index) => (
                  <div key={file.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                        Photo {index + 1}
                      </div>
                      <button
                        onClick={() => removeImage(file.id)}
                        className="absolute top-2 right-2 bg-gray-500 text-white rounded-full p-1 hover:bg-gray-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Wand2,
                title: 'AI Vision Detection',
                description: 'Automatically identifies defects, features, and condition'
              },
              {
                icon: Image,
                title: 'Smart Recognition',
                description: 'Reads road numbers, logos, model numbers from photos'
              },
              {
                icon: Upload,
                title: 'Bulk Processing',
                description: 'Process 200+ items per day with automated workflows'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 bg-[#800000]/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-[#800000]" />
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
