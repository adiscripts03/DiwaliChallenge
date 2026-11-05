import React from 'react';

interface PlatformBadgeProps {
  platform: 'leetcode' | 'codeforces' | 'codechef';
  handle?: string;
  count: number;
}

export default function PlatformBadge({ platform, handle, count }: PlatformBadgeProps) {
  // If the user does not have an account on this platform, do not render
  if (!handle || handle.trim() === '') {
    return null;
  }

  const platformConfig = {
    leetcode: {
      short: 'LC',
      label: 'LeetCode',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
    },
    codeforces: {
      short: 'CF',
      label: 'Codeforces',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/10',
    },
    codechef: {
      short: 'CC',
      label: 'CodeChef',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
    },
  }[platform];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 border ${platformConfig.border} text-xs sm:text-sm select-none shadow-sm transition-transform hover:scale-105`}>
      <span className={`${platformConfig.text} font-bold`}>{platformConfig.short}:</span>
      <span className="text-white font-black tabular-nums">{count}</span>
      <span className="text-slate-400 text-[11px] sm:text-xs font-mono">(@{handle})</span>
    </span>
  );
}
