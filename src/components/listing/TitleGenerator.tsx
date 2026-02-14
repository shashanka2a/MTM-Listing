import React, { useMemo } from 'react';
import { Wand2 } from 'lucide-react';

interface TemplatePart {
  key: string;
  label: string;
  value: string;
}

interface TitleGeneratorProps {
  title: string;
  onTitleChange: (title: string) => void;
  templateParts?: TemplatePart[];
  onRegenerate?: () => void;
  isAiGenerated?: boolean;
}

const defaultTemplateParts: TemplatePart[] = [
  { key: 'scale', label: 'Scale', value: '' },
  { key: 'brand', label: 'Brand', value: '' },
  { key: 'road', label: 'Road', value: '' },
  { key: 'type', label: 'Type', value: '' },
  { key: 'roadNumber', label: 'Road #', value: '' },
  { key: 'features', label: 'Features', value: '' },
];

export function TitleGenerator({ title, onTitleChange, templateParts, onRegenerate }: TitleGeneratorProps) {
  // Filter out empty template parts
  const displayParts = useMemo(() => {
    const parts = templateParts || defaultTemplateParts;
    return parts.filter(part => part.value && part.value.trim() !== '');
  }, [templateParts]);
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Title Generator
        </label>
        <button 
          onClick={onRegenerate}
          disabled={!onRegenerate}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8b4513] bg-[#faf8f6] border border-[#8b4513] rounded-md hover:bg-[#f5f1ec] self-start sm:self-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <textarea
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        rows={3}
        placeholder="AI will generate a title based on your photos..."
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
      />

      {displayParts.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-medium text-gray-700 mb-2">Detected from images:</div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {displayParts.map((part) => (
              <div
                key={part.key}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-50 border border-purple-200 rounded text-[10px] sm:text-xs"
              >
                <span className="text-purple-600">{part.label}:</span>
                <span className="font-medium text-purple-900">{part.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {displayParts.length === 0 && !title && (
        <div className="mt-3 text-xs text-gray-500">
          Upload photos and run AI analysis to auto-generate title
        </div>
      )}
    </div>
  );
}
