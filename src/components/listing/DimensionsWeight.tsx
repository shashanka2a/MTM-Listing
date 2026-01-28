import React from 'react';

interface DimensionsWeightProps {
  data?: {
    length?: string;
    width?: string;
    height?: string;
    weight?: string;
  };
  onChange?: (key: string, value: string) => void;
}

export function DimensionsWeight({ data = {}, onChange }: DimensionsWeightProps) {
  const dimensions = [
    { key: 'length', label: 'Length', value: data.length || '', unit: 'in' },
    { key: 'width', label: 'Width', value: data.width || '', unit: 'in' },
    { key: 'height', label: 'Height', value: data.height || '', unit: 'in' },
    { key: 'weight', label: 'Weight', value: data.weight || '', unit: 'oz' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Dimensions & Weight
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {dimensions.map((dim) => (
          <div key={dim.key} className="border border-gray-200 rounded-md p-2 sm:p-3">
            <label className="block text-xs font-medium text-gray-700 mb-1.5 sm:mb-2">
              {dim.label}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={dim.value}
                onChange={(e) => onChange?.(dim.key, e.target.value)}
                placeholder="0"
                className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent"
              />
              <span className="w-12 sm:w-16 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-600 flex items-center justify-center">
                {dim.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}