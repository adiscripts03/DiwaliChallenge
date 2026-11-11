import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  }

  let rank = 1;
  let totalParticipants = 1;

  try {
    const allUsers = await db.getUsers();
    const sorted = [...allUsers].sort((a, b) => {
      const diffTotal = (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0);
      if (diffTotal !== 0) return diffTotal;
      const diffToday = (b.stats?.todaySolved || 0) - (a.stats?.todaySolved || 0);
      if (diffToday !== 0) return diffToday;
      return a.name.localeCompare(b.name);
    });
    const rankIndex = sorted.findIndex((u) => u.id === user.id);
    rank = rankIndex !== -1 ? rankIndex + 1 : sorted.length;
    totalParticipants = sorted.length;
  } catch (err) {
    console.error('Error calculating rank in auth/me:', err);
  }

  return NextResponse.json(
    {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        handles: user.handles,
        stats: user.stats,
        rank,
        totalParticipants,
      },
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}

