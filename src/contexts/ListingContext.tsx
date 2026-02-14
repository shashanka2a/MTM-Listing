'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface ListingImage {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string; // Cloudinary URL (or base64 fallback)
  publicId?: string; // Cloudinary public ID for deletion
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface Listing {
  id: string;
  sku: string;
  title: string;
  condition: number;
  brand: string;
  scale: string;
  dcc: string;
  weight: string;
  status: 'pending' | 'approved' | 'exported';
  images: ListingImage[];
  vendor?: string;
  // Item specifics
  line?: string;
  gauge?: string;
  roadName?: string;
  roadNumber?: string;
  locomotiveType?: string;
  phase?: string;
  decoderBrand?: string;
  couplerType?: string;
  lighting?: string;
  material?: string;
  paint?: string;
  packaging?: string;
  paperwork?: string;
  wheelWear?: string;
  runningCondition?: string;
  dccStatus?: string;
  // Dimensions
  length?: string;
  width?: string;
  height?: string;
  // Description
  description?: string;
  // Editable AI evidence (from images)
  features?: string[];
  defects?: string[];
  // Last AI analysis snapshot used to generate this listing
  aiAnalysis?: AIAnalysis | null;
  // Metadata
  confidence?: number;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  approvedAt?: string;
  exportedAt?: string;
}

// AI Analysis result type
export interface AIAnalysis {
  title: string | null;
  brand: string | null;
  line: string | null;
  scale: string | null;
  gauge: string | null;
  locomotiveType: string | null;
  roadName: string | null;
  roadNumber: string | null;
  modelNumber: string | null;
  dcc: string | null;
  decoderBrand: string | null;
  condition: number | null;
  conditionNotes: string | null;
  runningCondition: string | null;
  lighting: string | null;
  packaging: string | null;
  paperwork: boolean | null;
  wheelWear: string | null;
  material: string | null;
  paint: string | null;
  couplerType: string | null;
  features: string[];
  defects: string[];
  description: string | null;
  estimatedValue: string | null;
  confidence: number | null;
}

