import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={cn("relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 shadow-2xl", className)}>
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 flex-1 overflow-hidden flex flex-col">
            {children}
        </div>
      </div>
    </div>
  );
}
