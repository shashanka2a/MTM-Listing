import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  progress?: number;
}

export function LoadingState({ message = 'Loading...', progress }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="relative">
        <Loader2 className="w-12 h-12 text-[#8b4513] animate-spin" />
      </div>
      <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
      {progress !== undefined && (
        <div className="mt-4 w-64">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8b4513] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">{progress}%</p>
        </div>
      )}
    </div>
  );
}
