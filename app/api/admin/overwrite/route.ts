import { NextResponse } from 'next/server';
import { isAdminAuthorized } from '@/lib/adminAuth';
import { db } from '@/lib/db';
import { sanitizeHandle } from '@/lib/utils/handles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await req.json();
    const {
      userId,
      name,
      leetcode,
      codeforces,
      codechef,
      totalSolved,
      todaySolved,
      solvedLc,
      solvedCf,
      solvedCc,
      resetCooldown,
    } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const existing = await db.getUserById(userId);
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updatedUser = await db.adminOverwriteUser(userId, {
      ...(name !== undefined ? { name: name.trim() } : {}),
      handles: {
        ...(leetcode !== undefined ? { leetcode: sanitizeHandle(leetcode, 'leetcode') } : {}),
        ...(codeforces !== undefined ? { codeforces: sanitizeHandle(codeforces, 'codeforces') } : {}),
        ...(codechef !== undefined ? { codechef: sanitizeHandle(codechef, 'codechef') } : {}),
      },
      stats: {
        ...(totalSolved !== undefined ? { totalSolved: Number(totalSolved) } : {}),
        ...(todaySolved !== undefined ? { todaySolved: Number(todaySolved) } : {}),
        ...(solvedLc !== undefined ? { leetcode: Number(solvedLc) } : {}),
        ...(solvedCf !== undefined ? { codeforces: Number(solvedCf) } : {}),
        ...(solvedCc !== undefined ? { codechef: Number(solvedCc) } : {}),
      },
      ...(resetCooldown ? { resetCooldown: true } : {}),
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedUser.name}`,
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Admin overwrite error:', error);
    return NextResponse.json(
      { error: 'Admin overwrite failed: ' + error.message },
      { status: 500 }
    );
  }
}
