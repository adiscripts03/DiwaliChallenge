import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const users = await db.getUsers();

    // Sort descending by cumulative totalSolved, then todaySolved, then by name
    const sorted = [...users].sort((a, b) => {
      const diffTotal = (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0);
      if (diffTotal !== 0) return diffTotal;
      const diffToday = (b.stats?.todaySolved || 0) - (a.stats?.todaySolved || 0);
      if (diffToday !== 0) return diffToday;
      return a.name.localeCompare(b.name);
    });

    const sanitized = sorted.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      name: u.name,
      handles: u.handles,
      stats: u.stats || {
        totalSolved: 0,
        todaySolved: 0,
        leetcode: 0,
        codeforces: 0,
        codechef: 0,
        lastUpdated: u.createdAt,
      },
      lastSyncAt: u.lastSyncAt,
    }));

    const lastSync = await db.getLastGlobalSync();

    const response = NextResponse.json({
      leaderboard: sanitized,
      lastGlobalSync: lastSync || new Date().toISOString(),
      timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata',
    });

    // Ensure browsers & Next.js cache never serve stale leaderboard data
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load leaderboard' },
      { status: 500 }
    );
  }
}

