'use client';

import React, { useState } from 'react';
import { RefreshCw, Search, ExternalLink, CheckCircle2, Flame, Trophy, Medal } from 'lucide-react';
import PlatformBadge from './PlatformBadge';

export interface LeaderboardUser {
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


interface LeaderboardTableProps {
  users: LeaderboardUser[];
}

export default function LeaderboardTable({ users }: LeaderboardTableProps) {
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'leetcode' | 'codeforces' | 'codechef'>('all');

  const filteredUsers = users
    .filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.handles?.leetcode || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.handles?.codeforces || '').toLowerCase().includes(search.toLowerCase()) ||
        (u.handles?.codechef || '').toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (filterPlatform === 'leetcode') return Boolean(u.handles?.leetcode?.trim());
      if (filterPlatform === 'codeforces') return Boolean(u.handles?.codeforces?.trim());
      if (filterPlatform === 'codechef') return Boolean(u.handles?.codechef?.trim());
      return true;
    })
    .sort((a, b) => {
      if (filterPlatform === 'leetcode') return (b.stats?.leetcode || 0) - (a.stats?.leetcode || 0);
      if (filterPlatform === 'codeforces') return (b.stats?.codeforces || 0) - (a.stats?.codeforces || 0);
      if (filterPlatform === 'codechef') return (b.stats?.codechef || 0) - (a.stats?.codechef || 0);
      const bScore = b.stats?.totalSolved ?? b.stats?.todaySolved ?? 0;
      const aScore = a.stats?.totalSolved ?? a.stats?.todaySolved ?? 0;
      return bScore - aScore;
    });

  const maxSolved = Math.max(...users.map((u) => u.stats?.totalSolved ?? u.stats?.todaySolved ?? 0), 5);

  return (
    <div className="w-full bg-slate-900/70 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Search & Filter Toolbar */}
      <div className="p-5 sm:p-7 border-b border-slate-800/80 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coder or platform handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all shadow-inner"
          />
        </div>

        {/* Platform filter tabs */}
        <div className="flex items-center space-x-2 p-1.5 bg-slate-950/90 rounded-2xl border border-slate-800 self-stretch md:self-auto overflow-x-auto shadow-inner">
          {(['all', 'leetcode', 'codeforces', 'codechef'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPlatform(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold capitalize whitespace-nowrap transition-all ${
                filterPlatform === tab
                  ? 'tab-active bg-slate-800 text-amber-400 shadow-md border border-slate-700 scale-[1.02]'
                  : 'tab-inactive text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Combined' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm sm:text-base text-slate-300">
          <thead className="bg-slate-950/80 text-xs sm:text-sm uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
            <tr>
              <th scope="col" className="px-6 sm:px-8 py-4 sm:py-5 w-24 text-center">Rank</th>
              <th scope="col" className="px-6 sm:px-8 py-4 sm:py-5">Coder Profile</th>
              <th scope="col" className="px-6 sm:px-8 py-4 sm:py-5">Today's Solves by Platform</th>
              <th scope="col" className="px-6 sm:px-8 py-4 sm:py-5 text-right">Global Challenge Solves</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 font-medium">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 sm:px-8 py-20 text-center">
                  <div className="max-w-md mx-auto space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold shadow-lg">
                      <Search className="w-6 h-6" />
                    </div>
                    <div className="text-slate-100 font-bold text-base sm:text-lg">No coders found</div>
                    <p className="text-xs sm:text-sm text-slate-400">
                      No coders match &quot;{search || filterPlatform}&quot;. Try adjusting your search query or platform filter.
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 underline pt-2 inline-block"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => {
                const userScore = user.stats?.totalSolved ?? user.stats?.todaySolved ?? 0;
                const percentage = Math.min(100, Math.round((userScore / maxSolved) * 100));

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Rank */}
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl font-black text-sm sm:text-base tabular-nums shadow-sm ${
                          idx === 0
                            ? 'rank-badge-1 bg-amber-400/20 text-amber-300 border-2 border-amber-400/50 shadow-amber-500/20 shadow-md'
                            : idx === 1
                            ? 'rank-badge-2 bg-slate-300/20 text-slate-100 border-2 border-slate-300/50 shadow-slate-500/20 shadow-md'
                            : idx === 2
                            ? 'rank-badge-3 bg-amber-600/20 text-amber-300 border-2 border-amber-600/50 shadow-amber-600/20 shadow-md'
                            : 'rank-badge-default bg-slate-800/70 text-slate-300 border border-slate-700/60'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    {/* Coder Info */}
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex items-center space-x-4">
                        <div className="coder-avatar w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center font-black text-base sm:text-lg text-white border border-slate-700/80 shadow-md shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-base sm:text-lg text-white group-hover:text-amber-400 transition-colors">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Platforms */}
                    <td className="px-6 sm:px-8 py-5 sm:py-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        {user.handles?.leetcode?.trim() ||
                        user.handles?.codeforces?.trim() ||
                        user.handles?.codechef?.trim() ? (
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
                        ) : (
                          <span className="text-xs sm:text-sm text-slate-500 italic">No platforms connected</span>
                        )}
                      </div>
                    </td>

                    {/* Solved Count & Bar */}
                    <td className="px-6 sm:px-8 py-5 sm:py-6 text-right">
                      <div className="flex flex-col items-end">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-amber-400 tabular-nums flex items-center justify-end gap-1.5">
                          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" />
                          <span>
                            {filterPlatform === 'leetcode'
                              ? user.stats.leetcode
                              : filterPlatform === 'codeforces'
                              ? user.stats.codeforces
                              : filterPlatform === 'codechef'
                              ? user.stats.codechef
                              : (user.stats.totalSolved ?? user.stats.todaySolved ?? 0)}
                          </span>
                        </div>
                        <div className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                          {user.stats.todaySolved > 0 ? `+${user.stats.todaySolved} today` : '0 solved today'}
                        </div>
                        <div className="progress-track w-28 sm:w-36 lg:w-44 bg-slate-800 rounded-full h-2 mt-2 overflow-hidden shadow-inner">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-amber-400 h-2 rounded-full transition-all duration-300 shadow-sm"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
