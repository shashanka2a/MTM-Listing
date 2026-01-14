import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export function Breadcrumbs({ items, showHome = true }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm">
      {showHome && (
        <>
          <button
            onClick={() => items[0]?.onClick?.()}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go to home"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
          {items.length > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick && !item.disabled ? (
            <button
              onClick={item.onClick}
              className={`font-medium transition-colors ${
                item.active
                  ? 'text-[#800000] cursor-default'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </button>
          ) : (
            <span
              className={`font-medium ${
                item.active
                  ? 'text-[#800000]'
                  : item.disabled
                  ? 'text-gray-400'
                  : 'text-gray-600'
              }`}
              aria-current={item.active ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
          
          {index < items.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
