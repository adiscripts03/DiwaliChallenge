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
  isAdmin?: boolean;
}

function renderUserBadges(user: LeaderboardUser, isAdmin: boolean = false) {
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
        isAdmin={isAdmin}
      />
      <PlatformBadge
        platform="codeforces"
        handle={user.handles?.codeforces}
        count={user.stats?.codeforces || 0}
        isAdmin={isAdmin}
      />
      <PlatformBadge
        platform="codechef"
        handle={user.handles?.codechef}
        count={user.stats?.codechef || 0}
        isAdmin={isAdmin}
      />
    </>
  );
}

export default function Podium({ topThree, isAdmin = false }: PodiumProps) {
  if (!topThree || topThree.length === 0) return null;

  const first = topThree[0];
  const second = topThree[1];
  const third = topThree[2];

  return (
    <div className="w-full my-6">
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 max-w-4xl mx-auto pt-6">
        {/* 2nd Place */}
        {second ? (
          <div className="order-2 md:order-1 flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-lg shadow-slate-500/20 mb-3 relative group">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-xl text-slate-200">
                {second.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-slate-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                2
              </div>
            </div>

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-bold text-slate-100 text-base truncate">{second.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs mt-0.5">
                <Medal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Silver Medalist</span>
              </div>
            </div>

            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl min-h-[170px] justify-between">
              <div className="text-3xl font-extrabold text-white mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-6 h-6 text-amber-500 shrink-0" />
                <span>{second.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(second, isAdmin)}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:block order-1" />
        )}

        {/* 1st Place */}
        {first && (
          <div className="order-1 md:order-2 flex flex-col items-center w-full z-10">
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

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-extrabold text-white text-lg truncate">{first.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs font-semibold mt-0.5">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Champion</span>
              </div>
            </div>

            <div className="w-full bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 flex flex-col items-center shadow-2xl shadow-amber-500/10 min-h-[190px] justify-between">
              <div className="text-4xl font-black text-amber-400 mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-7 h-7 text-amber-500 shrink-0" />
                <span>{first.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(first, isAdmin)}
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third ? (
          <div className="order-3 flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-amber-600/30 border border-amber-600/50 p-0.5 mb-3 relative group">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-bold text-xl text-amber-300">
                {third.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-md border-2 border-slate-900">
                3
              </div>
            </div>

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-bold text-slate-100 text-base truncate">{third.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-300 text-xs font-semibold mt-0.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Bronze Medalist</span>
              </div>
            </div>

            <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col items-center shadow-xl min-h-[170px] justify-between">
              <div className="text-3xl font-extrabold text-white mb-2 flex items-center gap-1.5 tabular-nums">
                <Flame className="w-6 h-6 text-amber-500 shrink-0" />
                <span>{third.stats?.todaySolved || 0}</span>
                <span className="text-xs font-normal text-slate-400">solved</span>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(third, isAdmin)}
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:block order-3" />
        )}
      </div>
    </div>
  );
}
