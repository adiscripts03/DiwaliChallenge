import React from 'react';
import { Crown, Medal, Award, Flame } from 'lucide-react';
import PlatformBadge from './PlatformBadge';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  handles: {
    leetcode: string;
    codeforces: string;
    codechef: string;
  };
  stats: {
    todaySolved: number;
    leetcode: number;
    codeforces: number;
    codechef: number;
    lastUpdated: string;
  };
}

interface PodiumProps {
  topThree: LeaderboardUser[];
}

function renderUserBadges(user: LeaderboardUser) {
  const hasHandles =
    Boolean(user.handles?.leetcode?.trim()) ||
    Boolean(user.handles?.codeforces?.trim()) ||
    Boolean(user.handles?.codechef?.trim());

  if (!hasHandles) {
    return <span className="text-[11px] text-slate-500 italic">No platforms linked</span>;
  }

  return (
    <>
      <PlatformBadge
        platform="leetcode"
        handle={user.handles?.leetcode}
        count={user.stats?.leetcode || 0}
      />
      <PlatformBadge
        platform="codeforces"
        handle={user.handles?.codeforces}
        count={user.stats?.codeforces || 0}
      />
      <PlatformBadge
        platform="codechef"
        handle={user.handles?.codechef}
        count={user.stats?.codechef || 0}
      />
    </>
  );
}

export default function Podium({ topThree }: PodiumProps) {
  if (!topThree || topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="w-full my-8">
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 max-w-4xl mx-auto pt-6">
        {/* 2nd Place */}
        {second && (
          <div className="w-full md:w-1/3 order-2 md:order-1 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-lg shadow-slate-500/20 mb-3 relative group">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-xl text-slate-200">
                {second.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                2
              </div>
            </div>

            <div className="text-center mb-2">
              <h3 className="font-bold text-slate-100 text-base">{second.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mt-0.5">
                <Medal className="w-3.5 h-3.5 text-slate-400" />
                <span>Silver Medalist</span>
              </div>
            </div>

            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-t-2xl p-4 flex flex-col items-center shadow-xl">
              <div className="text-3xl font-extrabold text-white mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-6 h-6 text-amber-500" />
                <span>{second.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved today</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {renderUserBadges(second)}
              </div>
            </div>
          </div>
        )}

        {/* 1st Place */}
        {first && (
          <div className="w-full md:w-1/3 order-1 md:order-2 flex flex-col items-center z-10">
            <div className="relative mb-3">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-amber-400 drop-shadow-md" />
              </div>
              <div className="w-20 h-20 rounded-2xl bg-amber-400 p-0.5 shadow-2xl shadow-amber-500/20">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-2xl text-amber-400">
                  {first.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg border-2 border-slate-900">
                1
              </div>
            </div>

            <div className="text-center mb-2">
              <h3 className="font-extrabold text-white text-lg">{first.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-semibold mt-0.5">
                <Crown className="w-3.5 h-3.5" />
                <span>Daily Champion</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 border-2 border-amber-500/40 rounded-t-2xl p-5 flex flex-col items-center shadow-2xl shadow-amber-500/10">
              <div className="text-4xl font-black text-amber-400 mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-7 h-7 text-amber-500" />
                <span>{first.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved today</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {renderUserBadges(first)}
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third && (
          <div className="w-full md:w-1/3 order-3 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/30 border border-amber-600/50 p-0.5 mb-3 relative group">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-xl text-amber-300">
                {third.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                3
              </div>
            </div>

            <div className="text-center mb-2">
              <h3 className="font-bold text-slate-100 text-base">{third.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-300 text-xs font-semibold mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Bronze Medalist</span>
              </div>
            </div>

            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-t-2xl p-4 flex flex-col items-center shadow-xl">
              <div className="text-3xl font-extrabold text-white mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-6 h-6 text-amber-500" />
                <span>{third.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved today</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {renderUserBadges(third)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
