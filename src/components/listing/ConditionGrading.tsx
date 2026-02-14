import React from 'react';

interface ConditionGradingProps {
  condition: number;
  onConditionChange: (condition: number) => void;
  conditionNotes?: string;
  onConditionNotesChange?: (notes: string) => void;
  features?: string[];
  defects?: string[];
  onFeaturesChange?: (features: string[]) => void;
  onDefectsChange?: (defects: string[]) => void;
  isAiGenerated?: boolean;
}

const conditionLabels: Record<number, string> = {
  1: 'C1 - Junk',
  2: 'C2 - Poor',
  3: 'C3 - Fair',
  4: 'C4 - Good',
  5: 'C5 - Good+',
  6: 'C6 - Very Good',
  7: 'C7 - Excellent',
  8: 'C8 - Like New',
  9: 'C9 - Mint',
  10: 'C10 - Brand New',
};

export function ConditionGrading({
  condition,
  onConditionChange,
}: ConditionGradingProps) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Condition Grading
        </label>
        <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 rounded-md self-start sm:self-auto">
          <span>Grade: {conditionLabels[condition]}</span>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <input
          type="range"
          min="1"
          max="10"
          value={condition}
          onChange={(e) => onConditionChange(Number(e.target.value))}
          className="w-full h-3 sm:h-2 bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 to-emerald-500 rounded-lg appearance-none cursor-pointer slider touch-manipulation"
          style={{
            background: `linear-gradient(to right, #fca5a5 0%, #fcd34d 50%, #86efac 75%, #10b981 100%)`
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>C1</span>
          <span>C5</span>
          <span>C10</span>
        </div>
      </div>

      {/* Selected Condition */}
      <div className="p-3 sm:p-4 bg-gray-50 rounded-md">
        <div className="text-base sm:text-lg font-semibold text-gray-900">{conditionLabels[condition]}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">Selected condition grade</div>
      </div>
    </div>
  );
}
