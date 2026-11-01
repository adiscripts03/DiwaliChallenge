import fs from 'fs';
import path from 'path';
import { prisma } from './prisma';

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
  lastSyncAt?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  lastGlobalSync?: string;
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
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgres'));
}

export const db = {
  async getUsers(): Promise<User[]> {
    if (hasPostgresUrl()) {
      try {
        const rows = await prisma.user.findMany({
          orderBy: [{ totalSolved: 'desc' }, { todaySolved: 'desc' }],
        });
        return rows.map((u) => ({
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
            todaySolved: u.todaySolved,
            leetcode: u.solvedLc,
            codeforces: u.solvedCf,
            codechef: u.solvedCc,
            lastUpdated: u.lastUpdated.toISOString(),
          },
          lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
          createdAt: u.createdAt.toISOString(),
        }));
      } catch (err: any) {
        console.warn('Prisma getUsers fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    return dbData.users;
  },

  async getUserById(id: string): Promise<User | undefined> {
    if (hasPostgresUrl()) {
      try {
        const u = await prisma.user.findUnique({ where: { id } });
        if (u) {
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
              todaySolved: u.todaySolved,
              leetcode: u.solvedLc,
              codeforces: u.solvedCf,
              codechef: u.solvedCc,
              lastUpdated: u.lastUpdated.toISOString(),
            },
            lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Prisma getUserById fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    return dbData.users.find((u) => u.id === id);
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (hasPostgresUrl()) {
      try {
        const u = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (u) {
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
              todaySolved: u.todaySolved,
              leetcode: u.solvedLc,
              codeforces: u.solvedCf,
              codechef: u.solvedCc,
              lastUpdated: u.lastUpdated.toISOString(),
            },
            lastSyncAt: u.lastSyncAt ? u.lastSyncAt.toISOString() : undefined,
            createdAt: u.createdAt.toISOString(),
          };
        }
      } catch (err: any) {
        console.warn('Prisma getUserByEmail fallback to local file:', err.message);
      }
    }
    const dbData = ensureDbFile();
    return dbData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
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
        await prisma.user.update({
          where: { id },
          data: {
            ...(updates.name ? { name: updates.name } : {}),
            ...(updates.handles?.leetcode !== undefined ? { leetcode: updates.handles.leetcode } : {}),
            ...(updates.handles?.codeforces !== undefined ? { codeforces: updates.handles.codeforces } : {}),
            ...(updates.handles?.codechef !== undefined ? { codechef: updates.handles.codechef } : {}),
            ...(updates.lastSyncAt ? { lastSyncAt: new Date(updates.lastSyncAt) } : {}),
          },
        });
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

  async updateUserStats(
    id: string,
    stats: UserStats,
    lastSyncAt?: string,
    todayDateStr?: string
  ): Promise<User | null> {
    if (hasPostgresUrl()) {
      try {
        const existing = await prisma.user.findUnique({ where: { id } });
        if (existing) {
          const isSameDay = existing.lastDailyDate === todayDateStr;
          let newTotal = existing.totalSolved;

          if (isSameDay) {
            // Updated earlier today: adjust total by diff in today's solves
            const diff = stats.todaySolved - existing.todaySolved;
            newTotal = Math.max(0, existing.totalSolved + diff);
          } else {
            // First sync of a new day: add today's solves to cumulative total
            newTotal = existing.totalSolved + stats.todaySolved;
          }

          await prisma.user.update({
            where: { id },
            data: {
              totalSolved: newTotal,
              todaySolved: stats.todaySolved,
              solvedLc: stats.leetcode,
              solvedCf: stats.codeforces,
              solvedCc: stats.codechef,
              lastDailyDate: todayDateStr || existing.lastDailyDate,
              lastUpdated: new Date(stats.lastUpdated || Date.now()),
              ...(lastSyncAt ? { lastSyncAt: new Date(lastSyncAt) } : {}),
            },
          });
        }
      } catch (err: any) {
        console.warn('Prisma updateUserStats error:', err.message);
      }
    }

    const dbData = ensureDbFile();
    const index = dbData.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    dbData.users[index].stats = stats;
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
};
