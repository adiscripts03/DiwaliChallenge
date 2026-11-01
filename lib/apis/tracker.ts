import { fetchCodeforcesSolved, CodeforcesResult } from './codeforces';
import { fetchLeetCodeSolved, LeetCodeResult } from './leetcode';
import { fetchCodeChefSolved, CodeChefResult } from './codechef';
import { db, User, UserStats } from '../db';

/**
 * Returns epoch seconds for the start of the Diwali Challenge.
 * Default is start of challenge day: November 1, 2026 00:00:00 IST.
 */
export function getChallengeStartTimestamp(timeZone: string = 'Asia/Kolkata'): number {
  if (process.env.CHALLENGE_START_TIMESTAMP) {
    const parsed = parseInt(process.env.CHALLENGE_START_TIMESTAMP, 10);
    if (!isNaN(parsed)) return parsed;
  }
  if (process.env.CHALLENGE_START_DATE) {
    try {
      const d = new Date(process.env.CHALLENGE_START_DATE);
      return Math.floor(d.getTime() / 1000);
    } catch {}
  }
  // Default to today's midnight in Asia/Kolkata: 2026-11-01 00:00:00 IST (1793471400)
  return 1793471400;
}

/**
 * Returns midnight timestamp (epoch seconds) for today in the given timezone.
 */
export function getStartOfTodayTimestamp(timeZone: string = 'Asia/Kolkata'): number {
  return getChallengeStartTimestamp(timeZone);
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
  const challengeStart = getChallengeStartTimestamp(timeZone);

  const [cfRes, lcRes, ccRes] = await Promise.all([
    user.handles?.codeforces?.trim()
      ? fetchCodeforcesSolved(user.handles.codeforces.trim(), challengeStart)
      : Promise.resolve({ platform: 'codeforces' as const, handle: '', count: 0, problems: [] }),
    user.handles?.leetcode?.trim()
      ? fetchLeetCodeSolved(user.handles.leetcode.trim(), challengeStart)
      : Promise.resolve({ platform: 'leetcode' as const, handle: '', count: 0, problems: [] }),
    user.handles?.codechef?.trim()
      ? fetchCodeChefSolved(user.handles.codechef.trim(), challengeStart)
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

