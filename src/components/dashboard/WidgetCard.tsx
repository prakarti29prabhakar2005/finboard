import { Widget } from '@/types';
import { CardWidget } from '../widgets/CardWidget';
import { TableWidget } from '../widgets/TableWidget';
import { ChartWidget } from '../widgets/ChartWidget';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import { MoreVertical, GripVertical, Trash2, LayoutTemplate, Maximize2, Minimize2, RefreshCw } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useWidgetData } from '@/hooks/useWidgetData';
import { cn } from '@/lib/utils'; // Added cn import

interface WidgetCardProps {
  widget: Widget;
  dragHandleProps?: any; // props from dnd-kit
}

export function WidgetCard({ widget, dragHandleProps }: WidgetCardProps) {
  const { removeWidget, updateWidget, setEditingWidget } = useDashboardStore();
  const [showSettings, setShowSettings] = useState(false); // Settings dropdown visibility

  // Lifted data fetching
  const { data, isLoading, error, refetch, isRefetching, dataUpdatedAt } = useWidgetData(widget, widget.apiEndpoint);

  // Remove live indicator (isLive) as it's not provided by hook
  const isLive = false; // Placeholder live indicator

  const toggleWidth = () => {
    const current = widget.layout?.w || 1;
    // Cycle: 1 -> 2 -> 4 -> 1
    const next = current === 1 ? 2 : current === 2 ? 4 : 1;
    updateWidget(widget.id, { layout: { ...widget.layout, w: next, h: widget.layout?.h || 1 } });
  };
  
  const toggleHeight = () => {
      const current = widget.layout?.h || 1;
      // Cycle: 1 (Standard) -> 2 (Tall) -> 1
      const next = current === 1 ? 2 : 1;
      updateWidget(widget.id, { layout: { ...widget.layout, h: next, w: widget.layout?.w || 1 } });
  };

  const renderWidgetContent = () => {
    const commonProps = { widget, data, isLoading, error, dataUpdatedAt };
    
    switch (widget.type) {
      case 'card': return <CardWidget {...commonProps} />;
      case 'table': return <TableWidget {...commonProps} />;
      case 'chart': return <ChartWidget {...commonProps} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-3 py-2 bg-gray-100/50 dark:bg-gray-900/50">
        <div className="flex items-center gap-2">
            <div {...dragHandleProps} className="cursor-grab hover:text-gray-900 dark:hover:text-white text-gray-400 dark:text-gray-500 active:cursor-grabbing">
                <GripVertical size={16} />
            </div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[150px]" title={widget.title}>
                {widget.title}
            </h3>
            {isLive && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
            )}
        </div>
        <div className="flex items-center gap-1 relative">

             <Button 
                variant="ghost" 
                size="sm" 
                className={cn("h-6 w-6 p-0 text-gray-400 hover:text-gray-900 dark:hover:text-white", isRefetching && "animate-spin")} 
                onClick={() => refetch()}
                title="Refresh Data"
             >
                <RefreshCw size={12} />
             </Button>

             <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white"
                onClick={() => setShowSettings(!showSettings)}
             >
                <MoreVertical size={14} />
             </Button>
            
            
            {showSettings && (
                <div className="absolute top-8 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl z-20 w-40 py-1 flex flex-col animate-in fade-in zoom-in-95 duration-100">
                    <button onClick={() => { toggleWidth(); setShowSettings(false); }} className="px-3 py-2 text-xs text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                        <LayoutTemplate size={14} />
                        {widget.layout?.w === 4 ? 'Reset Width' : 'Expand Width'}
                    </button>
                    
                    <button onClick={() => { setEditingWidget(widget); setShowSettings(false); }} className="px-3 py-2 text-xs text-left text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2">
                        <Maximize2 size={14} className="rotate-45" /> Edit Widget
                    </button>

                    <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                    
                    <button onClick={() => removeWidget(widget.id)} className="px-3 py-2 text-xs text-left text-red-500 hover:bg-red-50 dark:hover:bg-gray-800 flex items-center gap-2">
                        <Trash2 size={14} /> Remove
                    </button>
                </div>
            )}
        </div>
      </div>
      <div className="flex-1 min-h-[150px] relative">
        {renderWidgetContent()}
      </div>
    </div>
  );
}
