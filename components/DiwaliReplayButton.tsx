'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export default function DiwaliReplayButton() {
  const handleReplay = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-diwali-greeting'));
    }
  };

  return (
    <button
      onClick={handleReplay}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 shadow-sm"
      title="View Sacred Diwali Greeting & Blessings"
    >
      <Sparkles className="w-3 h-3 text-amber-400" />
      <span>🪔 Happy Diwali Greeting</span>
    </button>
  );
}

