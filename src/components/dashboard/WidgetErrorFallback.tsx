'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WidgetErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function WidgetErrorFallback({ error, resetErrorBoundary }: WidgetErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center bg-red-50/50 dark:bg-red-900/10">
      <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
      <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
        Widget Error
      </h3>
      <p className="text-xs text-red-600 dark:text-red-300/80 mb-3 max-w-[200px] truncate">
        {error.message || 'Failed to render'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 rounded-md transition-colors"
      >
        <RefreshCw size={12} />
        Retry
      </button>
    </div>
  );
}
