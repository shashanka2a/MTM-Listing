'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../Header';
import { ImageViewer } from '../ImageViewer';
import { ListingForm } from '../ListingForm';
import { ActionBar } from '../ActionBar';
import { KeyboardShortcuts } from '../KeyboardShortcuts';
import { useToast } from '../../contexts/ToastContext';
import { useListings, Listing, AIAnalysis } from '../../contexts/ListingContext';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';

interface ReviewScreenProps {
  onApprove: (listing: any) => void;
  onBack: () => void;
  onNavigate?: (step: 'upload' | 'review' | 'export') => void;
  onUnsavedChange?: (hasChanges: boolean) => void;
}

/** Road number = number only; strip 2–4 letter reporting mark (e.g. BN1574 → 1574). */
function normalizeRoadNumber(value: string | null | undefined): string {
  if (value == null || typeof value !== 'string') return '';
  const trimmed = value.trim();
  const withoutMark = trimmed.replace(/^[A-Za-z]{2,4}\s*/i, '').trim();
  return withoutMark || trimmed;
}

export function ReviewScreen({ onApprove, onBack, onUnsavedChange }: ReviewScreenProps) {
  const toast = useToast();
  const { 
    uploadedImages, 
    addListing, 
    generateSku, 
    clearImages,
    currentListing,
    setCurrentListing,
    lastAnalysis,
    isAnalyzing,
    analyzeImages
  } = useListings();
  
  const [status, setStatus] = useState<'processing' | 'review' | 'approved' | 'pending'>('processing');
  const [showDetections, setShowDetections] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Track if we've generated a SKU
  const [generatedSku, setGeneratedSku] = useState<string | null>(null);
  
  // Initialize listing data (will be updated with AI analysis if available)
  const [listingData, setListingData] = useState(() => ({
    sku: '', // Will be set after mount
    title: '',
    condition: 7,
    brand: '',
    scale: '',
    dcc: 'Unknown',
    weight: '',
    modelNumber: '',
    line: '',
    gauge: '',
    roadName: '',
    roadNumber: '',
    locomotiveType: '',
    phase: '',
    decoderBrand: '',
    couplerType: '',
    lighting: '',
    material: '',
    paint: '',
    packaging: '',
    paperwork: '',
    wheelWear: '',
    runningCondition: '',
    dccStatus: '',
    length: '',
    width: '',
    height: '',
    conditionNotes: '',
    description: '',
    features: [] as string[],
    defects: [] as string[],
  }));
  const [originalData, setOriginalData] = useState(listingData);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);

  // Generate SKU on mount
  useEffect(() => {
    const sku = generateSku();
    setGeneratedSku(sku);
    setListingData(prev => ({ ...prev, sku }));
    setOriginalData(prev => ({ ...prev, sku }));
  }, []);

  // Populate form with AI analysis results
  useEffect(() => {
    if (lastAnalysis) {
      // Map all AI analysis fields to form data
      const analysisData: Record<string, any> = {
        title: lastAnalysis.title || '',
        brand: lastAnalysis.brand || '',
        line: (lastAnalysis as any).line || '',
        scale: lastAnalysis.scale || '',
        gauge: lastAnalysis.gauge || lastAnalysis.scale || '',
        dcc: lastAnalysis.dcc || 'Unknown',
        decoderBrand: (lastAnalysis as any).decoderBrand || '',
        roadName: lastAnalysis.roadName || '',
        roadNumber: normalizeRoadNumber(lastAnalysis.roadNumber) || '',
        locomotiveType: lastAnalysis.locomotiveType || '',
        modelNumber: lastAnalysis.modelNumber || '',
        condition: lastAnalysis.condition || 7,
        conditionNotes: lastAnalysis.conditionNotes || '',
        packaging: lastAnalysis.packaging || '',
        paperwork: lastAnalysis.paperwork ? 'Included' : 'Not Included',
        wheelWear: (lastAnalysis as AIAnalysis).wheelWear || '',
        material: (lastAnalysis as any).material || '',
        couplerType: (lastAnalysis as any).couplerType || '',
        // Use AI-generated description if available
        description: (lastAnalysis as any).description || lastAnalysis.conditionNotes || '',
        features: Array.isArray(lastAnalysis.features) ? [...lastAnalysis.features] : [],
        defects: Array.isArray(lastAnalysis.defects) ? [...lastAnalysis.defects] : [],
      };

      setListingData(prev => ({
        ...prev,
        ...analysisData,
      }));
      setOriginalData(prev => ({
        ...prev,
        ...analysisData,
      }));
      setAiConfidence(lastAnalysis.confidence);
      setStatus('review');
    } else {
      // No AI analysis, go directly to review
      setStatus('review');
    }
  }, [lastAnalysis]);

  useEffect(() => {
    // Track unsaved changes - safely compare objects
    try {
      const hasChanges = JSON.stringify(listingData) !== JSON.stringify(originalData);
      onUnsavedChange?.(hasChanges);
    } catch (error) {
      console.warn('Unable to track changes due to circular reference');
      onUnsavedChange?.(false);
    }
  }, [listingData, originalData, onUnsavedChange]);

  const handleSaveDraft = (updatedListing?: any) => {
    const dataToSave = updatedListing || listingData;
    setIsSaving(true);
    
    // Save to context/localStorage
    setTimeout(() => {
      setIsSaving(false);
      setListingData(dataToSave);
      setOriginalData(dataToSave);
      onUnsavedChange?.(false);
      toast.success('Draft Saved', 'Your changes have been saved');
    }, 500);
  };

  const handleApprove = (updatedListing?: any) => {
    const dataToApprove = updatedListing || listingData;
    
    // Ensure we have a valid SKU
    const skuToUse = dataToApprove.sku || generatedSku || generateSku();

    // Derive running condition from numeric condition if not explicitly set:
    // - If condition (1–10) is >= 6 → "Runs well"
    // - Otherwise → "N/A"
    let runningCondition = dataToApprove.runningCondition;
    const numericCondition = Number(dataToApprove.condition);
    if (!runningCondition && Number.isFinite(numericCondition)) {
      runningCondition = numericCondition >= 6 ? 'Runs well' : 'N/A';
    }
    
    setIsProcessing(true);

    setTimeout(() => {
      // Create the listing in storage (including AI snapshot so export/preview can reuse it)
      const newListing = addListing({
        sku: skuToUse,
        title: dataToApprove.title,
        condition: dataToApprove.condition,
        brand: dataToApprove.brand,
        scale: dataToApprove.scale,
        dcc: dataToApprove.dcc,
        weight: dataToApprove.weight,
        status: 'approved',
        images: uploadedImages,
        line: dataToApprove.line,
        gauge: dataToApprove.gauge,
        roadName: dataToApprove.roadName,
        roadNumber: dataToApprove.roadNumber,
        locomotiveType: dataToApprove.locomotiveType,
        phase: dataToApprove.phase,
        decoderBrand: dataToApprove.decoderBrand,
        couplerType: dataToApprove.couplerType,
        lighting: dataToApprove.lighting,
        material: dataToApprove.material,
        paint: dataToApprove.paint,
        packaging: dataToApprove.packaging,
        paperwork: dataToApprove.paperwork,
        wheelWear: dataToApprove.wheelWear,
        runningCondition,
        dccStatus: dataToApprove.dccStatus,
        length: dataToApprove.length,
        width: dataToApprove.width,
        height: dataToApprove.height,
        description: dataToApprove.description,
        features: dataToApprove.features,
        defects: dataToApprove.defects,
        aiAnalysis: lastAnalysis,
        confidence: 87,
        approvedAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
      });

      // Clear uploaded images after adding to listing
      clearImages();
      
      setStatus('approved');
      toast.success('Listing Approved', 'Listing has been added to export queue');
      
      setIsProcessing(false);
      onUnsavedChange?.(false);
      
      setTimeout(() => {
        onApprove(newListing);
      }, 500);
    }, 1000);
  };

  const handleReject = () => {
    clearImages();
    toast.warning('Listing Rejected', 'Returning to upload screen');
    onBack();
  };

  // Re-run AI analysis on current images
  const handleRerunAnalysis = async () => {
    if (uploadedImages.length === 0) {
      toast.warning('No images', 'Upload images first to run AI analysis');
      return;
    }

    toast.info('Re-analyzing...', 'AI is examining your photos again');
    setStatus('processing');
    
    const imageUrls = uploadedImages.map(img => img.url);
    const analysis = await analyzeImages(imageUrls);
    
    if (analysis) {
      // Update form data with all AI analysis fields
      const newData = {
        ...listingData,
        title: analysis.title || listingData.title,
        brand: analysis.brand || listingData.brand,
        line: analysis.line || listingData.line,
        scale: analysis.scale || listingData.scale,
        gauge: analysis.gauge || analysis.scale || listingData.gauge,
        dcc: analysis.dcc || listingData.dcc,
        decoderBrand: analysis.decoderBrand || listingData.decoderBrand,
        roadName: analysis.roadName || listingData.roadName,
        roadNumber: normalizeRoadNumber(analysis.roadNumber) || listingData.roadNumber,
        locomotiveType: analysis.locomotiveType || listingData.locomotiveType,
        modelNumber: analysis.modelNumber || listingData.modelNumber,
        condition: analysis.condition || listingData.condition,
        conditionNotes: analysis.conditionNotes || listingData.conditionNotes,
        packaging: analysis.packaging || listingData.packaging,
        paperwork: analysis.paperwork ? 'Included' : 'Not Included',
        wheelWear: analysis.wheelWear || listingData.wheelWear,
        material: analysis.material || listingData.material,
        couplerType: analysis.couplerType || listingData.couplerType,
        description: analysis.description || listingData.description,
        features: Array.isArray(analysis.features) ? [...analysis.features] : listingData.features || [],
        defects: Array.isArray(analysis.defects) ? [...analysis.defects] : listingData.defects || [],
      };
      
      setListingData(newData);
      setAiConfidence(analysis.confidence);
      toast.success('Analysis complete', `Detected: ${analysis.brand || 'Unknown'} ${analysis.scale || ''} ${analysis.locomotiveType || ''}`);
    } else {
      toast.error('Analysis failed', 'Could not analyze images. Please try again.');
    }
    
    setStatus('review');
  };

  const shortcuts = [
    { key: 's', description: 'Save draft', action: handleSaveDraft },
    { key: 'a', description: 'Approve listing', action: () => handleApprove() },
    { key: 'r', description: 'Reject listing', action: handleReject },
    { key: 'd', description: 'Toggle detections', action: () => setShowDetections(!showDetections) },
  ];

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      <Header 
        status={status}
        confidenceScore={aiConfidence || 87}
        showRoleSwitcher={true}
      />

      {status === 'processing' || isAnalyzing ? (
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
          {/* AI Analysis Badge */}
          {lastAnalysis && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
              <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">AI Analysis Complete</span>
                    {aiConfidence !== null && (
                      <span className={`px-2 py-0.5 rounded text-sm font-medium ${
                        aiConfidence >= 80 ? 'bg-green-100 text-green-700' :
                        aiConfidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {aiConfidence}% confidence
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {lastAnalysis.brand && (
                      <span>Brand: <strong>{lastAnalysis.brand}</strong></span>
                    )}
                    {lastAnalysis.scale && (
                      <span>Scale: <strong>{lastAnalysis.scale}</strong></span>
                    )}
                    {lastAnalysis.estimatedValue && (
                      <span className="text-green-700 font-medium">
                        Est. Value: ${lastAnalysis.estimatedValue}
                      </span>
                    )}
                  </div>
                </div>
                {lastAnalysis.defects && lastAnalysis.defects.length > 0 && (
                  <div className="mt-2 flex items-start gap-2 text-sm text-amber-700">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Detected issues: {lastAnalysis.defects.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <ImageViewer 
                showDetections={showDetections}
                onToggleDetections={() => setShowDetections(!showDetections)}
                images={uploadedImages}
                aiAnalysis={lastAnalysis}
                onRerunAnalysis={handleRerunAnalysis}
              />
              <ListingForm 
                data={listingData} 
                onChange={setListingData}
                aiAnalysis={lastAnalysis}
                onRegenerate={handleRerunAnalysis}
              />
            </div>
          </main>

          <ActionBar 
            onApprove={handleApprove}
            onReject={handleReject}
            onSaveDraft={handleSaveDraft}
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

    </div>
  );
}
