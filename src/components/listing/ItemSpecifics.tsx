import React, { useMemo } from 'react';
import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface ItemSpecificsProps {
  data?: Record<string, any>;
  onChange?: (key: string, value: string) => void;
  isAiGenerated?: boolean;
}

interface SpecField {
  key: string;
  label: string;
  required: boolean;
  options?: string[];
}

const specFields: SpecField[] = [
  { key: 'brand', label: 'Brand', required: true },
  { key: 'line', label: 'Line', required: false },
  { key: 'scale', label: 'Scale', required: true },
  { key: 'gauge', label: 'Gauge', required: true },
  { key: 'roadName', label: 'Road Name', required: true },
  { key: 'roadNumber', label: 'Road Number', required: false },
  { key: 'locomotiveType', label: 'Locomotive Type', required: true },
  { key: 'phase', label: 'Phase', required: false },
  { key: 'dcc', label: 'Control', required: true },
  { key: 'decoderBrand', label: 'Decoder Brand', required: false },
  { key: 'couplerType', label: 'Coupler Type', required: false },
  { key: 'lighting', label: 'Lighting', required: false },
  { key: 'material', label: 'Material', required: false },
  { key: 'paint', label: 'Paint', required: false },
  { key: 'packaging', label: 'Packaging', required: true },
  { key: 'paperwork', label: 'Paperwork', required: false, options: ['Included', 'Not Included'] },
  { key: 'wheelWear', label: 'Wheel Wear', required: false, options: ['Very little', 'Minor', 'Moderate', 'Heavy'] },
  { key: 'runningCondition', label: 'Running Condition', required: true },
  { key: 'dccStatus', label: 'DCC Status', required: false },
];

export function ItemSpecifics({ data = {}, onChange, isAiGenerated }: ItemSpecificsProps) {
  const missingRequired = useMemo(() => {
    return specFields.filter(spec => spec.required && !data[spec.key]);
  }, [data]);

  const filledFields = useMemo(() => {
    return specFields.filter(spec => data[spec.key] && data[spec.key].trim() !== '');
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-900">
            Item Specifics
          </label>
          {isAiGenerated && filledFields.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              {filledFields.length} AI detected
            </span>
          )}
        </div>
        <div className="text-xs text-gray-600">
          <span className="text-red-600 font-medium">*</span> Required
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        {specFields.map((spec) => {
          const value = data[spec.key] || '';
          const hasValue = value && value.trim() !== '';
          
          const placeholder = spec.key === 'roadNumber'
            ? 'Number only (e.g. 1574), not the reporting mark (BN, UP, etc.)'
            : spec.options
            ? `Select ${spec.label.toLowerCase()}...`
            : `Enter ${spec.label.toLowerCase()}...`;
          const inputClass = `w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent ${
            spec.required && !hasValue
              ? 'border-red-300 bg-red-50'
              : hasValue && isAiGenerated
              ? 'border-purple-200 bg-purple-50'
              : 'border-gray-300'
          }`;
          return (
            <div key={spec.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                {spec.label}
                {spec.required && <span className="text-red-600 ml-1">*</span>}
              </label>
              {spec.options ? (
                <select
                  value={value}
                  onChange={(e) => onChange?.(spec.key, e.target.value)}
                  className={inputClass}
                >
                  <option value="">{placeholder}</option>
                  {spec.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange?.(spec.key, e.target.value)}
                  placeholder={placeholder}
                  className={inputClass}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Status Alert */}
      {missingRequired.length > 0 ? (
        <div className="mt-3 sm:mt-4 flex items-start gap-2 p-2 sm:p-3 bg-amber-50 border border-amber-200 rounded-md">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-800">
            <span className="font-medium">Missing required fields:</span>{' '}
            {missingRequired.map(f => f.label).join(', ')}
          </div>
        </div>
      ) : (
        <div className="mt-3 sm:mt-4 flex items-start gap-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-green-800">
            <span className="font-medium">All required fields filled.</span> Ready for export.
          </div>
        </div>
      )}
    </div>
  );
}