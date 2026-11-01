import React from 'react';

interface PlatformBadgeProps {
  platform: 'leetcode' | 'codeforces' | 'codechef';
  handle?: string;
  count: number;
  isAdmin?: boolean;
}

export default function PlatformBadge({ platform, handle, count, isAdmin = false }: PlatformBadgeProps) {
  // If the user does not have an account on this platform, do not render a misleading badge
  if (!handle || handle.trim() === '') {
    return null;
  }

  const configs = {
    leetcode: {
      name: 'LeetCode',
      bgColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      tagColor: 'text-amber-500',
      dotColor: 'bg-amber-400',
      url: `https://leetcode.com/u/${handle}`,
    },
    codeforces: {
      name: 'Codeforces',
      bgColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      tagColor: 'text-blue-500',
      dotColor: 'bg-blue-400',
      url: `https://codeforces.com/profile/${handle}`,
    },
    codechef: {
      name: 'CodeChef',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      tagColor: 'text-emerald-500',
      dotColor: 'bg-emerald-400',
      url: `https://www.codechef.com/users/${handle}`,
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
      {isAdmin ? (
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-300 hover:text-white underline decoration-dotted ml-1 transition-colors"
          title={`Admin view: ${handle} on ${config.name}`}
        >
          @{handle}
        </a>
      ) : (
        <span className="text-xs text-slate-300 ml-1 select-none">
          @{handle}
        </span>
      )}
    </div>
  );
}
