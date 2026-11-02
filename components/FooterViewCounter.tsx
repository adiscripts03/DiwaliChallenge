'use client';

import React, { useEffect, useState } from 'react';
import { Eye, Flame } from 'lucide-react';

export default function FooterViewCounter() {
  const [views, setViews] = useState<{ totalViews: number; todayViews: number } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function initViews() {
      try {
        const viewed = typeof window !== 'undefined' ? sessionStorage.getItem('gdg_view_session') : null;
        const method = viewed ? 'GET' : 'POST';
        const res = await fetch('/api/views', { method, cache: 'no-store' });
        const data = await res.json();
        if (isMounted && data && typeof data.totalViews === 'number') {
          setViews(data);
          if (!viewed) {
            sessionStorage.setItem('gdg_view_session', 'true');
          }
        }
      } catch {
        // Silently fail gracefully
      }
    }

    initViews();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!views) return null;

  return (
    <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-slate-900/90 border border-slate-800/80 text-xs text-slate-400 shadow-sm backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-extrabold text-white tabular-nums">
          {views.totalViews.toLocaleString()}
        </span>
        <span className="text-[11px] text-slate-400">total views</span>
      </div>
      <span className="text-slate-700 font-bold select-none">•</span>
      <div className="flex items-center gap-1.5">
        <Flame className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        <span className="font-extrabold text-amber-300 tabular-nums">
          +{views.todayViews.toLocaleString()}
        </span>
        <span className="text-[11px] text-slate-400">today</span>
      </div>
    </div>
  );
}

