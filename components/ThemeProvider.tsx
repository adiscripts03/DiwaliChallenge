'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('gdg_theme') as Theme | null;
      if (saved === 'light' || saved === 'dark') {
        setThemeState(saved);
        applyTheme(saved);
      } else {
        // Default to dark mode (the signature Diwali theme)
        setThemeState('dark');
        applyTheme('dark');
      }
    } catch {
      // fallback
    }
  }, []);

  const applyTheme = (t: Theme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (t === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem('gdg_theme', t);
    } catch {}
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';

    // Check if View Transitions API is supported and user hasn't requested reduced motion
    const canAnimate =
      typeof document !== 'undefined' &&
      typeof (document as any).startViewTransition === 'function' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canAnimate) {
      setTheme(next);
      return;
    }

    // Default origin: top-right corner if no event target is available
    let x = typeof window !== 'undefined' ? window.innerWidth - 40 : 0;
    let y = 30;

    if (e) {
      const target = (e.currentTarget || e.target) as HTMLElement;
      if (target?.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        x = rect.left + rect.width / 2;
        y = rect.top + rect.height / 2;
      } else if (e.clientX !== undefined && e.clientY !== undefined) {
        x = e.clientX;
        y = e.clientY;
      }
    }

    // Calculate distance to the farthest corner (usually bottom-left)
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = (document as any).startViewTransition(() => {
      setTheme(next);
    });

    transition.ready
      .then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ];

        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration: 550,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      })
      .catch(() => {});
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

