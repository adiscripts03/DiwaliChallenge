'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, RefreshCw, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function DailySyncWidget() {
  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  useEffect(() => {
    setCountdown(calculateCountdown());
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!countdown) return null;

  const pad = (n: number) => String(n).padStart(2, '0');
  const isUrgent = countdown.hours < 2;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#17100a] via-[#1f150d] to-[#17100a] border border-amber-500/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-2 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Day {countdown.dayNumber} of 10 • Nightly Sync Deadline</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white">
            Daily Progress Tracking Notice
          </h3>
          <p className="text-xs sm:text-sm text-amber-100/70 max-w-3xl">
            Manually sync all solved questions on the website every night before going to sleep. Only synced questions will count towards the leaderboard — unsynced questions will <span className="text-amber-400 font-bold underline">not</span> be considered!
          </p>
        </div>

        {/* Right: Digital Countdown Clocks */}
        <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-amber-400 shadow-inner">
                {pad(countdown.hours)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Hours
              </span>
            </div>

            <span className="font-mono font-black text-xl text-amber-400/80 -mt-5">:</span>

            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-amber-400 shadow-inner">
                {pad(countdown.minutes)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Mins
              </span>
            </div>

            <span className="font-mono font-black text-xl text-amber-400/80 -mt-5">:</span>

            <div className="flex flex-col items-center">
              <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center justify-center font-mono font-black text-xl sm:text-2xl text-amber-400 shadow-inner">
                {pad(countdown.seconds)}
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                Secs
              </span>
            </div>
          </div>

          <Link
            href="/profile"
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl font-black text-xs bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:scale-[1.02] text-slate-950 shadow-lg shadow-amber-500/25 transition-all self-stretch sm:self-auto justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Open Profile to Sync</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
