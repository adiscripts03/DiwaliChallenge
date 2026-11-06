'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, AlertTriangle, ArrowRight, Sparkles, X, ChevronDown } from 'lucide-react';

interface CountdownState {
  dayNumber: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isOver: boolean;
}

function calculateCountdown(): CountdownState {
  const now = new Date();
  
  // Format current date in IST (Asia/Kolkata)
  const istDateStr = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  const startDate = '2026-11-03';
  const startMs = new Date(`${startDate}T00:00:00+05:30`).getTime();
  const currentDayStartMs = new Date(`${istDateStr}T00:00:00+05:30`).getTime();
  const diffDays = Math.floor((currentDayStartMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
  const dayNumber = Math.min(Math.max(1, diffDays), 10);

  // Midnight (11:59:59.999 PM IST) of today
  const endOfDayIST = new Date(`${istDateStr}T23:59:59.999+05:30`).getTime();
  const diffMs = Math.max(0, endOfDayIST - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    dayNumber,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isOver: diffDays > 10,
  };
}

export default function DailySyncReminderBanner() {
  const [countdown, setCountdown] = useState<CountdownState | null>(null);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!countdown || countdown.isOver) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const isUrgent = countdown.hours < 2; // Under 2 hours remaining today

  if (minimized) {
    return (
      <aside aria-label="Daily sync status" className="bg-[#1a120b] border-b border-amber-900/40 px-4 py-1.5 text-xs text-amber-200/90 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>
            <strong>Day {countdown.dayNumber} of 10</strong> • Sync Cutoff in{' '}
            <span className="font-mono font-bold text-amber-400">
              {pad(countdown.hours)}:{pad(countdown.minutes)}:{pad(countdown.seconds)}
            </span>
          </span>
        </div>
        <button
          onClick={() => setMinimized(false)}
          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 underline decoration-dotted"
        >
          <span>Expand Notice</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Daily sync notice"
      className={`relative border-b transition-colors ${
        isUrgent
          ? 'banner-sync-urgent bg-gradient-to-r from-rose-950/90 via-amber-950/90 to-rose-950/90 border-rose-500/40 text-rose-100'
          : 'banner-sync-normal bg-gradient-to-r from-amber-950/80 via-[#1c130b]/90 to-amber-950/80 border-amber-500/30 text-amber-100'
      } backdrop-blur-md px-4 sm:px-6 py-2.5 shadow-lg`}
    >
      <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Message & Day Indicator */}
        <div className="flex items-center space-x-3 text-center md:text-left">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isUrgent
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400 animate-pulse'
                : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
            }`}
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4" />
            ) : (
              <Clock className="w-4 h-4" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                isUrgent
                  ? 'bg-rose-500 text-slate-950'
                  : 'bg-amber-400 text-slate-950'
              }`}
            >
              Day {countdown.dayNumber} of 10
            </span>
            <span className="font-semibold text-white mt-0.5 sm:mt-0">
              {isUrgent
                ? '⚠️ Nightly Sync Cutoff is Near!'
                : 'Mandatory Nightly Progress Sync:'}
            </span>
            <span className="text-slate-300 hidden sm:inline text-xs">
              Solves must be synced every night before 11:59 PM IST. Unsynced questions won&apos;t count!
            </span>
          </div>
        </div>

        {/* Right: Digital Timer & Action Button */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-slate-400 hidden xs:inline uppercase tracking-wider font-semibold">
              Today&apos;s Cutoff:
            </span>
            <div className="font-mono font-black text-amber-300 text-sm tracking-widest tabular-nums flex items-center">
              <span>{pad(countdown.hours)}</span>
              <span className="animate-pulse mx-0.5">:</span>
              <span>{pad(countdown.minutes)}</span>
              <span className="animate-pulse mx-0.5">:</span>
              <span>{pad(countdown.seconds)}</span>
            </div>
          </div>

          <Link
            href="/profile"
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            <span>Sync Solves Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => setMinimized(true)}
            title="Minimize banner"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
