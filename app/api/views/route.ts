import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const views = await db.getPageViews();
    const response = NextResponse.json(views);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: any) {
    return NextResponse.json({ totalViews: 0, todayViews: 0 });
  }
}

export async function POST() {
  try {
    const views = await db.recordPageView();
    const response = NextResponse.json(views);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: any) {
    return NextResponse.json({ totalViews: 0, todayViews: 0 });
  }
}
