import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const users = await db.getUsers();

    // Sort descending by todaySolved, then by name
    const sorted = [...users].sort((a, b) => {
      const diff = (b.stats?.todaySolved || 0) - (a.stats?.todaySolved || 0);
      if (diff !== 0) return diff;
      return a.name.localeCompare(b.name);
    });

    const sanitized = sorted.map((u, index) => ({
      rank: index + 1,
      id: u.id,
      name: u.name,
      handles: u.handles,
      stats: u.stats || {
        todaySolved: 0,
        leetcode: 0,
        codeforces: 0,
        codechef: 0,
        lastUpdated: u.createdAt,
      },
      lastSyncAt: u.lastSyncAt,
    }));

    const lastSync = await db.getLastGlobalSync();

    return NextResponse.json({
      leaderboard: sanitized,
      lastGlobalSync: lastSync || new Date().toISOString(),
      timezone: process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata',
    });
  } catch (error: any) {
    console.error('Leaderboard fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to load leaderboard' },
      { status: 500 }
    );
  }
}

