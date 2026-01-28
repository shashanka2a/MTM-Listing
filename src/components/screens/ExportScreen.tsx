'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, FileSpreadsheet, FileCode, CheckCircle2, Plus, ChevronRight, Settings, Package, CheckCheck, Home, Trash2 } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { EmptyState } from '../EmptyState';
import { ListingPreviewModal } from '../ListingPreviewModal';
import { generateSixBitCSV, generateSixBitXML, downloadCSV, downloadXML, ListingData } from '../../utils/csvExport';
import { useListings } from '../../contexts/ListingContext';

interface ExportScreenProps {
  listings?: any[];
  onNewUpload: () => void;
}

export function ExportScreen({ onNewUpload }: ExportScreenProps) {
  const { listings, exportListings, deleteListing, getStats } = useListings();
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewListing, setPreviewListing] = useState<any>(null);

  // Helper to compute SixBit condition code from listing or AI snapshot
  const getConditionCode = (listing: any): string => {
    const ai = listing.aiAnalysis || {};
    const value =
      typeof listing.condition === 'number' && !Number.isNaN(listing.condition)
        ? listing.condition
        : typeof ai.condition === 'number' && !Number.isNaN(ai.condition)
          ? ai.condition
          : null;
    return value != null ? `C${value}` : '';
  };

  // Normalize listing data for preview/export using AI snapshot where needed
  const enrichListing = (listing: any) => {
    const ai = listing.aiAnalysis || {};
    return {
      ...listing,
      title: listing.title || ai.title || '',
      brand: listing.brand || ai.brand || '',
      scale: listing.scale || ai.scale || '',
      dcc: listing.dcc || ai.dcc || '',
      roadName: listing.roadName || ai.roadName || '',
      roadNumber: listing.roadNumber || ai.roadNumber || '',
      locomotiveType: listing.locomotiveType || ai.locomotiveType || '',
      description: listing.description || ai.description || '',
    };
  };

  // Get approved and exported listings
  const exportableListings = listings.filter(l => l.status === 'approved' || l.status === 'exported');
  
  // Filter listings based on search
  const filteredListings = exportableListings.filter(listing => {
    if (!listing) {
      return false;
    }
    
    // If no search query, show all
    if (!searchQuery) {
      return true;
    }
    
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      (listing.title?.toLowerCase() || '').includes(searchLower) ||
      (listing.sku?.toLowerCase() || '').includes(searchLower) ||
      (listing.brand?.toLowerCase() || '').includes(searchLower);
    
    return matchesSearch;
  });

  const toggleSelection = (id: string) => {
    setSelectedListings(prev => 
      prev.includes(id) 
        ? prev.filter(s => s !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedListings.length === filteredListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(filteredListings.map(l => l.id));
    }
  };

  const handleDownloadCSV = () => {
    const listingsToExport = selectedListings.length > 0
      ? filteredListings.filter(l => selectedListings.includes(l.id))
      : filteredListings;

    // Map internal Listing shape to CSV export shape with AI details
    const formattedListings: ListingData[] = listingsToExport.map((l) => ({
      sku: l.sku,
      title: l.title || l.aiAnalysis?.title || '',
      condition: getConditionCode(l),
      brand: l.brand || l.aiAnalysis?.brand || '',
      scale: l.scale || l.aiAnalysis?.scale || '',
      dcc: l.dcc || l.aiAnalysis?.dcc || '',
      weight: l.weight || '',
      status: l.status,
      vendor: l.vendor,
      images: (l.images || []).map((img: any) => ({ url: img.url, publicId: img.publicId })),
      description: l.description || l.aiAnalysis?.description || '',
      roadName: l.roadName || l.aiAnalysis?.roadName || '',
      roadNumber: l.roadNumber || l.aiAnalysis?.roadNumber || '',
      locomotiveType: l.locomotiveType || l.aiAnalysis?.locomotiveType || '',
    }));

    const csvContent = generateSixBitCSV(formattedListings);
    const filename = `sixbit-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    
    // Mark as exported
    exportListings(listingsToExport.map(l => l.id));
  };

  const handleDownloadXML = () => {
    const listingsToExport = selectedListings.length > 0
      ? filteredListings.filter(l => selectedListings.includes(l.id))
      : filteredListings;

    const formattedListings: ListingData[] = listingsToExport.map((l) => ({
      sku: l.sku,
      title: l.title || l.aiAnalysis?.title || '',
      condition: getConditionCode(l),
      brand: l.brand || l.aiAnalysis?.brand || '',
      scale: l.scale || l.aiAnalysis?.scale || '',
      dcc: l.dcc || l.aiAnalysis?.dcc || '',
      weight: l.weight || '',
      status: l.status,
      vendor: l.vendor,
      images: (l.images || []).map((img: any) => ({ url: img.url, publicId: img.publicId })),
      description: l.description || l.aiAnalysis?.description || '',
      roadName: l.roadName || l.aiAnalysis?.roadName || '',
      roadNumber: l.roadNumber || l.aiAnalysis?.roadNumber || '',
      locomotiveType: l.locomotiveType || l.aiAnalysis?.locomotiveType || '',
    }));

    const xmlContent = generateSixBitXML(formattedListings);
    const filename = `sixbit-export-${new Date().toISOString().split('T')[0]}.xml`;
    downloadXML(xmlContent, filename);
    
    // Mark as exported
    exportListings(listingsToExport.map(l => l.id));
  };

  const handleExportAll = () => {
    const formattedListings: ListingData[] = filteredListings.map((l) => ({
      sku: l.sku,
      title: l.title || l.aiAnalysis?.title || '',
      condition: getConditionCode(l),
      brand: l.brand || l.aiAnalysis?.brand || '',
      scale: l.scale || l.aiAnalysis?.scale || '',
      dcc: l.dcc || l.aiAnalysis?.dcc || '',
      weight: l.weight || '',
      status: l.status,
      vendor: l.vendor,
      images: (l.images || []).map((img: any) => ({ url: img.url, publicId: img.publicId })),
      description: l.description || l.aiAnalysis?.description || '',
      roadName: l.roadName || l.aiAnalysis?.roadName || '',
      roadNumber: l.roadNumber || l.aiAnalysis?.roadNumber || '',
      locomotiveType: l.locomotiveType || l.aiAnalysis?.locomotiveType || '',
    }));
    
    const csvContent = generateSixBitCSV(formattedListings);
    const filename = `sixbit-finalized-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
    
    // Mark all as exported
    exportListings(filteredListings.map(l => l.id));
  };

  const handleDeleteListing = (id: string) => {
    deleteListing(id);
    setSelectedListings(prev => prev.filter(s => s !== id));
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Link href="/" className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#800000] rounded-lg flex items-center justify-center">
                  <Package className="w-4 h-4 text-white" />
                </div>
              </Link>
              <div className="hidden xs:flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto min-w-0">
                <Link href="/" className="hover:text-gray-900 whitespace-nowrap">Home</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <Link href="/upload" className="hover:text-gray-900 whitespace-nowrap">Upload</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <Link href="/review" className="hover:text-gray-900 whitespace-nowrap">Review</Link>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="font-medium text-[#800000] whitespace-nowrap">Export</span>
              </div>
            </div>
            <Link 
              href="/"
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                Export Listings
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Download approved listings to SixBit CSV/XML format
              </p>
            </div>
            <button
              onClick={onNewUpload}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-sm whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span>New Upload</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 pb-8">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <SearchBar 
            placeholder="Search by SKU, title, brand..."
            onSearch={setSearchQuery}
            showFilters
          />
        </div>

        {filteredListings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No listings found"
            description={searchQuery ? "Try adjusting your search." : "Upload and approve photos to see listings here."}
            action={{
              label: 'Upload Photos',
              onClick: onNewUpload
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Listings */}
            <div className="lg:col-span-2">
              {/* Approved Listings */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedListings.length === filteredListings.length && filteredListings.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                        aria-label="Select all listings"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedListings.length} of {filteredListings.length} selected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        {filteredListings.length} in export queue
                      </span>
                    </div>
                  </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12">
                          <span className="sr-only">Select</span>
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Condition
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                          Scale
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                          Brand
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 lg:px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-16">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedListings.includes(listing.id)}
                              onChange={() => toggleSelection(listing.id)}
                              className="w-4 h-4 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                              aria-label={`Select ${listing.sku}`}
                            />
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                            <button
                              onClick={() => setPreviewListing(enrichListing(listing))}
                              className="text-[#800000] hover:text-[#600000] hover:underline font-semibold"
                            >
                              {listing.sku}
                            </button>
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 max-w-xs lg:max-w-md truncate">
                            {listing.title}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                            {getConditionCode(listing) || '—'}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden lg:table-cell">
                            {listing.scale}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-700 hidden xl:table-cell">
                            {listing.brand}
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              listing.status === 'exported' 
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {listing.status === 'exported' ? 'Exported' : 'Ready'}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteListing(listing.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <div key={listing.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedListings.includes(listing.id)}
                          onChange={() => toggleSelection(listing.id)}
                          className="w-4 h-4 mt-1 text-[#800000] border-gray-300 rounded focus:ring-[#800000]"
                          aria-label={`Select ${listing.sku}`}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <button
                              onClick={() => setPreviewListing(enrichListing(listing))}
                              className="text-sm font-mono font-semibold text-[#800000] hover:underline"
                            >
                              {listing.sku}
                            </button>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${
                                listing.status === 'exported' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {listing.status === 'exported' ? 'Exported' : 'Ready'}
                              </span>
                              <button
                                onClick={() => handleDeleteListing(listing.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-900 line-clamp-2 mb-2">
                            {listing.title}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">{getConditionCode(listing) || '—'}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{listing.scale}</span>
                            <span className="bg-gray-100 px-2 py-1 rounded">{listing.brand}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Panel */}
            <div className="space-y-4 sm:space-y-6">
              {/* Export Options */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                
                <div className="space-y-3">
                  <button 
                    onClick={handleDownloadCSV}
                    disabled={filteredListings.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#800000] text-white rounded-md hover:bg-[#660000] font-medium transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileSpreadsheet className="w-5 h-5" />
                    Download CSV
                  </button>
                  
                  <button 
                    onClick={handleDownloadXML}
                    disabled={filteredListings.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#900000] text-white rounded-md hover:bg-[#700000] font-medium transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FileCode className="w-5 h-5" />
                    Download XML
                  </button>

                  <button 
                    onClick={handleDownloadCSV}
                    disabled={selectedListings.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <Download className="w-5 h-5" />
                    Export Selected ({selectedListings.length})
                  </button>

                  <button 
                    onClick={handleExportAll}
                    disabled={filteredListings.length === 0}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    <CheckCheck className="w-5 h-5" />
                    Export All ({filteredListings.length})
                  </button>
                </div>

                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-900">
                    <strong>{filteredListings.length} listings</strong> ready for export to SixBit.
                  </p>
                </div>
              </div>

              {/* Column Mapping */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Column Mapping</h3>
                  <button
                    onClick={() => setShowMapping(!showMapping)}
                    className="text-sm text-[#800000] hover:text-[#600000] font-medium"
                  >
                    {showMapping ? 'Hide' : 'Show'}
                  </button>
                </div>

                {showMapping && (
                  <div className="space-y-2 text-sm">
                    {[
                      { app: 'SKU', sixbit: 'ItemNumber' },
                      { app: 'Title', sixbit: 'Title' },
                      { app: 'Condition', sixbit: 'ConditionCode' },
                      { app: 'Brand', sixbit: 'Brand' },
                      { app: 'Scale', sixbit: 'Scale' },
                      { app: 'Weight', sixbit: 'Weight' },
                    ].map((mapping, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-700 font-medium">{mapping.app}</span>
                        <span className="text-gray-400">→</span>
                        <span className="text-gray-600 font-mono text-xs">{mapping.sixbit}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm font-medium">
                  <Settings className="w-4 h-4" />
                  Configure Mapping
                </button>
              </div>

              {/* Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Session Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Total in export queue (ready + exported) */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-[#800000]/10 flex items-center justify-center mb-2">
                      <Package className="w-5 h-5 text-[#800000]" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {filteredListings.length}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Listings in export queue
                    </div>
                  </div>

                  {/* Exported listings */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-2">
                      <CheckCheck className="w-5 h-5 text-blue-700" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {stats.exported}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Exported this session
                    </div>
                  </div>

                  {/* Selected listings */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-700" />
                    </div>
                    <div className="text-xl font-semibold text-gray-900">
                      {selectedListings.length}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Currently selected
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Listing Preview Modal */}
      {previewListing && (
        <ListingPreviewModal
          listing={{
            ...previewListing,
            condition: getConditionCode(previewListing) || previewListing.condition
          }}
          onClose={() => setPreviewListing(null)}
          images={previewListing.images?.map((img: any) => img.url) || []}
        />
      )}
    </div>
  );
}
