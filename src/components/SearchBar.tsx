'use client';

import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  showFilters?: boolean;
}

export function SearchBar({ 
  placeholder = 'Search listings...', 
  onSearch,
  onFilterClick,
  showFilters = false
}: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8b4513] focus:border-transparent text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {showFilters && (
          <button
            type="button"
            onClick={onFilterClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
