import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  isAdminAuthorized,
  DEFAULT_ADMIN_ID,
  DEFAULT_ADMIN_PASSWORD,
  generateAdminToken,
  ADMIN_COOKIE_NAME,
} from '@/lib/adminAuth';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json({ isAdmin: false });
    }

    const currentUser = await getCurrentUser();
    return NextResponse.json({
      isAdmin: true,
      user: currentUser
        ? {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
          }
        : { id: 'admin', name: 'Super Admin', email: 'admin@portal', role: 'admin' },
    });
  } catch (error: any) {
    return NextResponse.json({ isAdmin: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { adminId, password } = await req.json();

    const expectedId = process.env.ADMIN_ID || DEFAULT_ADMIN_ID;
    const expectedPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    if (
      adminId?.trim().toLowerCase() === expectedId.toLowerCase() &&
      password === expectedPassword
    ) {
      const token = generateAdminToken(adminId.trim());
      const response = NextResponse.json({
        success: true,
        message: 'Admin authorization successful',
      });

      response.cookies.set({
        name: ADMIN_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid Admin ID or Password' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Admin login failed: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out of admin' });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
