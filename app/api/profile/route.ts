import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    // Since the GDG Diwali Challenge has officially ended, handles and scores are locked.
    // Users can only update their display name.
    const updatedUser = await db.updateUser(currentUser.id, {
      ...(name ? { name: name.trim() } : {}),
    });

    if (!updatedUser) {
      return NextResponse.json({ error: 'User update failed' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated. Scores and platform handles are locked as the challenge has concluded.',
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


