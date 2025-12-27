import { useWidgetData } from '@/hooks/useWidgetData';
import { Widget } from '@/types';
import { Loader2 } from 'lucide-react';

interface WidgetProps {
  widget: Widget;
  data: any;
  isLoading: boolean;
  error: any;
  dataUpdatedAt: number;
}

export function CardWidget({ widget, data, isLoading, error, dataUpdatedAt }: WidgetProps) {

  if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-gray-500" /></div>;
  if (error) return <div className="text-red-500 text-sm">Error loading data</div>;

  // Initial assumption: user selected a path that resolves to a primitive or user wants to show a specific field
  let displayValue = data;
  
  if (typeof data === 'object' && data !== null) {
      // If still an object, try to find a 'value' or 'price' or 'close' common field, otherwise JSON stringify
      // For MVP we just dump it if it's complex, or show a warning
      displayValue = JSON.stringify(data).slice(0, 50);
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
        {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 font-medium">
        {widget.dataConfig.labelField || 'Latest Value'}
      </p>
      <div className="mt-auto pt-2 w-full text-center text-[10px] text-gray-400 dark:text-gray-600 font-mono">
        Last updated: {dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : 'Never'}
      </div>
    </div>
  );
}
