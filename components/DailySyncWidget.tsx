'use client';

import React from 'react';
import Link from 'next/link';
import { Trophy, Sparkles, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export default function DailySyncWidget() {
  return (
    <div className="daily-sync-card relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17100a] via-[#1f150d] to-[#17100a] border border-amber-500/30 p-6 sm:p-8 shadow-xl backdrop-blur-md">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-2.5 text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Challenge Completed • Final Standings Locked</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            The 10-Day GDG Diwali Coding Challenge has Ended!
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
            All problem solves across LeetCode, Codeforces, and CodeChef have been officially recorded. Syncing is now closed and rankings are permanently frozen. Share your verified rank card on LinkedIn!
          </p>
        </div>

        {/* Right: CTA & Status */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <div className="flex items-center space-x-2 px-4 py-3 rounded-2xl bg-black/60 border border-amber-500/25 text-amber-300 text-xs font-semibold">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Scores Final & Frozen</span>
          </div>

          <Link
            href="/profile"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:scale-[1.02] text-slate-950 shadow-lg shadow-amber-500/25 transition-all w-full sm:w-auto justify-center cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-slate-950" />
            <span>Generate Rank Card</span>
            <ChevronRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
      </div>
    </div>
  );
}
