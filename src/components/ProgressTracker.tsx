import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface ProgressTrackerProps {
  steps: Step[];
}

export function ProgressTracker({ steps }: ProgressTrackerProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                step.status === 'complete' 
                  ? 'bg-[#8b4513] border-[#8b4513]' 
                  : step.status === 'current'
                  ? 'border-[#8b4513] bg-white'
                  : 'border-gray-300 bg-white'
              }`}>
                {step.status === 'complete' ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className={`text-sm font-semibold ${
                    step.status === 'current' ? 'text-[#8b4513]' : 'text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${
                step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-0.5 mx-2 ${
                steps[index + 1].status === 'complete' || steps[index].status === 'complete'
                  ? 'bg-[#8b4513]'
                  : 'bg-gray-300'
              }`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
