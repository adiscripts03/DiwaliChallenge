'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Trophy, Sparkles, ChevronRight, X } from 'lucide-react';

export default function DailySyncReminderBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside
      aria-label="Challenge concluded notice"
      className="relative bg-gradient-to-r from-amber-950/90 via-[#1c130b]/95 to-amber-950/90 border-b border-amber-500/30 text-amber-100 backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Festive celebration badge + message */}
        <div className="flex items-center space-x-2.5 text-center sm:text-left">
          <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-amber-300 mr-2 uppercase tracking-wide">
              🎉 Challenge Completed!
            </span>
            <span className="text-amber-100/90">
              The 10-day GDG Diwali Challenge has officially concluded and final standings are locked. Thank you for participating!
            </span>
          </div>
        </div>

        {/* Right: Generate Rank Card CTA */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.03] transition-all"
          >
            <Trophy className="w-3.5 h-3.5 text-slate-950" />
            <span>Generate Rank Card</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-950" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="p-1 rounded-lg text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
