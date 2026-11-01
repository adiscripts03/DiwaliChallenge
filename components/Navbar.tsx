'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Trophy, LogOut, LogIn, UserPlus, Sparkles } from 'lucide-react';
import GDGLogo from '@/components/GDGLogo';

interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export default function Navbar() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#120d09]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand with Official GDG Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
            <GDGLogo className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              <span>GDG</span>
              <span className="text-amber-400">IIITN</span>
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/"
            className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </Link>

          <Link
            href="/poster"
            className={`flex items-center space-x-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
              pathname === '/poster'
                ? 'bg-slate-800 text-amber-400 border border-slate-700'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Poster</span>
          </Link>

          {!loading && (
            <>
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/profile"
                    className={`flex items-center space-x-2 text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                      pathname === '/profile'
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[120px] truncate">{user.name}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Log Out"
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="flex items-center space-x-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center space-x-1.5 text-sm font-medium px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Join</span>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


