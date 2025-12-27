import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DashboardState, Widget } from '@/types';
import { generateId } from '@/lib/utils';

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      widgets: [],
      isEditMode: true, // Start in edit mode to help user
      theme: 'dark', // Default to dark as per design
      editingWidget: null,
      
      addWidget: (widgetData) => set((state) => ({
        widgets: [...state.widgets, { ...widgetData, id: generateId() }]
      })),

      removeWidget: (id) => set((state) => ({
        widgets: state.widgets.filter((w) => w.id !== id)
      })),

      updateWidget: (id, updates) => set((state) => ({
        widgets: state.widgets.map((w) => (w.id === id ? { ...w, ...updates } : w))
      })),

      reorderWidgets: (newOrder) => set(() => ({
          widgets: newOrder
      })),

      toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
      
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setEditingWidget: (widget) => set(() => ({ editingWidget: widget })),

      setWidgets: (widgets) => set(() => ({ widgets })),
    }),
    {
      name: 'finboard-storage',
      partialize: (state) => ({ 
          widgets: state.widgets, 
          theme: state.theme,
          // Don't persist isEditMode or editingWidget
      }),
    }
  )
);
