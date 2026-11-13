'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Save, RefreshCw, CheckCircle2, AlertCircle, Flame, ExternalLink, Clock, Trophy, Sparkles } from 'lucide-react';
import PlatformBadge from '@/components/PlatformBadge';
import RankCardModal from '@/components/RankCardModal';

interface UserData {
  id: string;
  name: string;
  email: string;
  rank?: number;
  totalParticipants?: number;
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

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [leetcode, setLeetcode] = useState('');
  const [codeforces, setCodeforces] = useState('');
  const [codechef, setCodechef] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const interval = setInterval(() => {
      setCooldownSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownSeconds]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push('/login');
          return;
        }
        setUser(data.user);
        setName(data.user.name || '');
        setLeetcode(data.user.handles?.leetcode || '');
        setCodeforces(data.user.handles?.codeforces || '');
        setCodechef(data.user.handles?.codechef || '');
      })
      .catch(() => router.push('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          leetcode,
          codeforces,
          codechef,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      setUser(data.user);
      router.refresh();
      setMessage({ type: 'success', text: 'Handles saved successfully!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncNow = async () => {
    if (!user) return;
    setSyncing(true);
    setMessage(null);

    try {
      const hasPendingEdits =
        name.trim() !== (user.name || '').trim() ||
        leetcode.trim() !== (user.handles?.leetcode || '').trim() ||
        codeforces.trim() !== (user.handles?.codeforces || '').trim() ||
        codechef.trim() !== (user.handles?.codechef || '').trim();

      if (hasPendingEdits) {
        // If user edited their handles in the input fields, save profile (which also syncs solves)
        const profileRes = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, leetcode, codeforces, codechef }),
        });

        const profileData = await profileRes.json();
        if (!profileRes.ok) {
          throw new Error(profileData.error || 'Failed to update profile');
        }

        setCooldownSeconds(300);
        if (profileData?.user) {
          setUser(profileData.user);
        }
        setMessage({
          type: 'success',
          text: `Profile saved & synced! Solved today: ${profileData.user?.stats?.todaySolved ?? 0} (Global Total: ${profileData.user?.stats?.totalSolved ?? 0}).`,
        });
        return;
      }

      // Normal sync: directly fetch solves across connected platforms
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.cooldownRemaining) {
          setCooldownSeconds(data.cooldownRemaining);
        }
        throw new Error(data.error || 'Sync failed');
      }

      // Start 300-second (5 minute) cooldown timer upon successful sync
      setCooldownSeconds(300);

      // Immediately update local UI cards with the fresh synced stats
      if (data.userSync?.stats) {
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            stats: {
              ...prev.stats,
              totalSolved: data.userSync.stats.totalSolved ?? prev.stats.totalSolved,
              todaySolved: data.userSync.stats.todaySolved ?? prev.stats.todaySolved,
              leetcode: data.userSync.stats.leetcode ?? prev.stats.leetcode,
              codeforces: data.userSync.stats.codeforces ?? prev.stats.codeforces,
              codechef: data.userSync.stats.codechef ?? prev.stats.codechef,
              lastUpdated: data.userSync.stats.lastUpdated || new Date().toISOString(),
            },
          };
        });
      }

      setMessage({
        type: 'success',
        text: `Sync complete! Solved today: ${data.userSync?.stats?.todaySolved ?? 0} (Global Total: ${data.userSync?.stats?.totalSolved ?? 0}).`,
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-16 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-3" />
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full mx-auto space-y-8">
      {/* Header card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex items-center space-x-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-xl shadow-amber-500/25 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">{user.name}</h1>
              <p className="text-sm sm:text-base text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setIsCardModalOpen(true)}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Trophy className="w-4 h-4 text-slate-950 shrink-0" />
                <span>Rank Card</span>
              </button>

              <button
                onClick={handleSyncNow}
                disabled={syncing || cooldownSeconds > 0}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg transition-all ${
                  syncing || cooldownSeconds > 0
                    ? 'bg-amber-500/20 text-amber-300/60 border border-amber-500/20 cursor-not-allowed'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:scale-[1.02]'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                <span>
                  {syncing
                    ? 'Fetching from APIs...'
                    : cooldownSeconds > 0
                    ? `Wait ${Math.floor(cooldownSeconds / 60)}m ${cooldownSeconds % 60}s to sync`
                    : 'Sync My Solves Now'}
                </span>
              </button>
            </div>
            <div className="text-xs sm:text-sm text-amber-400/80 flex items-center justify-center sm:justify-end gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Sync cutoff is 11:59 PM IST tonight</span>
            </div>
          </div>
        </div>

        {/* Nightly Sync Callout */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-sm sm:text-base text-amber-200/90 leading-relaxed">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-300 font-bold">Mandatory Daily Tracking:</strong> Please manually sync all your solved questions before going to sleep. Only synced questions will count towards the leaderboard — unsynced questions will not be considered!
          </p>
        </div>

        {/* Challenge Solves Highlight */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-5 sm:p-7 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">Total Solved in Challenge</div>
            <div className="text-3xl sm:text-5xl font-black text-amber-400 mt-2 flex items-center gap-2">
              <Flame className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 shrink-0" />
              <span>{user.stats?.totalSolved ?? user.stats?.todaySolved ?? 0}</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-400 mt-1.5 font-medium">
              +{user.stats?.todaySolved || 0} today
            </div>
          </div>

          <div className="bg-slate-950/70 border border-amber-500/20 rounded-2xl p-5 sm:p-7 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
              <span>LeetCode</span>
              {!user.handles?.leetcode?.trim() && (
                <span className="text-xs text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white mt-2">
              {user.handles?.leetcode?.trim() ? user.stats?.leetcode || 0 : '—'}
            </div>
            <div className="text-xs sm:text-sm text-amber-400/70 mt-1.5 font-medium">
              {user.handles?.leetcode?.trim() ? 'Verified Solves' : 'Profile not set'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-blue-500/20 rounded-2xl p-5 sm:p-7 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center justify-between">
              <span>Codeforces</span>
              {!user.handles?.codeforces?.trim() && (
                <span className="text-xs text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white mt-2">
              {user.handles?.codeforces?.trim() ? user.stats?.codeforces || 0 : '—'}
            </div>
            <div className="text-xs sm:text-sm text-blue-400/70 mt-1.5 font-medium">
              {user.handles?.codeforces?.trim() ? 'Rating ≥ 800' : 'Profile not set'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-emerald-500/20 rounded-2xl p-5 sm:p-7 shadow-lg">
            <div className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
              <span>CodeChef</span>
              {!user.handles?.codechef?.trim() && (
                <span className="text-xs text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-3xl sm:text-5xl font-black text-white mt-2">
              {user.handles?.codechef?.trim() ? user.stats?.codechef || 0 : '—'}
            </div>
            <div className="text-xs sm:text-sm text-emerald-400/70 mt-1.5 font-medium">
              {user.handles?.codechef?.trim() ? 'Rating ≥ 800' : 'Profile not set'}
            </div>
          </div>
        </div>

        {/* LinkedIn Shareable Rank Card Banner */}
        <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-600/15 to-amber-500/10 border-2 border-amber-500/40 p-6 sm:p-8 backdrop-blur-md shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LinkedIn Shareable Achievement</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Generate Your Rank Card</span>
            </h3>
            <p className="text-sm sm:text-base text-amber-100/80 leading-relaxed">
              Export your official GDG IIITN Rank Card! Showcase your final rank after the challenge, along with verified question counts on LeetCode, Codeforces, and CodeChef to recruiters and peers on LinkedIn.
            </p>
          </div>

          <button
            onClick={() => setIsCardModalOpen(true)}
            type="button"
            className="flex items-center justify-center space-x-2.5 px-7 py-4 rounded-2xl font-black text-base bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
          >
            <Trophy className="w-5 h-5 text-slate-950" />
            <span>Generate Rank Card</span>
          </button>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">Connected Coding Platforms</h2>
        <p className="text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
          Connect only the platforms you actively use. You do <strong>not</strong> need accounts on all 3 websites. Leave any platforms you don&apos;t use completely blank.
        </p>

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center space-x-3 text-sm font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider">
                  LeetCode Handle / URL
                </label>
                <span className="text-xs text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-blue-400 uppercase tracking-wider">
                  Codeforces Handle / URL
                </label>
                <span className="text-xs text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={codeforces}
                onChange={(e) => setCodeforces(e.target.value)}
                className="w-full bg-slate-950/90 border border-blue-500/30 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  CodeChef Handle / URL
                </label>
                <span className="text-xs text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={codechef}
                onChange={(e) => setCodechef(e.target.value)}
                className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2.5 px-8 py-3.5 rounded-xl font-bold text-sm sm:text-base bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Shareable Rank Card Modal */}
      <RankCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        user={user}
      />
    </div>
  );
}

