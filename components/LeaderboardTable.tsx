'use client';

import React, { useState } from 'react';
import { RefreshCw, Search, ExternalLink, CheckCircle2 } from 'lucide-react';
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
    <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search coder or platform handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all"
          />
        </div>

        {/* Platform filter tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'leetcode', 'codeforces', 'codechef'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPlatform(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterPlatform === tab
                  ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Combined' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/60 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th scope="col" className="px-6 py-3.5 w-16 text-center">Rank</th>
              <th scope="col" className="px-6 py-3.5">Coder Profile</th>
              <th scope="col" className="px-6 py-3.5">Today's Solves by Platform</th>
              <th scope="col" className="px-6 py-3.5 text-right">Global Challenge Solves</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="max-w-xs mx-auto space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center font-bold">
                      <Search className="w-5 h-5" />
                    </div>
                    <div className="text-slate-200 font-semibold text-sm">No coders found</div>
                    <p className="text-xs text-slate-400">
                      No coders match &quot;{search || filterPlatform}&quot;. Try adjusting your search query or platform filter.
                    </p>
                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline pt-1 inline-block"
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
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs tabular-nums ${
                          idx === 0
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : idx === 1
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : idx === 2
                            ? 'bg-amber-600/20 text-amber-300 border border-amber-600/40'
                            : 'bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </td>

                    {/* Coder Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-white border border-slate-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center space-x-2">
                            <span>{user.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Platforms */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {user.handles?.leetcode?.trim() ||
                        user.handles?.codeforces?.trim() ||
                        user.handles?.codechef?.trim() ? (
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
                        ) : (
                          <span className="text-xs text-slate-500 italic">No platforms connected</span>
                        )}
                      </div>
                    </td>

                    {/* Solved Count & Bar */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-xl font-extrabold text-amber-400 tabular-nums">
                          {filterPlatform === 'leetcode'
                            ? user.stats.leetcode
                            : filterPlatform === 'codeforces'
                            ? user.stats.codeforces
                            : filterPlatform === 'codechef'
                            ? user.stats.codechef
                            : (user.stats.totalSolved ?? user.stats.todaySolved ?? 0)}
                        </span>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {user.stats.todaySolved > 0 ? `+${user.stats.todaySolved} today` : '0 solved today'}
                        </div>
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className="bg-amber-400 h-1.5 rounded-full transition-all duration-300"
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

