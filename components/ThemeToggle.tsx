'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-slate-800 bg-slate-900/60" />
    );
  }

  const isLight = theme === 'light';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      className="theme-toggle-btn relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-400/40 hover:scale-105 active:scale-95 shadow-sm"
    >
      {isLight ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 transition-transform duration-300 rotate-0" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 transition-transform duration-300 rotate-0" />
      )}
    </button>
  );
}

