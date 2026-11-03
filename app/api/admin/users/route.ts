import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const users = await db.getUsers();

    // Sort descending by totalSolved, then todaySolved
    const sorted = [...users].sort((a, b) => {
      const diffTotal = (b.stats?.totalSolved || 0) - (a.stats?.totalSolved || 0);
      if (diffTotal !== 0) return diffTotal;
      return (b.stats?.todaySolved || 0) - (a.stats?.todaySolved || 0);
    });

    return NextResponse.json({
      success: true,
      users: sorted,
    });
  } catch (error: any) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + error.message },
      { status: 500 }
    );
  }
}