interface ListingContextType {
  listings: Listing[];
  currentListing: Listing | null;
  uploadedImages: ListingImage[];
  isLoading: boolean;
  // Listing operations
  addListing: (listing: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>) => Listing;
  updateListing: (id: string, updates: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  getListing: (id: string) => Listing | undefined;
  getListingsBySku: (sku: string) => Listing | undefined;
  // Status operations
  approveListing: (id: string) => void;
  exportListings: (ids: string[]) => void;
  // Current listing operations
  setCurrentListing: (listing: Listing | null) => void;
  // Image operations
  addImages: (files: File[]) => Promise<ListingImage[]>;
  removeImage: (imageId: string) => Promise<void>;
  clearImages: () => void;
  isUploading: boolean;
  // AI Analysis
  analyzeImages: (imageUrls: string[]) => Promise<AIAnalysis | null>;
  isAnalyzing: boolean;
  lastAnalysis: AIAnalysis | null;
  // Stats
  getStats: () => {
    total: number;
    pending: number;
    approved: number;
    exported: number;
    todayProcessed: number;
    todayApproved: number;
  };
  // Generate SKU
  generateSku: () => string;
  // Clear all data
  clearAllData: () => void;
}

const ListingContext = createContext<ListingContextType | undefined>(undefined);

const STORAGE_KEY = 'mtm-listings';
const IMAGES_KEY = 'mtm-uploaded-images';
const SKU_COUNTER_KEY = 'mtm-sku-counter';
const ANALYSIS_KEY = 'mtm-last-analysis';

// Helper to generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function ListingProvider({ children }: { children: ReactNode }) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ListingImage[]>([]);
  const [currentListing, setCurrentListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AIAnalysis | null>(null);
  const [skuCounter, setSkuCounter] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Load data from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    try {
      const storedListings = localStorage.getItem(STORAGE_KEY);
      if (storedListings) {
        const parsed = JSON.parse(storedListings);
        setListings(parsed);
      }

      const storedImages = localStorage.getItem(IMAGES_KEY);
      if (storedImages) {
        setUploadedImages(JSON.parse(storedImages));
      }

      const storedCounter = localStorage.getItem(SKU_COUNTER_KEY);
      if (storedCounter) {
        setSkuCounter(parseInt(storedCounter, 10));
      }

      // Load last AI analysis
      const storedAnalysis = localStorage.getItem(ANALYSIS_KEY);
      if (storedAnalysis) {
        setLastAnalysis(JSON.parse(storedAnalysis));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save listings to localStorage whenever they change (only after initial load)
  useEffect(() => {
    if (mounted && !isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
      } catch (error) {
        console.error('Error saving listings to localStorage:', error);
      }
    }
  }, [listings, isLoading, mounted]);

  // Save uploaded images to localStorage
  useEffect(() => {
    if (mounted && !isLoading) {
      try {
        localStorage.setItem(IMAGES_KEY, JSON.stringify(uploadedImages));
      } catch (error) {
        console.error('Error saving images to localStorage:', error);
      }
    }
  }, [uploadedImages, isLoading, mounted]);

  // Save SKU counter
  useEffect(() => {
    if (mounted && !isLoading) {
      localStorage.setItem(SKU_COUNTER_KEY, skuCounter.toString());
    }
  }, [skuCounter, isLoading, mounted]);

  // Generate SKU
  const generateSku = (): string => {
    const sku = `MTM-${String(skuCounter).padStart(6, '0')}`;
    setSkuCounter((prev) => prev + 1);
    return sku;
  };

  // Add a new listing
  const addListing = (listingData: Omit<Listing, 'id' | 'createdAt' | 'updatedAt'>): Listing => {
    const now = new Date().toISOString();
    const newListing: Listing = {
      ...listingData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    // Update state
    setListings((prev) => {
      const updated = [...prev, newListing];
      // Save to localStorage synchronously to ensure data persists before navigation
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving listings to localStorage:', error);
      }
      return updated;
    });
    
    return newListing;
  };

  // Update a listing
  const updateListing = (id: string, updates: Partial<Listing>) => {
    setListings((prev) => {
      const updated = prev.map((listing) =>
        listing.id === id
          ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
          : listing
      );
      // Save synchronously
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving listings to localStorage:', error);
      }
      return updated;
    });
  };

  // Delete a listing
  const deleteListing = (id: string) => {
    setListings((prev) => {
      const updated = prev.filter((listing) => listing.id !== id);
      // Save synchronously
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving listings to localStorage:', error);
      }
      return updated;
    });
  };

  // Get a listing by ID
  const getListing = (id: string): Listing | undefined => {
    return listings.find((listing) => listing.id === id);
  };

  // Get a listing by SKU
  const getListingsBySku = (sku: string): Listing | undefined => {
    return listings.find((listing) => listing.sku === sku);
  };

