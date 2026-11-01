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

  const names = {
    leetcode: 'LeetCode',
    codeforces: 'Codeforces',
    codechef: 'CodeChef',
  };

  return (
    <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs border border-amber-900/30 bg-[#16110a]/90 font-medium text-amber-100/90 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500/70 shrink-0" />
      <span className="text-amber-200/80 font-medium">{names[platform]}:</span>
      <span className="font-bold text-white tabular-nums">{count}</span>
      <span className="text-xs text-amber-100/50 ml-1 select-none font-mono">
        @{handle}
      </span>
    </div>
  );
}
