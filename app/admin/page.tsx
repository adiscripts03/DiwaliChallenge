'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  ShieldCheck,
  Lock,
  Search,
  RefreshCw,
  Edit3,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  Users,
  LogOut,
  X,
  Save,
  Zap,
  RotateCcw,
} from 'lucide-react';
import PlatformBadge from '@/components/PlatformBadge';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role?: string;
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
  lastSyncAt?: string;
  lastDailyDate?: string;
  createdAt: string;
}

export default function AdminPortalPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Login form state
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Data state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<'all' | 'leetcode' | 'codeforces' | 'codechef'>('all');

  // Actions state
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit/Overwrite modal state
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    leetcode: '',
    codeforces: '',
    codechef: '',
    totalSolved: 0,
    todaySolved: 0,
    solvedLc: 0,
    solvedCf: 0,
    solvedCc: 0,
    resetCooldown: false,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Check initial admin authorization
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth', { cache: 'no-store' });
      const data = await res.json();
      if (data.isAdmin) {
        setIsAdmin(true);
        loadUsers();
      } else {
        setIsAdmin(false);
      }
    } catch {
      setIsAdmin(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch (err: any) {
      showToast('error', 'Failed to load users: ' + err.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: loginId, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid admin credentials');
      }

      setIsAdmin(true);
      loadUsers();
      showToast('success', 'Admin access granted');
    } catch (err: any) {
      setLoginError(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    setIsAdmin(false);
    setUsers([]);
    showToast('success', 'Logged out of Admin Portal');
  };

  // Force sync single user
  const handleForceSync = async (u: AdminUser) => {
    setSyncingId(u.id);
    try {
      const res = await fetch('/api/admin/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: u.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Force sync failed');

      showToast(
        'success',
        `Synced ${u.name}! Today: ${data.userSync?.stats?.todaySolved ?? 0}, Total: ${data.userSync?.stats?.totalSolved ?? 0}`
      );

      // Update in local state
      if (data.userSync?.stats) {
        setUsers((prev) =>
          prev.map((item) =>
            item.id === u.id
              ? {
                  ...item,
                  stats: data.userSync.stats,
                  lastSyncAt: new Date().toISOString(),
                }
              : item
          )
        );
      }
    } catch (err: any) {
      showToast('error', `Sync failed for ${u.name}: ${err.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  // Open Edit Modal
  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      leetcode: u.handles?.leetcode || '',
      codeforces: u.handles?.codeforces || '',
      codechef: u.handles?.codechef || '',
      totalSolved: u.stats?.totalSolved ?? u.stats?.todaySolved ?? 0,
      todaySolved: u.stats?.todaySolved || 0,
      solvedLc: u.stats?.leetcode || 0,
      solvedCf: u.stats?.codeforces || 0,
      solvedCc: u.stats?.codechef || 0,
      resetCooldown: false,
    });
  };

  // Save Overwrite
  const handleSaveOverwrite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingEdit(true);

    try {
      const res = await fetch('/api/admin/overwrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUser.id,
          name: editForm.name,
          leetcode: editForm.leetcode,
          codeforces: editForm.codeforces,
          codechef: editForm.codechef,
          totalSolved: editForm.totalSolved,
          todaySolved: editForm.todaySolved,
          solvedLc: editForm.solvedLc,
          solvedCf: editForm.solvedCf,
          solvedCc: editForm.solvedCc,
          resetCooldown: editForm.resetCooldown,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Overwrite failed');

      showToast('success', `Updated stats for ${editForm.name}`);

      // Update local state
      if (data.user) {
        setUsers((prev) =>
          prev.map((item) => (item.id === editingUser.id ? data.user : item))
        );
      }
      setEditingUser(null);
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.handles?.leetcode || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.handles?.codeforces || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.handles?.codechef || '').toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filterPlatform === 'leetcode') return Boolean(u.handles?.leetcode?.trim());
    if (filterPlatform === 'codeforces') return Boolean(u.handles?.codeforces?.trim());
    if (filterPlatform === 'codechef') return Boolean(u.handles?.codechef?.trim());
    return true;
  });

  // Aggregate Metrics
  const totalSolvedAll = users.reduce(
    (acc, u) => acc + (u.stats.totalSolved ?? u.stats.todaySolved ?? 0),
    0
  );
  const todaySolvedAll = users.reduce((acc, u) => acc + (u.stats.todaySolved || 0), 0);
  const activeSolvers = users.filter(
    (u) => (u.stats.totalSolved ?? u.stats.todaySolved ?? 0) > 0
  ).length;

  if (checkingAuth) {
    return (
      <div className="max-w-md mx-auto my-24 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-400 mb-3" />
        <p className="text-sm">Verifying admin credentials...</p>
      </div>
    );
  }

  // --- Login Screen ---
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-3 shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white">Admin Control Portal</h1>
          <p className="text-xs text-slate-400">
            Authorized organizers only. Enter your Admin ID and Password to manage participants, force-sync solves, and overwrite scores.
          </p>
        </div>

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Admin ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. admin"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all flex items-center justify-center space-x-2 mt-4"
          >
            {loggingIn ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
            <span>{loggingIn ? 'Authenticating...' : 'Unlock Admin Portal'}</span>
          </button>
        </form>
      </div>
    );
  }

  // --- Authenticated Admin Dashboard ---
  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center space-x-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50'
              : 'bg-rose-950/95 border-rose-500/50 text-rose-300 shadow-rose-950/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 bg-slate-900/80 border border-amber-500/30 rounded-3xl shadow-xl backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Admin Control Center</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
                Superuser
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct participant management, live force-sync, and score overwrite portal.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-end sm:self-auto">
          <button
            onClick={loadUsers}
            disabled={loadingUsers}
            title="Refresh participant list"
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingUsers ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <Link
            href="/"
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            Leaderboard
          </Link>

          <button
            onClick={handleAdminLogout}
            title="Log Out of Admin"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Registered Coders</div>
          <div className="text-2xl font-black text-white mt-1 flex items-center space-x-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>{users.length}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Challenge Total Solves</div>
          <div className="text-2xl font-black text-amber-400 mt-1 flex items-center space-x-1.5">
            <Flame className="w-5 h-5 text-amber-500" />
            <span>{totalSolvedAll}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Solved Today</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            +{todaySolvedAll}
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="text-xs text-slate-400 font-medium">Active Solvers</div>
          <div className="text-2xl font-black text-white mt-1">
            {activeSolvers} / {users.length}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
          {(['all', 'leetcode', 'codeforces', 'codechef'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterPlatform(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filterPlatform === tab
                  ? 'bg-slate-800 text-amber-400 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Platforms' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 text-center w-12">#</th>
                <th className="px-4 py-3.5">Coder Profile</th>
                <th className="px-4 py-3.5">Handles</th>
                <th className="px-4 py-3.5">Today Breakdown</th>
                <th className="px-4 py-3.5 text-center">Score</th>
                <th className="px-4 py-3.5 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No participants found matching &quot;{search}&quot;.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Rank Index */}
                    <td className="px-4 py-3.5 text-center text-slate-500 font-bold tabular-nums">
                      {idx + 1}
                    </td>

                    {/* Profile */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-white text-sm">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{u.email}</div>
                    </td>

                    {/* Handles */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col gap-1 text-[11px]">
                        {u.handles?.leetcode?.trim() && (
                          <a
                            href={`https://leetcode.com/${encodeURIComponent(u.handles.leetcode)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400/90 hover:underline inline-flex items-center gap-1"
                          >
                            <span>LC: {u.handles.leetcode}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        {u.handles?.codeforces?.trim() && (
                          <a
                            href={`https://codeforces.com/profile/${encodeURIComponent(u.handles.codeforces)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400/90 hover:underline inline-flex items-center gap-1"
                          >
                            <span>CF: {u.handles.codeforces}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        {u.handles?.codechef?.trim() && (
                          <a
                            href={`https://www.codechef.com/users/${encodeURIComponent(u.handles.codechef)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400/90 hover:underline inline-flex items-center gap-1"
                          >
                            <span>CC: {u.handles.codechef}</span>
                            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                          </a>
                        )}
                        {!u.handles?.leetcode && !u.handles?.codeforces && !u.handles?.codechef && (
                          <span className="text-slate-500 italic text-[11px]">No handles</span>
                        )}
                      </div>
                    </td>

                    {/* Today Breakdown */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
                          LC: {u.stats.leetcode || 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-bold">
                          CF: {u.stats.codeforces || 0}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] font-bold">
                          CC: {u.stats.codechef || 0}
                        </span>
                      </div>
                    </td>

                    {/* Total / Today Score */}
                    <td className="px-4 py-3.5 text-center">
                      <div className="font-black text-amber-400 text-base tabular-nums">
                        {u.stats.totalSolved ?? u.stats.todaySolved ?? 0}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        +{u.stats.todaySolved || 0} today
                      </div>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {/* Force Sync Button */}
                        <button
                          onClick={() => handleForceSync(u)}
                          disabled={syncingId === u.id}
                          title="Force immediate sync (ignores cooldown)"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center space-x-1 disabled:opacity-50"
                        >
                          <Zap className={`w-3.5 h-3.5 ${syncingId === u.id ? 'animate-spin' : ''}`} />
                          <span>{syncingId === u.id ? 'Syncing...' : 'Sync'}</span>
                        </button>

                        {/* Overwrite Edit Button */}
                        <button
                          onClick={() => openEditModal(u)}
                          title="Edit/Overwrite scores or handles"
                          className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white transition-all flex items-center space-x-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Overwrite Modal --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>Edit & Overwrite:</span>
                  <span className="text-amber-400">{editingUser.name}</span>
                </h3>
                <p className="text-xs text-slate-400">{editingUser.email}</p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOverwrite} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  Participant Name
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Question Scores Section */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                  Question Counters Overwrite
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Total Challenge Solved
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.totalSolved}
                      onChange={(e) =>
                        setEditForm({ ...editForm, totalSolved: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Solved Today (Total)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.todaySolved}
                      onChange={(e) =>
                        setEditForm({ ...editForm, todaySolved: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-1">
                  <div>
                    <label className="block text-[10px] text-amber-300 font-semibold mb-1">
                      LeetCode
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.solvedLc}
                      onChange={(e) =>
                        setEditForm({ ...editForm, solvedLc: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-amber-500/30 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-blue-300 font-semibold mb-1">
                      Codeforces
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.solvedCf}
                      onChange={(e) =>
                        setEditForm({ ...editForm, solvedCf: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-blue-500/30 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-emerald-300 font-semibold mb-1">
                      CodeChef
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={editForm.solvedCc}
                      onChange={(e) =>
                        setEditForm({ ...editForm, solvedCc: parseInt(e.target.value) || 0 })
                      }
                      className="w-full bg-slate-900 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Handles Section */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Platform Handles
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">LeetCode</label>
                    <input
                      type="text"
                      value={editForm.leetcode}
                      onChange={(e) => setEditForm({ ...editForm, leetcode: e.target.value })}
                      placeholder="Username"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Codeforces</label>
                    <input
                      type="text"
                      value={editForm.codeforces}
                      onChange={(e) => setEditForm({ ...editForm, codeforces: e.target.value })}
                      placeholder="Username"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">CodeChef</label>
                    <input
                      type="text"
                      value={editForm.codechef}
                      onChange={(e) => setEditForm({ ...editForm, codechef: e.target.value })}
                      placeholder="Username"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Cooldown Checkbox */}
              <label className="flex items-center space-x-2 text-xs text-amber-200 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editForm.resetCooldown}
                  onChange={(e) =>
                    setEditForm({ ...editForm, resetCooldown: e.target.checked })
                  }
                  className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-950 w-4 h-4"
                />
                <span>Reset 5-Minute Cooldown (Allows participant to sync immediately)</span>
              </label>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingEdit ? 'Saving Overwrite...' : 'Save Overwrite'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
