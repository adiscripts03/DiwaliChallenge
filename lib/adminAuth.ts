import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getCurrentUser } from './auth';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_coding_leaderboard_2026';
export const ADMIN_COOKIE_NAME = 'gdg_admin_token';

export const DEFAULT_ADMIN_ID = process.env.ADMIN_ID || 'admin';
export const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'diwali2026@admin';

export interface AdminTokenPayload {
  adminId: string;
  role: 'admin';
}

export function generateAdminToken(adminId: string): string {
  return jwt.sign({ adminId, role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
    if (payload?.role === 'admin') {
      return payload;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Checks if the incoming request is authorized as an admin:
 * 1. Has valid admin_token cookie (direct Admin portal login)
 * 2. OR current logged-in user has role === 'admin' in database
 */
export async function isAdminAuthorized(): Promise<boolean> {
  try {
    const cookieStore = cookies();
    const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (adminToken && verifyAdminToken(adminToken)) {
      return true;
    }

    const currentUser = await getCurrentUser();
    if (currentUser?.role === 'admin') {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}
