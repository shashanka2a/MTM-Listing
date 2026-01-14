'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileCode, CheckCircle2, Plus, ChevronRight, Settings, Package, CheckCheck } from 'lucide-react';
import { SearchBar } from '../SearchBar';
import { EmptyState } from '../EmptyState';
import { RoleSwitcher } from '../RoleSwitcher';
import { ListingPreviewModal } from '../ListingPreviewModal';
import { useRole } from '../../contexts/RoleContext';
import { generateSixBitCSV, generateSixBitXML, downloadCSV, downloadXML } from '../../utils/csvExport';

interface ExportScreenProps {
  listings: any[];
  onNewUpload: () => void;
}

const mockListings = [
  {
    sku: 'MTM-000768',
    title: 'HO Bowser Executive 24688 PRR ALCO RS-3 Ph. III Diesel #8595 w/ DCC & Sound',
    condition: 'C7',
    scale: 'HO',
    brand: 'Bowser',
    dcc: 'Yes',
    weight: '8.5 oz',
    status: 'approved',
    vendor: 'John Smith'
  },
  {
    sku: 'MTM-000769',
    title: 'N Scale Kato 176-5321 Union Pacific EMD SD70ACe #8566 DCC Ready',
    condition: 'C8',
    scale: 'N',
    brand: 'Kato',
    dcc: 'Ready',
    weight: '3.2 oz',
    status: 'pending',
    vendor: 'Sarah Johnson'
  },
  {
    sku: 'MTM-000770',
    title: 'HO Atlas Master Gold 10002797 CSX ES44AH #3285 w/ LokSound',
    condition: 'C9',
    scale: 'HO',
    brand: 'Atlas',
    dcc: 'Yes',
    weight: '12.3 oz',
    status: 'approved',
    vendor: 'Mike Davis'
  },
  {
    sku: 'MTM-000771',
    title: 'HO Athearn Genesis 71601 BNSF SD70ACe #9356 w/ DCC & Sound',
    condition: 'C8',
    scale: 'HO',
    brand: 'Athearn',
    dcc: 'Yes',
    weight: '11.2 oz',
    status: 'pending',
    vendor: 'John Smith'
  },
];

