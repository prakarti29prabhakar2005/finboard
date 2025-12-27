'use client';

import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Show splash for 2.5 seconds, then start exit animation
    const timer = setTimeout(() => {
      setIsExiting(true);
      // Remove from DOM after exit animation (500ms)
      setTimeout(() => setIsVisible(false), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-black transition-all duration-500 ease-in-out",
        isExiting ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      )}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
            {/* Outer Glow Ring */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-2xl animate-pulse" />
            
            <div className="relative h-20 w-20 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-in zoom-in spin-in-12 duration-700">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2.5" 
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                </svg>
            </div>
        </div>

        {/* Text Area */}
        <div className="text-center overflow-hidden">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight animate-in slide-in-from-bottom-4 duration-700 delay-200 fill-mode-both">
                Build Your Finance Dashboard
            </h1>

        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-12 text-[10px] text-gray-400 dark:text-gray-600 font-mono tracking-widest uppercase animate-in fade-in duration-1000 delay-700 fill-mode-both">
        v0.1.0 • Global Markets
      </div>

      <style jsx global>{`
        @keyframes spin-in-12 {
            from { transform: rotate(-12deg) scale(0.9); }
            to { transform: rotate(0deg) scale(1); }
        }
      `}</style>
    </div>
  );
}
