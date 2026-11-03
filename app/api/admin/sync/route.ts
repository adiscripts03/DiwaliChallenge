import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { syncUserSolves } from '@/lib/apis/tracker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await db.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Admin force sync: bypasses cooldown completely
    const result = await syncUserSolves(user);

    return NextResponse.json({
      success: true,
      message: `Successfully force-synced solves for ${user.name}`,
      userSync: result,
    });
  } catch (error: any) {
    console.error('Admin sync error:', error);
    return NextResponse.json(
      { error: 'Admin force-sync failed: ' + error.message },
      { status: 500 }
    );
  }
}
