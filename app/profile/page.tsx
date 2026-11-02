'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Save, RefreshCw, CheckCircle2, AlertCircle, Flame, ExternalLink, Clock } from 'lucide-react';
import PlatformBadge from '@/components/PlatformBadge';

interface UserData {
  id: string;
  name: string;
  email: string;
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
      // First save if any pending edits
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, leetcode, codeforces, codechef }),
      });

      // Now sync this user
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

      // Immediately update local UI state with the fresh synced stats
      if (data.userSync?.stats) {
        setUser((prev) =>
          prev
            ? {
                ...prev,
                stats: data.userSync.stats,
              }
            : prev
        );
      }

      // Also refresh full user state in background without browser caching
      try {
        const meRes = await fetch('/api/auth/me', { cache: 'no-store' });
        const meData = await meRes.json();
        if (meData?.user) {
          setUser(meData.user);
        }
      } catch (err) {
        console.warn('Silent refresh error:', err);
      }

      router.refresh();

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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-amber-500/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">{user.name}</h1>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
            <button
              onClick={handleSyncNow}
              disabled={syncing || cooldownSeconds > 0}
              className={`flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                syncing || cooldownSeconds > 0
                  ? 'bg-amber-500/20 text-amber-300/60 border border-amber-500/20 cursor-not-allowed'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:scale-105'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>
                {syncing
                  ? 'Fetching from APIs...'
                  : cooldownSeconds > 0
                  ? `Wait ${Math.floor(cooldownSeconds / 60)}m ${cooldownSeconds % 60}s to sync`
                  : 'Sync My Solves Now'}
              </span>
            </button>
            <div className="text-[11px] text-amber-400/80 flex items-center justify-center sm:justify-end gap-1 font-medium">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Sync cutoff is 11:59 PM IST tonight</span>
            </div>
          </div>
        </div>

        {/* Nightly Sync Callout */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-2.5 text-xs text-amber-200/90">
          <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-amber-300 font-bold">Mandatory Daily Tracking:</strong> Please manually sync all your solved questions before going to sleep. Only synced questions will count towards the leaderboard — unsynced questions will not be considered!
          </p>
        </div>

        {/* Challenge Solves Highlight */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
            <div className="text-xs text-slate-400">Total Solved in Challenge</div>
            <div className="text-2xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>{user.stats?.totalSolved ?? user.stats?.todaySolved ?? 0}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              +{user.stats?.todaySolved || 0} today
            </div>
          </div>

          <div className="bg-slate-950/70 border border-amber-500/20 rounded-xl p-3.5">
            <div className="text-xs text-amber-400 font-semibold flex items-center justify-between">
              <span>LeetCode</span>
              {!user.handles?.leetcode?.trim() && (
                <span className="text-[10px] text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {user.handles?.leetcode?.trim() ? user.stats?.leetcode || 0 : '—'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-blue-500/20 rounded-xl p-3.5">
            <div className="text-xs text-blue-400 font-semibold flex items-center justify-between">
              <span>Codeforces</span>
              {!user.handles?.codeforces?.trim() && (
                <span className="text-[10px] text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {user.handles?.codeforces?.trim() ? user.stats?.codeforces || 0 : '—'}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-emerald-500/20 rounded-xl p-3.5">
            <div className="text-xs text-emerald-400 font-semibold flex items-center justify-between">
              <span>CodeChef</span>
              {!user.handles?.codechef?.trim() && (
                <span className="text-[10px] text-slate-500 font-normal">Unlinked</span>
              )}
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {user.handles?.codechef?.trim() ? user.stats?.codechef || 0 : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        <h2 className="text-lg font-bold text-white mb-1">Connected Coding Platforms</h2>
        <p className="text-xs text-slate-400 mb-6">
          Connect only the platforms you actively use. You do <strong>not</strong> need accounts on all 3 websites. Leave any platforms you don&apos;t use completely blank.
        </p>

        {message && (
          <div
            className={`mb-6 p-3.5 rounded-xl flex items-center space-x-2.5 text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  LeetCode Handle / URL
                </label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="w-full bg-slate-950/90 border border-amber-500/30 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Codeforces Handle / URL
                </label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={codeforces}
                onChange={(e) => setCodeforces(e.target.value)}
                className="w-full bg-slate-950/90 border border-blue-500/30 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  CodeChef Handle / URL
                </label>
                <span className="text-[10px] text-slate-500">Optional</span>
              </div>
              <input
                type="text"
                placeholder="Username or profile URL"
                value={codechef}
                onChange={(e) => setCodechef(e.target.value)}
                className="w-full bg-slate-950/90 border border-emerald-500/30 rounded-xl px-4 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

