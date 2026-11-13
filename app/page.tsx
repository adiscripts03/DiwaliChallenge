'use client';

export const dynamic = 'force-dynamic';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Podium from '@/components/Podium';
import LeaderboardTable, { LeaderboardUser } from '@/components/LeaderboardTable';
import DailySyncWidget from '@/components/DailySyncWidget';
import { DiyaGraphic } from '@/components/DiyaBackground';
import { RefreshCw, Users, Flame, Sparkles, CheckCircle2, Trophy, Heart } from 'lucide-react';

export default function HomePage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`/api/leaderboard?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (data.leaderboard) {
        setUsers(data.leaderboard);
        setLastSync(data.lastGlobalSync);
      }
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Calculations
  const totalSolvedChallenge = users.reduce((acc, u) => acc + (u.stats.totalSolved ?? u.stats.todaySolved ?? 0), 0);
  const activeSolvers = users.filter((u) => (u.stats.totalSolved ?? u.stats.todaySolved ?? 0) > 0).length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="hero-card relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/90 via-[#140e09]/90 to-[#0d0a07]/90 border border-amber-900/40 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Challenge Concluded • Final Official Standings</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white text-balance">
              GDG Diwali <span className="text-amber-400">Challenge</span>
            </h1>
            <p className="mt-2 text-amber-100/80 text-sm sm:text-base max-w-3xl text-pretty">
              The 10-day Diwali Vacation Coding Sprint has officially concluded! Final verified scores across LeetCode, Codeforces, and CodeChef are now frozen and locked into the official standings. Congratulations to all participants!
            </p>
          </div>

          {/* Prominent Hero Festive Diya */}
          <div className="flex items-center justify-center sm:pr-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-amber-500/25 rounded-full blur-2xl transform scale-110" />
              <DiyaGraphic className="w-40 h-28 sm:w-48 sm:h-32 relative z-10 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.5)] transition-transform duration-300 group-hover:scale-105" />
            </div>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-8 pt-6 border-t border-amber-900/40">
          <div className="flex items-center space-x-4 p-4 sm:p-5 rounded-2xl bg-black/40 border border-amber-500/20 shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tight">{totalSolvedChallenge}</div>
              <div className="text-xs sm:text-sm text-amber-200/80 font-medium">Total Solved in Challenge</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-4 sm:p-5 rounded-2xl bg-black/40 border border-orange-500/20 shadow-lg">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0 shadow-inner">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-orange-400" />
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {activeSolvers} <span className="text-lg sm:text-2xl text-slate-400 font-bold">/ {users.length}</span>
              </div>
              <div className="text-xs sm:text-sm text-orange-200/80 font-medium">Active Competitors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Concluded Widget */}
      <DailySyncWidget />

      {/* Podium for Top 3 */}
      {!loading && users.length > 0 && <Podium topThree={users.slice(0, 3)} />}

      {/* Leadership / Leaderboard Section */}
      <div className="space-y-6">
        {/* Festive Thank You Card for Participants */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/80 via-[#21160d]/95 to-amber-950/80 border border-amber-500/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-8 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2.5 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>GDG IIITN Organizers Note</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>Thank You to All Participants!</span>
                <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 fill-rose-500 inline-block animate-pulse shrink-0" />
              </h3>
              <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed">
                A huge shoutout and heartfelt gratitude to all <strong>{users.length} registered coders</strong> who took part in the GDG Diwali Challenge! Your passion, consistency, and problem-solving drive during the festival vacation were truly inspiring. Congratulations to our top podium finishers and every single student who pushed their coding limits. Keep building, keep solving, and keep shining!
              </p>
              <div className="text-xs sm:text-sm text-amber-400 font-semibold pt-1 flex items-center gap-2">
                <span>— Organized with ❤️ by GDG IIITN • Aditya Singh</span>
              </div>
            </div>

            <Link
              href="/profile"
              className="flex items-center space-x-2 px-6 py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 shrink-0 self-stretch sm:self-auto justify-center cursor-pointer"
            >
              <Trophy className="w-5 h-5 text-slate-950" />
              <span>Get Your Rank Card</span>
            </Link>
          </div>
        </div>

        {/* Standings Header */}
        <div className="flex items-center justify-between pt-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <span>Final Official Standings</span>
            <span className="text-xs sm:text-sm font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/25 shadow-sm">
              {users.length} Competitors
            </span>
          </h2>
        </div>

        {/* Main Leaderboard Table */}
        {loading ? (
          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
            <p>Fetching challenge scores...</p>
          </div>
        ) : (
          <LeaderboardTable users={users} />
        )}
      </div>
    </div>
  );
}
