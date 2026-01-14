import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConditionGradingProps {
  condition: number;
  onConditionChange: (condition: number) => void;
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

const evidence = [
  { text: 'Minor wheel wear', status: 'warning' },
  { text: 'Clean shell', status: 'success' },
  { text: 'Original box present', status: 'success' },
  { text: 'All parts functioning', status: 'success' },
];

export function ConditionGrading({ condition, onConditionChange }: ConditionGradingProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-semibold text-gray-900">
          Condition Grading
        </label>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">
          <span>AI Suggested: {conditionLabels[condition]}</span>
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
          className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 via-green-300 to-emerald-500 rounded-lg appearance-none cursor-pointer slider"
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
      <div className="mb-4 p-4 bg-gray-50 rounded-md">
        <div className="text-lg font-semibold text-gray-900">{conditionLabels[condition]}</div>
        <div className="text-sm text-gray-600 mt-1">Selected condition grade</div>
      </div>

      {/* Evidence */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-700 mb-2">Evidence:</div>
        <ul className="space-y-2">
          {evidence.map((item, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              {item.status === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              )}
              <span className={item.status === 'success' ? 'text-gray-700' : 'text-amber-700'}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Seller Notes */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Auto Seller Notes
        </label>
        <textarea
          defaultValue="This HO scale Bowser Executive Line locomotive is in excellent condition (C7). The unit features a clean shell with only minor wheel wear from light use. Original box is included and shows typical shelf wear. All functions have been tested and work properly."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[#8b4513] focus:border-transparent resize-none"
        />
      </div>
    </div>
  );
}
