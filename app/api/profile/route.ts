import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { syncUserSolves } from '@/lib/apis/tracker';
import { sanitizeHandle } from '@/lib/utils/handles';

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, leetcode, codeforces, codechef, triggerSync } = await req.json();

    const updatedUser = await db.updateUser(currentUser.id, {
      ...(name ? { name: name.trim() } : {}),
      handles: {
        leetcode:
          leetcode !== undefined ? sanitizeHandle(leetcode, 'leetcode') : currentUser.handles.leetcode,
        codeforces:
          codeforces !== undefined ? sanitizeHandle(codeforces, 'codeforces') : currentUser.handles.codeforces,
        codechef:
          codechef !== undefined ? sanitizeHandle(codechef, 'codechef') : currentUser.handles.codechef,
      },
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User update failed' }, { status: 400 });
    }

    // Optionally sync immediately
    if (triggerSync) {
      await syncUserSolves(updatedUser);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        handles: updatedUser.handles,
        stats: updatedUser.stats,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Profile update failed: ' + error.message },
      { status: 500 }
    );
  }
}

