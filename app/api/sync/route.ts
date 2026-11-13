import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error:
        'The GDG Diwali Challenge has officially ended! Syncing is closed and all final leaderboard standings are locked. Thank you for participating!',
      challengeEnded: true,
    },
    { status: 403 }
  );
}


