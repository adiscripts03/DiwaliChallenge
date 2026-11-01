import { NextResponse } from 'next/server';
import { syncUserSolves } from '@/lib/apis/tracker';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body is empty
    }

    if (!body?.userId) {
      return NextResponse.json(
        {
          error:
            'userId is required. Global sync is disabled to avoid rate-limiting platform APIs. Users must sync their own profile.',
        },
        { status: 400 }
      );
    }

    const user = await db.getUserById(body.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Cooldown enforcement: 60 seconds (1 minute) per user
    const COOLDOWN_SECONDS = 60;
    if (user.lastSyncAt) {
      const lastSyncTime = new Date(user.lastSyncAt).getTime();
      const nowTime = Date.now();
      const elapsedSeconds = Math.floor((nowTime - lastSyncTime) / 1000);
      if (elapsedSeconds < COOLDOWN_SECONDS) {
        const waitTime = COOLDOWN_SECONDS - elapsedSeconds;
        return NextResponse.json(
          {
            error: `Please wait ${waitTime}s before syncing again to protect external platforms.`,
            cooldownRemaining: waitTime,
          },
          { status: 429 }
        );
      }
    }

    const result = await syncUserSolves(user);
    return NextResponse.json({ success: true, userSync: result });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed: ' + error.message },
      { status: 500 }
    );
  }
}


