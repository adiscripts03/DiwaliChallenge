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

  const shortNames = {
    leetcode: 'LC',
    codeforces: 'CF',
    codechef: 'CC',
  };

  return (
    <span className="inline-flex items-center text-xs text-amber-100/75 mr-3 py-0.5 select-none font-normal">
      <span className="text-amber-400/90 font-semibold mr-1">{shortNames[platform]}:</span>
      <span className="text-white font-bold tabular-nums mr-1.5">{count}</span>
      <span className="text-amber-200/40 text-[11px] font-mono">(@{handle})</span>
    </span>
  );
}
