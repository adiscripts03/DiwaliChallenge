import { fetchCodeforcesSolved, CodeforcesResult } from './codeforces';
import { fetchLeetCodeSolved, LeetCodeResult } from './leetcode';
import { fetchCodeChefSolved, CodeChefResult } from './codechef';
import { db, User, UserStats } from '../db';
import { getStartOfTodayTimestamp, getTodayDateString, CHALLENGE_TIMEZONE } from '../date';

export { getStartOfTodayTimestamp, getTodayDateString };

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
  const startOfToday = getStartOfTodayTimestamp(timeZone);
  const todayDateStr = getTodayDateString(timeZone);

  const [cfRes, lcRes, ccRes] = await Promise.all([
    user.handles?.codeforces?.trim()
      ? fetchCodeforcesSolved(user.handles.codeforces.trim(), startOfToday)
      : Promise.resolve<CodeforcesResult>({ platform: 'codeforces', handle: '', count: 0, problems: [] }),
    user.handles?.leetcode?.trim()
      ? fetchLeetCodeSolved(user.handles.leetcode.trim(), startOfToday)
      : Promise.resolve<LeetCodeResult>({ platform: 'leetcode', handle: '', count: 0, problems: [] }),
    user.handles?.codechef?.trim()
      ? fetchCodeChefSolved(user.handles.codechef.trim(), startOfToday)
      : Promise.resolve<CodeChefResult>({ platform: 'codechef', handle: '', count: 0, problems: [] }),
  ]);

  const isSameDay = user.lastDailyDate === todayDateStr;
  const cfCount = cfRes.error ? (isSameDay ? (user.stats?.codeforces ?? 0) : 0) : cfRes.count;
  const lcCount = lcRes.error ? (isSameDay ? (user.stats?.leetcode ?? 0) : 0) : lcRes.count;
  const ccCount = ccRes.error ? (isSameDay ? (user.stats?.codechef ?? 0) : 0) : ccRes.count;
  const todayCount = cfCount + lcCount + ccCount;

  const newStats: UserStats = {
    totalSolved: (user.stats?.totalSolved || 0) + todayCount,
    todaySolved: todayCount,
    codeforces: cfCount,
    leetcode: lcCount,
    codechef: ccCount,
    lastUpdated: new Date().toISOString(),
  };

  const updatedUser = await db.updateUserStats(
    user.id,
    newStats,
    new Date().toISOString(),
    todayDateStr
  );

  if (updatedUser?.stats) {
    newStats.totalSolved = updatedUser.stats.totalSolved;
    newStats.todaySolved = updatedUser.stats.todaySolved;
    newStats.leetcode = updatedUser.stats.leetcode;
    newStats.codeforces = updatedUser.stats.codeforces;
    newStats.codechef = updatedUser.stats.codechef;
    newStats.lastUpdated = updatedUser.stats.lastUpdated;
  }

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

