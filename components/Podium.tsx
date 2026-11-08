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
    totalSolved?: number;
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
        showHandle={false}
      />
      <PlatformBadge
        platform="codeforces"
        handle={user.handles?.codeforces}
        count={user.stats?.codeforces || 0}
        showHandle={false}
      />
      <PlatformBadge
        platform="codechef"
        handle={user.handles?.codechef}
        count={user.stats?.codechef || 0}
        showHandle={false}
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
      <div className="grid grid-cols-1 md:grid-cols-3 items-end gap-6 sm:gap-8 w-full mx-auto pt-6">
        {/* 2nd Place */}
        {second ? (
          <div className="order-2 md:order-1 flex flex-col items-center w-full">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-slate-400 to-slate-200 p-0.5 shadow-xl shadow-slate-500/20 mb-3 relative group">
              <div className="podium-avatar-inner w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-bold text-2xl sm:text-3xl text-slate-200">
                {second.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-black text-xs sm:text-sm shadow-md border-2 border-slate-900">
                2
              </div>
            </div>

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-bold text-slate-100 text-lg sm:text-xl truncate">{second.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-slate-400 text-xs sm:text-sm mt-0.5">
                <Medal className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Silver Medalist</span>
              </div>
            </div>

            <div className="podium-card w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col items-center shadow-xl min-h-[190px] sm:min-h-[210px] justify-between">
              <div className="flex flex-col items-center mb-2">
                <div className="text-3xl sm:text-5xl font-black text-white flex items-center gap-2 tabular-nums">
                  <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 shrink-0" />
                  <span>{second.stats?.totalSolved ?? second.stats?.todaySolved ?? 0}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  {second.stats?.todaySolved > 0 ? `+${second.stats.todaySolved} today` : '0 today'}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(second)}
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
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <Crown className="w-10 h-10 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse" />
              </div>
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-amber-400 p-0.5 shadow-2xl shadow-amber-500/30">
                <div className="podium-avatar-inner w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-black text-3xl sm:text-4xl text-amber-400">
                  {first.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-sm sm:text-base shadow-xl border-2 border-slate-900">
                1
              </div>
            </div>

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-extrabold text-white text-xl sm:text-2xl truncate">{first.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs sm:text-sm font-semibold mt-0.5">
                <Crown className="w-4 h-4 shrink-0" />
                <span>Challenge Leader</span>
              </div>
            </div>

            <div className="podium-first-card w-full bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl shadow-amber-500/15 min-h-[220px] sm:min-h-[240px] justify-between">
              <div className="flex flex-col items-center mb-2">
                <div className="text-4xl sm:text-6xl font-black text-amber-400 flex items-center gap-2 tabular-nums">
                  <Flame className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 shrink-0" />
                  <span>{first.stats?.totalSolved ?? first.stats?.todaySolved ?? 0}</span>
                </div>
                <div className="text-xs sm:text-sm text-amber-300/80 font-semibold mt-1">
                  {first.stats?.todaySolved > 0 ? `+${first.stats.todaySolved} today` : '0 today'}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(first)}
              </div>
            </div>
          </div>
        )}

        {/* 3rd Place */}
        {third ? (
          <div className="order-3 flex flex-col items-center w-full">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-amber-600/30 border border-amber-600/50 p-0.5 mb-3 relative group">
              <div className="podium-avatar-inner w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center font-bold text-2xl sm:text-3xl text-amber-300">
                {third.name.charAt(0)}
              </div>
              <div className="absolute -top-2.5 -right-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-md border-2 border-slate-900">
                3
              </div>
            </div>

            <div className="text-center mb-2 px-2 w-full">
              <h3 className="font-bold text-slate-100 text-lg sm:text-xl truncate">{third.name}</h3>
              <div className="flex items-center justify-center space-x-1 text-amber-300 text-xs sm:text-sm font-semibold mt-0.5">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bronze Medalist</span>
              </div>
            </div>

            <div className="podium-card w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 flex flex-col items-center shadow-xl min-h-[190px] sm:min-h-[210px] justify-between">
              <div className="flex flex-col items-center mb-2">
                <div className="text-3xl sm:text-5xl font-black text-white flex items-center gap-2 tabular-nums">
                  <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 shrink-0" />
                  <span>{third.stats?.totalSolved ?? third.stats?.todaySolved ?? 0}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                  {third.stats?.todaySolved > 0 ? `+${third.stats.todaySolved} today` : '0 today'}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center w-full">
                {renderUserBadges(third)}
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