  // Approve a listing
  const approveListing = (id: string) => {
    updateListing(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
    });
  };

  // Export listings
  const exportListings = (ids: string[]) => {
    const now = new Date().toISOString();
    setListings((prev) => {
      const updated: Listing[] = prev.map((listing) =>
        ids.includes(listing.id)
          ? { ...listing, status: 'exported' as const, exportedAt: now, updatedAt: now }
          : listing
      );
      // Save synchronously
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving listings to localStorage:', error);
      }
      return updated;
    });
  };

  // Add images from files (uploads to Cloudinary)
  const addImages = async (files: File[]): Promise<ListingImage[]> => {
    setIsUploading(true);
    const newImages: ListingImage[] = [];

    for (const file of files) {
      try {
        // Upload to Cloudinary via API route
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'mtm-listings');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const result = await response.json();
          const image: ListingImage = {
            id: generateId(),
            name: file.name,
            type: file.type,
            size: result.size || file.size,
            url: result.url,
            publicId: result.publicId,
            width: result.width,
            height: result.height,
            uploadedAt: new Date().toISOString(),
          };
          newImages.push(image);
        } else {
          // Fallback to base64 if Cloudinary upload fails
          console.warn('Cloudinary upload failed, falling back to base64');
          const dataUrl = await fileToBase64(file);
          const image: ListingImage = {
            id: generateId(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: dataUrl,
            uploadedAt: new Date().toISOString(),
          };
          newImages.push(image);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        // Fallback to base64
        try {
          const dataUrl = await fileToBase64(file);
          const image: ListingImage = {
            id: generateId(),
            name: file.name,
            type: file.type,
            size: file.size,
            url: dataUrl,
            uploadedAt: new Date().toISOString(),
          };
          newImages.push(image);
        } catch (e) {
          console.error('Error converting file to base64:', e);
        }
      }
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
    return newImages;
  };

  // Remove an image (also delete from Cloudinary if applicable)
  const removeImage = async (imageId: string) => {
    const image = uploadedImages.find((img) => img.id === imageId);
    
    // If image has a Cloudinary publicId, delete it from Cloudinary
    if (image?.publicId) {
      try {
        await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId: image.publicId }),
        });
      } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
      }
    }
    
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Clear all uploaded images and analysis (for fresh start after approval)
  const clearImages = () => {
    setUploadedImages([]);
    setLastAnalysis(null);
    // Clear from localStorage
    try {
      localStorage.removeItem(IMAGES_KEY);
      localStorage.removeItem(ANALYSIS_KEY);
    } catch (error) {
      console.error('Error clearing images from localStorage:', error);
    }
  };

  // Analyze images with Gemini AI
  const analyzeImages = async (imageUrls: string[]): Promise<AIAnalysis | null> => {
    if (imageUrls.length === 0) {
      return null;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrls }),
      });

      let data: any = null;
      try {
        data = await response.json();
      } catch {
        // If response isn't JSON, log and bail
        console.error('Analyze API returned non-JSON response');
        return null;
      }

      if (!response.ok) {
        console.error('Analyze API error response:', data);
        return null;
      }
      
      if (data.success && data.analysis) {
        // Save to state and localStorage immediately
        setLastAnalysis(data.analysis);
        try {
          localStorage.setItem(ANALYSIS_KEY, JSON.stringify(data.analysis));
        } catch (e) {
          console.error('Error saving analysis to localStorage:', e);
        }
        return data.analysis;
      }
      
      return null;
    } catch (error) {
      console.error('Error analyzing images:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get stats
  const getStats = () => {
    const today = new Date().toDateString();
    const todayListings = listings.filter(
      (l) => new Date(l.createdAt).toDateString() === today
    );
    const todayApprovedListings = listings.filter(
      (l) => l.approvedAt && new Date(l.approvedAt).toDateString() === today
    );

    return {
      total: listings.length,
      pending: listings.filter((l) => l.status === 'pending').length,
      approved: listings.filter((l) => l.status === 'approved').length,
      exported: listings.filter((l) => l.status === 'exported').length,
      todayProcessed: todayListings.length,
      todayApproved: todayApprovedListings.length,
    };
  };

  // Clear all data
  const clearAllData = () => {
    setListings([]);
    setUploadedImages([]);
    setCurrentListing(null);
    setLastAnalysis(null);
    setSkuCounter(1);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(IMAGES_KEY);
    localStorage.removeItem(SKU_COUNTER_KEY);
    localStorage.removeItem(ANALYSIS_KEY);
  };

  const value: ListingContextType = {
    listings,
    currentListing,
    uploadedImages,
    isLoading,
    isUploading,
    isAnalyzing,
    lastAnalysis,
    addListing,
    updateListing,
    deleteListing,
    getListing,
    getListingsBySku,
    approveListing,
    exportListings,
    setCurrentListing,
    addImages,
    removeImage,
    clearImages,
    analyzeImages,
    getStats,
    generateSku,
    clearAllData,
  };

  return <ListingContext.Provider value={value}>{children}</ListingContext.Provider>;
}

export function useListings() {
  const context = useContext(ListingContext);
  if (context === undefined) {
    throw new Error('useListings must be used within a ListingProvider');
  }
  return context;
}
