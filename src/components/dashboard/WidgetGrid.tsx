'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { DraggableWidget } from './DraggableWidget';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  rectSortingStrategy 
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

interface WidgetGridProps {
    onAddClick: () => void;
}

export function WidgetGrid({ onAddClick }: WidgetGridProps) {
  const { widgets, reorderWidgets } = useDashboardStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
        const oldIndex = widgets.findIndex((w) => w.id === active.id);
        const newIndex = widgets.findIndex((w) => w.id === over?.id);
        reorderWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  if(!widgets.length) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in fade-in zoom-in duration-500">
              <div className="h-16 w-16 bg-gray-900 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-gray-950/50">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h2 className="text-xl font-medium text-gray-200 mb-2">Build Your Finance Dashboard</h2>
              <p className="text-gray-500 max-w-md mb-8">Create custom widgets by connecting to any finance API. Track stocks, crypto, forex, or economic indicators - all in real-time.</p>
              
              <button 
                onClick={onAddClick}
                className="group relative flex flex-col items-center justify-center w-full max-w-xs h-32 rounded-xl border-2 border-dashed border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 hover:border-emerald-500/50 transition-all duration-300"
              >
                 <div className="h-10 w-10 rounded-full bg-gray-800 group-hover:bg-emerald-600/20 flex items-center justify-center mb-2 transition-colors">
                    <Plus size={20} className="text-gray-400 group-hover:text-emerald-500" />
                 </div>
                 <span className="text-sm font-medium text-gray-400 group-hover:text-emerald-400">Create your first widget</span>
              </button>
          </div>
      )
  }

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={widgets.map(w => w.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4 pb-20">
          {widgets.map((widget) => (
            <DraggableWidget key={widget.id} widget={widget} />
          ))}
          
          {/* Add Widget Ghost Card */}
          <div 
          onClick={onAddClick}
          className="h-full min-h-[200px] flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 dark:border-emerald-500/20 rounded-xl bg-emerald-50/50 dark:bg-emerald-500/5 hover:bg-emerald-100/50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer group"
        >
          <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-500 group-hover:scale-110 transition-transform duration-300">
            <Plus size={24} />
          </div>
          <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">Add Widget</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 text-center max-w-[200px]">
            Connect to a finance API and create a custom widget
          </p>
        </div>
        </div>
      </SortableContext>
    </DndContext>
  );
}
