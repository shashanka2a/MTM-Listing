import React from 'react';
import { AlertTriangle } from 'lucide-react';

const specs = [
  { label: 'Brand', value: 'Bowser', required: true },
  { label: 'Line', value: 'Executive Line', required: false },
  { label: 'Scale', value: 'HO', required: true },
  { label: 'Gauge', value: 'HO', required: true },
  { label: 'Road Name', value: 'Pennsylvania', required: true },
  { label: 'Road Number', value: '8595', required: false },
  { label: 'Locomotive Type', value: 'ALCO RS-3', required: true },
  { label: 'Phase', value: 'III', required: false },
  { label: 'Control', value: 'DCC & Sound', required: true },
  { label: 'Decoder Brand', value: 'ESU LokSound V5', required: false },
  { label: 'Coupler Type', value: 'Knuckle', required: false },
  { label: 'Lighting', value: 'Directional', required: false },
  { label: 'Material', value: 'Plastic', required: false },
  { label: 'Paint', value: 'Factory', required: false },
  { label: 'Packaging', value: 'Original Box', required: true },
  { label: 'Paperwork', value: 'Included', required: false },
  { label: 'Wheel Wear', value: 'Minor', required: false },
  { label: 'Running Condition', value: 'Tested, Runs Well', required: true },
  { label: 'DCC Status', value: 'Dual Mode', required: false },
];

export function ItemSpecifics() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Item Specifics
        </label>
        <div className="text-xs text-gray-600">
          <span className="text-red-600 font-medium">*</span> Required fields
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {specs.map((spec, index) => (
          <div key={index}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {spec.label}
              {spec.required && <span className="text-red-600 ml-1">*</span>}
            </label>
            <input
              type="text"
              defaultValue={spec.value}
              className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent ${
                spec.required && !spec.value
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Missing Fields Alert */}
      <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-md">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-amber-800">
          <span className="font-medium">All required fields filled.</span> Ready for export.
        </div>
      </div>
    </div>
  );
}