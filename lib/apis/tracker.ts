import { fetchCodeforcesSolved, CodeforcesResult } from './codeforces';
import { fetchLeetCodeSolved, LeetCodeResult } from './leetcode';
import { fetchCodeChefSolved, CodeChefResult } from './codechef';
import { db, User, UserStats } from '../db';

/**
 * Returns midnight timestamp (epoch seconds) for today in the given timezone.
 */
export function getStartOfTodayTimestamp(timeZone: string = 'Asia/Kolkata'): number {
  try {
    const now = new Date();
    // Format current date in specified timezone (e.g. "11/1/2026")
    const dateStr = now.toLocaleDateString('en-US', { timeZone });
    const midnight = new Date(`${dateStr} 00:00:00`);
    return Math.floor(midnight.getTime() / 1000);
  } catch {
    // Fallback to UTC midnight
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  }
}

export interface UserSyncResult {
  userId: string;
  name: string;
  stats: UserStats;
  details: {
    codeforces: CodeforcesResult;
    leetcode: LeetCodeResult;
    codechef: CodeChefResult;
  };
}

/**
 * Fetches today's solves across LeetCode, Codeforces, and CodeChef for a single user.
 */
export async function syncUserSolves(user: User): Promise<UserSyncResult> {
  const timeZone = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata';
  const startOfDay = getStartOfTodayTimestamp(timeZone);

  const [cfRes, lcRes, ccRes] = await Promise.all([
    user.handles?.codeforces?.trim()
      ? fetchCodeforcesSolved(user.handles.codeforces.trim(), startOfDay)
      : Promise.resolve({ platform: 'codeforces' as const, handle: '', count: 0, problems: [] }),
    user.handles?.leetcode?.trim()
      ? fetchLeetCodeSolved(user.handles.leetcode.trim(), startOfDay)
      : Promise.resolve({ platform: 'leetcode' as const, handle: '', count: 0, problems: [] }),
    user.handles?.codechef?.trim()
      ? fetchCodeChefSolved(user.handles.codechef.trim(), startOfDay)
      : Promise.resolve({ platform: 'codechef' as const, handle: '', count: 0, problems: [] }),
  ]);

  const newStats: UserStats = {
    todaySolved: cfRes.count + lcRes.count + ccRes.count,
    codeforces: cfRes.count,
    leetcode: lcRes.count,
    codechef: ccRes.count,
    lastUpdated: new Date().toISOString(),
  };

  await db.updateUserStats(user.id, newStats, new Date().toISOString());

  return {
    userId: user.id,
    name: user.name,
    stats: newStats,
    details: {
      codeforces: cfRes,
      leetcode: lcRes,
      codechef: ccRes,
    },
  };
}

/**
 * Syncs all users in the database and updates global sync timestamp.
 */
export async function syncAllUsers(): Promise<UserSyncResult[]> {
  const users = await db.getUsers();
  const results: UserSyncResult[] = [];

  // Run in batches of 3 to avoid aggressive rate-limits
  for (let i = 0; i < users.length; i += 3) {
    const chunk = users.slice(i, i + 3);
    const chunkResults = await Promise.all(chunk.map((u) => syncUserSolves(u)));
    results.push(...chunkResults);
  }

  await db.setLastGlobalSync(new Date().toISOString());
  return results;
}

