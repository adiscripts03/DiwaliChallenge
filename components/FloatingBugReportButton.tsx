'use client';

import React, { useState } from 'react';
import { Bug } from 'lucide-react';
import BugReportModal from '@/components/BugReportModal';

export default function FloatingBugReportButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        title="Report a bug or problem to Aditya"
        aria-label="Report a bug"
        className="floating-bug-btn fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center space-x-2 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl backdrop-blur-md group"
      >
        <span className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/25 group-hover:scale-110 transition-all shrink-0">
          <Bug className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        </span>
        <span className="font-bold">Report Bug</span>
      </button>

      <BugReportModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
