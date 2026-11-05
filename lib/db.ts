import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';
import { getTodayDateString } from './date';

export interface UserStats {
  totalSolved: number;
  todaySolved: number;
  leetcode: number;
  codeforces: number;
  codechef: number;
  lastUpdated: string;
}

export interface UserHandles {
  leetcode: string;
  codeforces: string;
  codechef: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin';
  handles: UserHandles;
  stats: UserStats;
  lastDailyDate?: string;
  lastSyncAt?: string;
  createdAt: string;
}

export interface AdminUserOverwriteInput {
  name?: string;
  handles?: {
    leetcode?: string;
    codeforces?: string;
    codechef?: string;
  };
  stats?: {
    totalSolved?: number;
    todaySolved?: number;
    leetcode?: number;
    codeforces?: number;
    codechef?: number;
  };
  resetCooldown?: boolean;
}

interface DatabaseSchema {
  users: User[];
  lastGlobalSync?: string;
  views?: {
    total: number;
    today: number;
    date: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      users: [],
      lastGlobalSync: new Date().toISOString(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    const fallback: DatabaseSchema = { users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function hasPostgresUrl(): boolean {
  return Boolean(
    (process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL) &&
    (process.env.DATABASE_URL_UNPOOLED?.startsWith('postgres') || process.env.DATABASE_URL?.startsWith('postgres'))
  );
}

/**
 * Automatically resets todaySolved and platform-specific daily counts to 0
 * for any users whose last recorded daily date is before todayDateStr (Asia/Kolkata).
 * Leaves totalSolved (cumulative contest total) completely intact.
 */
async function resetDailyStatsIfNewDay(todayDateStr: string) {
  if (!hasPostgresUrl()) return;
  try {
    await prisma.user.updateMany({
      where: {
        lastDailyDate: { not: todayDateStr },
      },
      data: {
        todaySolved: 0,
        solvedLc: 0,
        solvedCf: 0,
        solvedCc: 0,
        lastDailyDate: todayDateStr,
      },
    });
  } catch (err: any) {
    console.warn('Prisma resetDailyStatsIfNewDay error:', err.message);
  }
}

export const db = {
  async getUsers(): Promise<User[]> {
    const todayDateStr = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        await resetDailyStatsIfNewDay(todayDateStr);
        const rows = await prisma.user.findMany({
          orderBy: [{ totalSolved: 'desc' }, { todaySolved: 'desc' }],
        });
        return rows.map((u) => {
          const isToday = u.lastDailyDate === todayDateStr;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as 'user' | 'admin',
            handles: {
              leetcode: u.leetcode,
              codeforces: u.codeforces,
              codechef: u.codechef,
            },
            stats: {
              totalSolved: u.totalSolved ?? u.todaySolved ?? 0,
              todaySolved: isToday ? u.todaySolved : 0,
              leetcode: isToday ? u.solvedLc : 0,
              codeforces: isToday ? u.solvedCf : 0,
              codechef: isToday ? u.solvedCc : 0,
              lastUpdated: u.lastUpdated.toISOString(),
            },
            lastDailyDate: u.lastDailyDate,
            lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
            createdAt: u.createdAt.toISOString(),
          };
        });
      } catch (err: any) {
        console.warn('Prisma getUsers fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    return dbData.users.map((u) => {
      const isToday = u.lastDailyDate === todayDateStr;
      return {
        ...u,
        stats: {
          ...u.stats,
          todaySolved: isToday ? u.stats.todaySolved : 0,
          leetcode: isToday ? u.stats.leetcode : 0,
          codeforces: isToday ? u.stats.codeforces : 0,
          codechef: isToday ? u.stats.codechef : 0,
        },
      };
    });
  },

  async getUserById(id: string): Promise<User | undefined> {
    const todayDateStr = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) {
          const isToday = u.lastDailyDate === todayDateStr;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as 'user' | 'admin',
            handles: {
              leetcode: u.leetcode,
              codeforces: u.codeforces,
              codechef: u.codechef,
            },
            stats: {
              totalSolved: u.totalSolved ?? u.todaySolved ?? 0,
              todaySolved: isToday ? u.todaySolved : 0,
              leetcode: isToday ? u.solvedLc : 0,
              codeforces: isToday ? u.solvedCf : 0,
              codechef: isToday ? u.solvedCc : 0,
              lastUpdated: u.lastUpdated.toISOString(),
            },
            lastDailyDate: u.lastDailyDate,
            lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Prisma getUserById fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    const u = dbData.users.find((u) => u.id === id);
    if (!u) return undefined;
    const isToday = u.lastDailyDate === todayDateStr;
    return {
      ...u,
      stats: {
        ...u.stats,
        todaySolved: isToday ? u.stats.todaySolved : 0,
        leetcode: isToday ? u.stats.leetcode : 0,
        codeforces: isToday ? u.stats.codeforces : 0,
        codechef: isToday ? u.stats.codechef : 0,
      },
    };
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    const todayDateStr = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const u = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (u) {
          const isToday = u.lastDailyDate === todayDateStr;
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            passwordHash: u.passwordHash,
            role: u.role as 'user' | 'admin',
            handles: {
              leetcode: u.leetcode,
              codeforces: u.codeforces,
              codechef: u.codechef,
            },
            stats: {
              totalSolved: u.totalSolved ?? u.todaySolved ?? 0,
              todaySolved: isToday ? u.todaySolved : 0,
              leetcode: isToday ? u.solvedLc : 0,
              codeforces: isToday ? u.solvedCf : 0,
              codechef: isToday ? u.solvedCc : 0,
              lastUpdated: u.lastUpdated.toISOString(),
            },
            lastDailyDate: u.lastDailyDate,
            lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Prisma getUserByEmail fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    const u = dbData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!u) return undefined;
    const isToday = u.lastDailyDate === todayDateStr;
    return {
      ...u,
      stats: {
        ...u.stats,
        todaySolved: isToday ? u.stats.todaySolved : 0,
        leetcode: isToday ? u.stats.leetcode : 0,
        codeforces: isToday ? u.stats.codeforces : 0,
        codechef: isToday ? u.stats.codechef : 0,
      },
    };
  },

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'stats'>): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const newUser: User = {
      ...user,
      id,
      stats: {
        totalSolved: 0,
        todaySolved: 0,
        leetcode: 0,
        codeforces: 0,
        codechef: 0,
        lastUpdated: now.toISOString(),
      },
      createdAt: now.toISOString(),
    };

    if (hasPostgresUrl()) {
      try {
        await prisma.user.create({
          data: {
            id,
            name: user.name,
            email: user.email.toLowerCase(),
            passwordHash: user.passwordHash,
            role: user.role || 'user',
            leetcode: user.handles?.leetcode || '',
            codeforces: user.handles?.codeforces || '',
            codechef: user.handles?.codechef || '',
            todaySolved: 0,
            solvedLc: 0,
            solvedCf: 0,
            solvedCc: 0,
            lastUpdated: now,
            createdAt: now,
          },
        });
      } catch (err: any) {
        console.warn('Prisma createUser error:', err.message);
      }
    }

    // Mirror to local file for safety
    const dbData = ensureDbFile();
    dbData.users.push(newUser);
    saveDb(dbData);

    return newUser;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (hasPostgresUrl()) {
      try {
        const updated = await prisma.user.update({
          where: { id },
          data: {
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.handles?.leetcode !== undefined ? { leetcode: updates.handles.leetcode } : {}),
            ...(updates.handles?.codeforces !== undefined ? { codeforces: updates.handles.codeforces } : {}),
            ...(updates.handles?.codechef !== undefined ? { codechef: updates.handles.codechef } : {}),
            ...(updates.lastSyncAt ? { lastSyncAt: new Date(updates.lastSyncAt) } : {}),
          },
        });

        return {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          passwordHash: updated.passwordHash,
          role: updated.role as 'user' | 'admin',
          handles: {
            leetcode: updated.leetcode,
            codeforces: updated.codeforces,
            codechef: updated.codechef,
          },
          stats: {
            totalSolved: updated.totalSolved ?? updated.todaySolved ?? 0,
            todaySolved: updated.todaySolved,
            leetcode: updated.solvedLc,
            codeforces: updated.solvedCf,
            codechef: updated.solvedCc,
            lastUpdated: updated.lastUpdated.toISOString(),
          },
          lastSyncAt: updated.lastSyncAt ? updated.lastSyncAt.toISOString() : undefined,
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (err: any) {
        console.warn('Prisma updateUser error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    const index = dbData.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    dbData.users[index] = {
      ...dbData.users[index],
      ...updates,
      handles: {
        ...dbData.users[index].handles,
        ...(updates.handles || {}),
      },
    };

    saveDb(dbData);
    return dbData.users[index];
  },

  async adminOverwriteUser(id: string, updates: AdminUserOverwriteInput): Promise<User | null> {
    const today = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (!existing) return null;

        const updated = await prisma.user.update({
          where: { id },
          data: {
            ...(updates.name ? { name: updates.name.trim() } : {}),
            ...(updates.handles?.leetcode !== undefined ? { leetcode: updates.handles.leetcode.trim() } : {}),
            ...(updates.handles?.codeforces !== undefined ? { codeforces: updates.handles.codeforces.trim() } : {}),
            ...(updates.handles?.codechef !== undefined ? { codechef: updates.handles.codechef.trim() } : {}),
            ...(updates.stats?.totalSolved !== undefined ? { totalSolved: updates.stats.totalSolved } : {}),
            ...(updates.stats?.todaySolved !== undefined ? { todaySolved: updates.stats.todaySolved } : {}),
            ...(updates.stats?.leetcode !== undefined ? { solvedLc: updates.stats.leetcode } : {}),
            ...(updates.stats?.codeforces !== undefined ? { solvedCf: updates.stats.codeforces } : {}),
            ...(updates.stats?.codechef !== undefined ? { solvedCc: updates.stats.codechef } : {}),
            ...(updates.resetCooldown ? { lastSyncAt: null } : {}),
            lastDailyDate: today,
            lastUpdated: new Date(),
          },
        });

        return {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          passwordHash: updated.passwordHash,
          role: updated.role as 'user' | 'admin',
          handles: {
            leetcode: updated.leetcode,
            codeforces: updated.codeforces,
            codechef: updated.codechef,
          },
          stats: {
            totalSolved: updated.totalSolved,
            todaySolved: updated.todaySolved,
            leetcode: updated.solvedLc,
            codeforces: updated.solvedCf,
            codechef: updated.solvedCc,
            lastUpdated: updated.lastUpdated.toISOString(),
          },
          lastDailyDate: updated.lastDailyDate,
          lastSyncAt: updated.lastSyncAt ? updated.lastSyncAt.toISOString() : undefined,
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (err: any) {
        console.warn('Prisma adminOverwriteUser error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    const index = dbData.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    if (updates.name) dbData.users[index].name = updates.name.trim();
    if (updates.handles) {
      dbData.users[index].handles = {
        ...dbData.users[index].handles,
        ...updates.handles,
      };
    }
    if (updates.stats) {
      dbData.users[index].stats = {
        ...dbData.users[index].stats,
        ...(updates.stats.totalSolved !== undefined ? { totalSolved: updates.stats.totalSolved } : {}),
        ...(updates.stats.todaySolved !== undefined ? { todaySolved: updates.stats.todaySolved } : {}),
        ...(updates.stats.leetcode !== undefined ? { leetcode: updates.stats.leetcode } : {}),
        ...(updates.stats.codeforces !== undefined ? { codeforces: updates.stats.codeforces } : {}),
        ...(updates.stats.codechef !== undefined ? { codechef: updates.stats.codechef } : {}),
        lastUpdated: new Date().toISOString(),
      };
    }
    if (updates.resetCooldown) {
      delete dbData.users[index].lastSyncAt;
    }
    dbData.users[index].lastDailyDate = today;

    saveDb(dbData);
    return dbData.users[index];
  },

  async updateUserStats(
    id: string,
    stats: UserStats,
    lastSyncAt?: string,
    todayDateStr?: string
  ): Promise<User | null> {
    const today = todayDateStr || getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (existing) {
          const isSameDay = existing.lastDailyDate === today;
          const currentTotal = existing.totalSolved ?? existing.todaySolved ?? 0;
          const currentToday = existing.todaySolved ?? 0;

          // When resyncing on the same day, prior days' cumulative total is:
          const priorDaysTotal = isSameDay
            ? Math.max(0, currentTotal - currentToday)
            : currentTotal;

          const safeLc = stats.leetcode ?? 0;
          const safeCf = stats.codeforces ?? 0;
          const safeCc = stats.codechef ?? 0;
          const safeTodaySolved = safeLc + safeCf + safeCc;
          const newTotal = priorDaysTotal + safeTodaySolved;

          const updated = await prisma.user.update({
            where: { id },
            data: {
              totalSolved: newTotal,
              todaySolved: safeTodaySolved,
              solvedLc: safeLc,
              solvedCf: safeCf,
              solvedCc: safeCc,
              lastDailyDate: today,
              lastUpdated: new Date(stats.lastUpdated || Date.now()),
              ...(lastSyncAt ? { lastSyncAt: new Date(lastSyncAt) } : {}),
            },
          });

          return {
            id: updated.id,
            name: updated.name,
            email: updated.email,
            passwordHash: updated.passwordHash,
            role: updated.role as 'user' | 'admin',
            handles: {
              leetcode: updated.leetcode,
              codeforces: updated.codeforces,
              codechef: updated.codechef,
            },
            stats: {
              totalSolved: updated.totalSolved ?? updated.todaySolved ?? 0,
              todaySolved: updated.todaySolved,
              leetcode: updated.solvedLc,
              codeforces: updated.solvedCf,
              codechef: updated.solvedCc,
              lastUpdated: updated.lastUpdated.toISOString(),
            },
            lastDailyDate: updated.lastDailyDate,
            lastSyncAt: updated.lastSyncAt ? updated.lastSyncAt.toISOString() : undefined,
            createdAt: updated.createdAt.toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Prisma updateUserStats error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    const index = dbData.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const existingUser = dbData.users[index];
    const isSameDay = existingUser.lastDailyDate === today;
    const currentTotal = existingUser.stats?.totalSolved ?? existingUser.stats?.todaySolved ?? 0;
    const currentToday = existingUser.stats?.todaySolved ?? 0;

    const priorDaysTotal = isSameDay
      ? Math.max(0, currentTotal - currentToday)
      : currentTotal;

    const safeLc = stats.leetcode ?? 0;
    const safeCf = stats.codeforces ?? 0;
    const safeCc = stats.codechef ?? 0;
    const safeTodaySolved = safeLc + safeCf + safeCc;
    const newTotal = priorDaysTotal + safeTodaySolved;

    dbData.users[index].stats = {
      totalSolved: newTotal,
      todaySolved: safeTodaySolved,
      leetcode: safeLc,
      codeforces: safeCf,
      codechef: safeCc,
      lastUpdated: stats.lastUpdated || new Date().toISOString(),
    };
    dbData.users[index].lastDailyDate = today;
    if (lastSyncAt) {
      dbData.users[index].lastSyncAt = lastSyncAt;
    }
    saveDb(dbData);
    return dbData.users[index];
  },

  async setLastGlobalSync(timestamp: string) {
    if (hasPostgresUrl()) {
      try {
        await prisma.globalMeta.upsert({
          where: { key: 'lastGlobalSync' },
          create: { key: 'lastGlobalSync', value: timestamp },
          update: { value: timestamp },
        });
      } catch (err: any) {
        console.warn('Prisma setLastGlobalSync error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    dbData.lastGlobalSync = timestamp;
    saveDb(dbData);
  },

  async getLastGlobalSync(): Promise<string | undefined> {
    if (hasPostgresUrl()) {
      try {
        const row = await prisma.globalMeta.findUnique({
          where: { key: 'lastGlobalSync' },
        });
        if (row) return row.value;
      } catch (err: any) {
        console.warn('Prisma getLastGlobalSync error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    return dbData.lastGlobalSync;
  },

  async recordPageView(): Promise<{ totalViews: number; todayViews: number }> {
    const today = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const rows = await prisma.globalMeta.findMany({
          where: { key: { in: ['views_total', 'views_today', 'views_today_date'] } },
        });

        let total = 0;
        let todayCount = 0;
        let recordedDate = '';

        for (const row of rows) {
          if (row.key === 'views_total') total = parseInt(row.value, 10) || 0;
          if (row.key === 'views_today') todayCount = parseInt(row.value, 10) || 0;
          if (row.key === 'views_today_date') recordedDate = row.value;
        }

        total += 1;
        if (recordedDate === today) {
          todayCount += 1;
        } else {
          todayCount = 1;
          recordedDate = today;
        }

        await prisma.$transaction([
          prisma.globalMeta.upsert({
            where: { key: 'views_total' },
            create: { key: 'views_total', value: String(total) },
            update: { value: String(total) },
          }),
          prisma.globalMeta.upsert({
            where: { key: 'views_today' },
            create: { key: 'views_today', value: String(todayCount) },
            update: { value: String(todayCount) },
          }),
          prisma.globalMeta.upsert({
            where: { key: 'views_today_date' },
            create: { key: 'views_today_date', value: recordedDate },
            update: { value: recordedDate },
          }),
        ]);

        return { totalViews: total, todayViews: todayCount };
      } catch (err: any) {
        console.warn('Prisma recordPageView error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    if (!dbData.views) {
      dbData.views = { total: 0, today: 0, date: today };
    }
    dbData.views.total += 1;
    if (dbData.views.date === today) {
      dbData.views.today += 1;
    } else {
      dbData.views.today = 1;
      dbData.views.date = today;
    }
    saveDb(dbData);
    return { totalViews: dbData.views.total, todayViews: dbData.views.today };
  },

  async getPageViews(): Promise<{ totalViews: number; todayViews: number }> {
    const today = getTodayDateString();
    if (hasPostgresUrl()) {
      try {
        const rows = await prisma.globalMeta.findMany({
          where: { key: { in: ['views_total', 'views_today', 'views_today_date'] } },
        });

        let total = 0;
        let todayCount = 0;
        let recordedDate = '';

        for (const row of rows) {
          if (row.key === 'views_total') total = parseInt(row.value, 10) || 0;
          if (row.key === 'views_today') todayCount = parseInt(row.value, 10) || 0;
          if (row.key === 'views_today_date') recordedDate = row.value;
        }

        return {
          totalViews: total,
          todayViews: recordedDate === today ? todayCount : 0,
        };
      } catch (err: any) {
        console.warn('Prisma getPageViews error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    if (!dbData.views) {
      return { totalViews: 0, todayViews: 0 };
    }
    return {
      totalViews: dbData.views.total,
      todayViews: dbData.views.date === today ? dbData.views.today : 0,
    };
  },
};
