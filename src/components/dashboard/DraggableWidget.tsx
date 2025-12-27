import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from '@/types';
import { WidgetCard } from './WidgetCard';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { WidgetErrorFallback } from './WidgetErrorFallback';

export function DraggableWidget({ widget }: { widget: Widget }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: widget.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: '100%', 
  };

  return (
    <div 
        ref={setNodeRef} 
        style={style} 
        className={cn(
            "w-full transition-all duration-300",
            // Height mapping
            widget.layout?.h === 2 ? "h-[500px]" : "h-[300px]",
            // Width mapping
            widget.layout?.w === 2 ? "md:col-span-2" : "",
            widget.layout?.w === 4 ? "col-span-full" : ""
        )}
    >
      <ErrorBoundary 
        FallbackComponent={WidgetErrorFallback}
        onReset={() => {
            // Optional: logic to clear cache or reset specific widget state if needed
            // QueryClient reset happens automatically if the button just triggers re-mount
        }}
      >
        <WidgetCard widget={widget} dragHandleProps={{ ...attributes, ...listeners }} />
      </ErrorBoundary>

    </div>
  );
}
