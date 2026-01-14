import React from 'react';
import { Database, Ruler, Scale } from 'lucide-react';

const dimensions = [
  { label: 'Length', value: '6.75', unit: 'in', source: 'catalog', confidence: 95 },
  { label: 'Width', value: '1.25', unit: 'in', source: 'scale', confidence: 90 },
  { label: 'Height', value: '1.75', unit: 'in', source: 'scale', confidence: 90 },
  { label: 'Weight', value: '8.5', unit: 'oz', source: 'estimated', confidence: 75 },
];

const sourceConfig = {
  catalog: { label: 'From Catalog', icon: Database, color: 'bg-green-100 text-green-700' },
  scale: { label: 'From Scale', icon: Ruler, color: 'bg-blue-100 text-blue-700' },
  estimated: { label: 'AI Estimated', icon: Scale, color: 'bg-amber-100 text-amber-700' },
};

export function DimensionsWeight() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Dimensions & Weight
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {dimensions.map((dim, index) => {
          const source = sourceConfig[dim.source as keyof typeof sourceConfig];
          const Icon = source.icon;

          return (
            <div key={index} className="border border-gray-200 rounded-md p-3">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {dim.label}
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  defaultValue={dim.value}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent"
                />
                <input
                  type="text"
                  defaultValue={dim.unit}
                  className="w-16 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${source.color}`}>
                  <Icon className="w-3 h-3" />
                  {source.label}
                </div>
                <div className="text-xs text-gray-600">
                  {dim.confidence}% confident
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}