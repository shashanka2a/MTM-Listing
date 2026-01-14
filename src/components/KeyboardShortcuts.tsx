'use client';

import React, { useEffect, useState } from 'react';
import { Command, X } from 'lucide-react';

interface Shortcut {
  key: string;
  description: string;
  action?: () => void;
}

interface KeyboardShortcutsProps {
  shortcuts: Shortcut[];
}

export function KeyboardShortcuts({ shortcuts }: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help with Cmd/Ctrl + ?
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setShowHelp(!showHelp);
      }

      // Execute shortcuts
      shortcuts.forEach(shortcut => {
        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && (e.metaKey || e.ctrlKey)) {
          if (shortcut.action) {
            e.preventDefault();
            shortcut.action();
          }
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, showHelp]);

  if (!showHelp) {
    return (
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors z-40 no-print"
        title="Keyboard shortcuts (Cmd + /)"
      >
        <Command className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[80vh] overflow-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{shortcut.description}</span>
                <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono font-semibold text-gray-900">
                  ⌘ + {shortcut.key.toUpperCase()}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">Show this help</span>
              <kbd className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-xs font-mono font-semibold text-gray-900">
                ⌘ + /
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
