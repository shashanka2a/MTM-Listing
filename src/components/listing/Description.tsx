import React from 'react';
import { Wand2 } from 'lucide-react';

interface DescriptionProps {
  description?: string;
  onChange?: (description: string) => void;
  onRegenerate?: () => void;
  isAiGenerated?: boolean;
}

export function Description({ description = '', onChange, onRegenerate }: DescriptionProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Description
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

      <div>
        <textarea
          value={description}
          onChange={(e) => onChange?.(e.target.value)}
          rows={8}
          placeholder="AI will generate a description based on your photos and the detected information..."
          className="w-full px-2 sm:px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
        />
        {!description && (
          <p className="mt-2 text-xs text-gray-500">
            Upload photos and run AI analysis to auto-generate a description
          </p>
        )}
      </div>
    </div>
  );
}
