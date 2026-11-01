import React from 'react';

interface PlatformBadgeProps {
  platform: 'leetcode' | 'codeforces' | 'codechef';
  handle?: string;
  count: number;
}

export default function PlatformBadge({ platform, handle, count }: PlatformBadgeProps) {
  // If the user does not have an account on this platform, do not render a misleading badge
  if (!handle || handle.trim() === '') {
    return null;
  }

  const configs = {
    leetcode: {
      name: 'LeetCode',
      bgColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      dotColor: 'bg-amber-400',
    },
    codeforces: {
      name: 'Codeforces',
      bgColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      dotColor: 'bg-blue-400',
    },
    codechef: {
      name: 'CodeChef',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      dotColor: 'bg-emerald-400',
    },
  };

  const config = configs[platform];

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs border font-medium ${config.bgColor}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
      <span className="font-semibold">{config.name}:</span>
      <span className="font-bold text-white tabular-nums">{count}</span>
      <span className="text-xs text-slate-300 ml-1 select-none">
        @{handle}
      </span>
    </div>
  );
}
