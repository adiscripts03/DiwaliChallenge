import { prisma } from '../lib/prisma';
import fs from 'fs';
import path from 'path';

async function migrate() {
  if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith('postgres')) {
    console.log('No valid DATABASE_URL found yet in .env.local');
    return;
  }
  const dbFile = path.join(process.cwd(), 'data', 'db.json');
  if (!fs.existsSync(dbFile)) return;

  const data = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));
  console.log('Found', data.users.length, 'users to migrate into Postgres...');

  for (const u of data.users) {
    await prisma.user.upsert({
      where: { email: u.email.toLowerCase() },
      create: {
        id: u.id,
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash: u.passwordHash,
        role: u.role || 'user',
        leetcode: u.handles?.leetcode || '',
        codeforces: u.handles?.codeforces || '',
        codechef: u.handles?.codechef || '',
        todaySolved: u.stats?.todaySolved || 0,
        solvedLc: u.stats?.leetcode || 0,
        solvedCf: u.stats?.codeforces || 0,
        solvedCc: u.stats?.codechef || 0,
        lastUpdated: new Date(u.stats?.lastUpdated || Date.now()),
        createdAt: new Date(u.createdAt || Date.now()),
      },
      update: {
        todaySolved: u.stats?.todaySolved || 0,
        solvedLc: u.stats?.leetcode || 0,
        solvedCf: u.stats?.codeforces || 0,
        solvedCc: u.stats?.codechef || 0,
      },
    });
    console.log('Migrated user:', u.name, u.email);
  }
  console.log('Migration complete!');
}

migrate()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

