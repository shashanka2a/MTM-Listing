import React, { useMemo, useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';

interface EvidenceItem {
  text: string;
  status: 'success' | 'warning' | 'error';
}

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
  conditionNotes = '', 
  onConditionNotesChange,
  features = [],
  defects = [],
  onFeaturesChange,
  onDefectsChange,
  isAiGenerated
}: ConditionGradingProps) {
  const [featuresText, setFeaturesText] = useState(features.join('\n'));
  const [defectsText, setDefectsText] = useState(defects.join('\n'));
  useEffect(() => {
    setFeaturesText(features.join('\n'));
  }, [JSON.stringify(features)]);
  useEffect(() => {
    setDefectsText(defects.join('\n'));
  }, [JSON.stringify(defects)]);

  const syncFeatures = () => {
    const lines = featuresText.split('\n').map(s => s.trim()).filter(Boolean);
    onFeaturesChange?.(lines);
  };
  const syncDefects = () => {
    const lines = defectsText.split('\n').map(s => s.trim()).filter(Boolean);
    onDefectsChange?.(lines);
  };

  // Generate evidence from features and defects (for display bullets)
  const evidence = useMemo((): EvidenceItem[] => {
    const items: EvidenceItem[] = [];
    features.forEach(feature => items.push({ text: feature, status: 'success' }));
    defects.forEach(defect => items.push({ text: defect, status: 'warning' }));
    if (items.length === 0) {
      return [{ text: 'Upload photos for AI condition analysis', status: 'success' }];
    }
    return items;
  }, [features, defects]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <label className="block text-sm font-semibold text-gray-900">
            Condition Grading
          </label>
          {isAiGenerated && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-medium">
              <Sparkles className="w-3 h-3" />
              AI Assessed
            </span>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium bg-blue-50 text-blue-700 rounded-md self-start sm:self-auto">
          <span>{isAiGenerated ? 'AI Suggested:' : 'Grade:'} {conditionLabels[condition]}</span>
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
      <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded-md">
        <div className="text-base sm:text-lg font-semibold text-gray-900">{conditionLabels[condition]}</div>
        <div className="text-xs sm:text-sm text-gray-600 mt-1">Selected condition grade</div>
      </div>

      {/* Evidence – editable (detected from images, can be changed) */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-700 mb-2">
          Evidence from images (editable; changes are saved with the listing):
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Features — one per line</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              onBlur={syncFeatures}
              placeholder="e.g. Metal wheels&#10;Detailed underframe"
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-y"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Defects — one per line</label>
            <textarea
              value={defectsText}
              onChange={(e) => setDefectsText(e.target.value)}
              onBlur={syncDefects}
              placeholder="e.g. Minor paint chip&#10;One coupler loose"
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-y"
            />
          </div>
        </div>
        {evidence.length > 0 && (features.length > 0 || defects.length > 0) && (
          <ul className="mt-2 space-y-1 text-xs sm:text-sm text-gray-600">
            {evidence.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                {item.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                )}
                <span className={item.status === 'success' ? 'text-gray-700' : 'text-amber-700'}>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Seller Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Auto Seller Notes
        </label>
        <textarea
          value={conditionNotes}
          onChange={(e) => onConditionNotesChange?.(e.target.value)}
          placeholder="AI will generate condition notes based on your photos..."
          rows={4}
          className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none ${
            isAiGenerated && conditionNotes ? 'border-purple-200 bg-purple-50' : 'border-gray-300'
          }`}
        />
      </div>
    </div>
  );
}
