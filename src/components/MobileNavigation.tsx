import React from 'react';
import { Upload, Eye, Download, Menu } from 'lucide-react';

interface MobileNavigationProps {
  currentStep: 'upload' | 'review' | 'export';
  onNavigate: (step: 'upload' | 'review' | 'export') => void;
}

export function MobileNavigation({ currentStep, onNavigate }: MobileNavigationProps) {
  const steps = [
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'review' as const, label: 'Review', icon: Eye },
    { id: 'export' as const, label: 'Export', icon: Download },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-40 safe-area-inset-bottom">
      <div className="grid grid-cols-3 gap-1 p-2">
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          
          return (
            <button
              key={step.id}
              onClick={() => onNavigate(step.id)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#8b4513] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{step.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
