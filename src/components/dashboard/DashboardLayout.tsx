'use client';

import { useState, useEffect } from 'react';
import { AddWidgetModal } from './AddWidgetModal';
import { DashboardControls } from './DashboardControls';
import { Button } from '@/components/ui/button';
import { Plus, Sun, Moon, Settings } from 'lucide-react';
import { WidgetGrid } from './WidgetGrid';
import { useDashboardStore } from '@/store/useDashboardStore';

export default function DashboardLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { widgets, theme, toggleTheme, editingWidget } = useDashboardStore();

  // Sync modal state with editing state
  useEffect(() => {
    if (editingWidget) {
        setIsModalOpen(true);
    }
  }, [editingWidget]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Prevent hydration mismatch for theme
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight">
                Finance Dashboard
                </h1>
                <p className="text-xs text-gray-500 font-medium flex items-center gap-2">
                    {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} 
                    <span className="hidden md:inline-flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-gray-600"></span> 
                        Real-time data
                    </span>
                </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-transparent border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="bg-transparent border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
              title="Dashboard Settings & Templates"
            >
              <Settings size={18} />
            </Button>
            
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-lg shadow-emerald-600/20">
              <Plus size={18} /> <span className="hidden md:inline">Add Widget</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
         <WidgetGrid onAddClick={() => setIsModalOpen(true)} />
      </main>

      <AddWidgetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DashboardControls isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}
