'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Podium from '@/components/Podium';
import LeaderboardTable, { LeaderboardUser } from '@/components/LeaderboardTable';
import { DiyaGraphic } from '@/components/DiyaBackground';
import { RefreshCw, Users, Flame, Sparkles } from 'lucide-react';

export default function HomePage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [syncingUserId, setSyncingUserId] = useState<string | null>(null);

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

    // Auto-refresh leaderboard every 30 seconds so other users' solves show live
    const interval = setInterval(() => {
      fetchLeaderboard();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncUser = async (userId: string) => {
    setSyncingUserId(userId);
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      await fetchLeaderboard();
    } catch (err) {
      console.error('User sync failed:', err);
    } finally {
      setSyncingUserId(null);
    }
  };

  // Calculations
  const totalSolvedChallenge = users.reduce((acc, u) => acc + (u.stats.todaySolved || 0), 0);
  const activeSolvers = users.filter((u) => (u.stats.todaySolved || 0) > 0).length;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#18120c]/90 via-[#140e09]/90 to-[#0d0a07]/90 border border-amber-900/40 p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        {/* Soft background accents */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diwali Vacation Long Challenge</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white text-balance">
              GDG Diwali <span className="text-amber-400">Challenge</span>
            </h1>
            <p className="mt-2 text-amber-100/80 text-sm sm:text-base max-w-xl text-pretty">
              Vacation long coding sprint for freshers! Tracking all verified problems solved since the challenge kicked off today. Top 3 at vacation end win prizes and awards!
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
        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{totalSolvedChallenge}</div>
              <div className="text-xs text-slate-400">Total Solved in Challenge</div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black text-white">{activeSolvers} / {users.length}</div>
              <div className="text-xs text-slate-400">Active Competitors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Podium for Top 3 */}
      {!loading && users.length > 0 && <Podium topThree={users.slice(0, 3)} />}

      {/* Main Leaderboard Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span>Standings</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20">
              {users.length} Registered
            </span>
          </h2>
        </div>

        {loading ? (
          <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400 mb-2" />
            <p>Fetching challenge scores...</p>
          </div>
        ) : (
          <LeaderboardTable
            users={users}
            onSyncUser={handleSyncUser}
            syncingUserId={syncingUserId}
          />
        )}
      </div>
    </div>
  );
}


