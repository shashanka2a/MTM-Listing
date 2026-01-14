import React from 'react';
import { Wand2 } from 'lucide-react';

interface TitleGeneratorProps {
  title: string;
  onTitleChange: (title: string) => void;
}

const templateParts = [
  { key: 'scale', label: 'Scale', value: 'HO' },
  { key: 'brand', label: 'Brand', value: 'Bowser' },
  { key: 'line', label: 'Line', value: 'Executive' },
  { key: 'number', label: 'Number', value: '24688' },
  { key: 'road', label: 'Road', value: 'PRR' },
  { key: 'model', label: 'Model', value: 'ALCO RS-3 Ph. III' },
  { key: 'type', label: 'Type', value: 'Diesel' },
  { key: 'roadNumber', label: 'Road #', value: '#8595' },
  { key: 'features', label: 'Features', value: 'w/ DCC & Sound' },
];

export function TitleGenerator({ title, onTitleChange }: TitleGeneratorProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Title Generator
        </label>
        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#8b4513] bg-[#faf8f6] border border-[#8b4513] rounded-md hover:bg-[#f5f1ec]">
          <Wand2 className="w-4 h-4" />
          Regenerate
        </button>
      </div>

      <textarea
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        rows={2}
        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
      />

      <div className="mt-3">
        <div className="text-xs font-medium text-gray-700 mb-2">Template Parts:</div>
        <div className="flex flex-wrap gap-2">
          {templateParts.map((part) => (
            <div
              key={part.key}
              className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded text-xs"
            >
              <span className="text-gray-500">{part.label}:</span>
              <span className="font-medium text-gray-900">{part.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