export function ExportScreen({ listings, onNewUpload }: ExportScreenProps) {
  const { isAdmin, isVendor, role } = useRole();
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [showMapping, setShowMapping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewListing, setPreviewListing] = useState<any>(null);
  const allListings = [...mockListings, ...listings];
  
  // Filter based on role
  const filteredListings = allListings.filter(listing => {
    // Ensure listing has required properties
    if (!listing || !listing.title || !listing.sku) {
      return false;
    }
    
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Vendors only see their own listings
    if (isVendor) {
      return matchesSearch && listing.vendor === 'John Smith'; // Simulated current user
    }
    
    // Admins see all
    return matchesSearch;
  });

  const pendingListings = filteredListings.filter(l => l.status === 'pending');
  const approvedListings = filteredListings.filter(l => l.status === 'approved');

  const toggleSelection = (sku: string) => {
    setSelectedListings(prev => 
      prev.includes(sku) 
        ? prev.filter(s => s !== sku)
        : [...prev, sku]
    );
  };

  const toggleSelectAll = () => {
    if (selectedListings.length === approvedListings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(approvedListings.map(l => l.sku));
    }
  };

  const handleDownloadCSV = () => {
    const listingsToExport = selectedListings.length > 0
      ? allListings.filter(l => selectedListings.includes(l.sku))
      : approvedListings;
    
    const csvContent = generateSixBitCSV(listingsToExport);
    const filename = `sixbit-export-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  const handleDownloadXML = () => {
    const listingsToExport = selectedListings.length > 0
      ? allListings.filter(l => selectedListings.includes(l.sku))
      : approvedListings;
    
    const xmlContent = generateSixBitXML(listingsToExport);
    const filename = `sixbit-export-${new Date().toISOString().split('T')[0]}.xml`;
    downloadXML(xmlContent, filename);
  };

  const handleFinalizeQueue = () => {
    const csvContent = generateSixBitCSV(approvedListings);
    const filename = `sixbit-finalized-${new Date().toISOString().split('T')[0]}.csv`;
    downloadCSV(csvContent, filename);
  };

  return (
    <div className="min-h-screen bg-[#faf8f6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3 gap-4">
            <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto pb-1 flex-shrink min-w-0">
              <span className="hover:text-gray-900 cursor-pointer whitespace-nowrap">Home</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hover:text-gray-900 cursor-pointer whitespace-nowrap">Upload</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hover:text-gray-900 cursor-pointer whitespace-nowrap">Review</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="font-medium text-[#800000] whitespace-nowrap">Export</span>
            </div>
            <div className="flex-shrink-0">
              <RoleSwitcher />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                {isAdmin ? 'Export Listings' : 'My Listings Queue'}
              </h1>
              {isVendor && (
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  Track your submitted listings and their approval status
                </p>
              )}
            </div>
            <button
              onClick={onNewUpload}
              className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium text-sm whitespace-nowrap flex-shrink-0"
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">New Upload</span>
              <span className="sm:hidden">Upload</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-28">
        {/* Search Bar */}
        <div className="mb-6">
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
            description="Try adjusting your search or upload new photos to get started."
            action={{
              label: 'Upload Photos',
              onClick: onNewUpload
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Listings Table */}
            <div className="lg:col-span-2 space-y-6">
              {/* Pending Listings (Admin Only or Vendor's own) */}
              {(isAdmin || (isVendor && pendingListings.length > 0)) && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200 bg-purple-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {isAdmin ? 'Pending Admin Review' : 'Pending Approval'}
                        <span className="ml-2 text-sm font-normal text-gray-600">
                          ({pendingListings.length})
                        </span>
                      </h3>
                      {isAdmin && pendingListings.length > 0 && (
                        <button className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#800000] text-white rounded-md hover:bg-[#600000] font-medium text-sm whitespace-nowrap">
                          <CheckCheck className="w-4 h-4 flex-shrink-0" />
                          <span className="hidden sm:inline">Batch Approve</span>
                          <span className="sm:hidden">Approve</span> ({pendingListings.length})
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          {isAdmin && (
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Select
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            SKU
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Title
                          </th>
                          {isAdmin && (
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Vendor
                            </th>
                          )}
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Condition
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Scale
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          {isAdmin && (
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {pendingListings.map((listing) => (
                          <tr key={listing.sku} className="hover:bg-gray-50">
                            {isAdmin && (
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedListings.includes(listing.sku)}
                                  onChange={() => toggleSelection(listing.sku)}
                                  className="w-4 h-4 text-[#8b4513] border-gray-300 rounded focus:ring-[#8b4513]"
                                />
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                              {listing.sku}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                              {listing.title}
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {listing.vendor}
                              </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {listing.condition}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {listing.scale}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                Pending
                              </span>
                            </td>
                            {isAdmin && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <button 
                                  onClick={() => setPreviewListing(listing)}
                                  className="text-sm text-[#800000] hover:text-[#660000] font-medium"
                                >
                                  Review
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Approved Listings */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <input
                          type="checkbox"
                          checked={selectedListings.length === approvedListings.length}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-[#8b4513] border-gray-300 rounded focus:ring-[#8b4513]"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-700">
                        {isAdmin ? `${selectedListings.length} of ${approvedListings.length} selected` : `${approvedListings.length} Approved Listings`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        {approvedListings.length} Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {isAdmin && (
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Select
                          </th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          SKU
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Condition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Scale
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Brand
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          DCC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Weight
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {approvedListings.map((listing) => (
                        <tr key={listing.sku} className="hover:bg-gray-50">
                          {isAdmin && (
                            <td className="px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedListings.includes(listing.sku)}
                                onChange={() => toggleSelection(listing.sku)}
                                className="w-4 h-4 text-[#8b4513] border-gray-300 rounded focus:ring-[#8b4513]"
                              />
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                            {isAdmin ? (
                              <button
                                onClick={() => setPreviewListing(listing)}
                                className="text-[#8b4513] hover:text-[#723a0f] hover:underline font-semibold"
                              >
                                {listing.sku}
                              </button>
                            ) : (
                              listing.sku
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                            {listing.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {listing.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {listing.scale}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {listing.brand}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {listing.dcc}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {listing.weight}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {listing.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Export Panel */}
            <div className="space-y-6">
              {/* Export Options - Admin Only */}
              {isAdmin && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h3>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={handleDownloadCSV}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#800000] text-white rounded-md hover:bg-[#660000] font-medium transition-colors"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      Download CSV
                    </button>
                    
                    <button 
                      onClick={handleDownloadXML}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#900000] text-white rounded-md hover:bg-[#700000] font-medium transition-colors"
                    >
                      <FileCode className="w-5 h-5" />
                      Download XML
                    </button>

                    <button 
                      onClick={handleDownloadCSV}
                      disabled={selectedListings.length === 0}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-5 h-5" />
                      Export Selected ({selectedListings.length})
                    </button>

                    <button 
                      onClick={handleFinalizeQueue}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium transition-colors"
                    >
                      <CheckCheck className="w-5 h-5" />
                      Finalize Queue ({approvedListings.length})
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-900">
                      <strong>{approvedListings.length} listings</strong> ready for export. 
                      {pendingListings.length > 0 && (
                        <span className="block mt-1">
                          <strong>{pendingListings.length} listings</strong> awaiting approval.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}

              {/* Vendor Queue Status */}
              {isVendor && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Queue Status</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-purple-900">Pending Review</span>
                        <span className="text-2xl font-bold text-purple-900">{pendingListings.length}</span>
                      </div>
                      <p className="text-xs text-purple-700">Awaiting admin approval</p>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-green-900">Approved</span>
                        <span className="text-2xl font-bold text-green-900">{approvedListings.length}</span>
                      </div>
                      <p className="text-xs text-green-700">Ready for export</p>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <p className="text-sm text-blue-900">
                        <strong>Next steps:</strong> Upload more items or wait for admin approval on pending listings.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Column Mapping */}
              {isAdmin && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Column Mapping</h3>
                    <button
                      onClick={() => setShowMapping(!showMapping)}
                      className="text-sm text-[#8b4513] hover:text-[#723a0f] font-medium"
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
                          <span className="text-gray-500">→</span>
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
              )}

              {/* Stats */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isAdmin ? 'Export Stats' : 'My Stats'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Listings</span>
                    <span className="text-sm font-semibold text-gray-900">{filteredListings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved</span>
                    <span className="text-sm font-semibold text-green-700">{approvedListings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending</span>
                    <span className="text-sm font-semibold text-purple-700">{pendingListings.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Confidence</span>
                    <span className="text-sm font-semibold text-gray-900">87%</span>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Processing Time</span>
                      <span className="text-sm font-semibold text-gray-900">2.3s avg</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Listing Preview Modal */}
      {previewListing && (
        <ListingPreviewModal
          listing={previewListing}
          onClose={() => setPreviewListing(null)}
          images={[
            'https://images.unsplash.com/photo-1762015918614-2c9087a95e43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&q=80'
          ]}
        />
      )}
    </div>
  );
}