import { prisma } from '../lib/prisma';
import { sanitizeHandle } from '../lib/utils/handles';
import { syncUserSolves } from '../lib/apis/tracker';

async function sanitizeExistingUsers() {
  console.log('Sanitizing any uncleaned URLs in database...');
  const users = await prisma.user.findMany();

  for (const u of users) {
    const cleanLc = sanitizeHandle(u.leetcode, 'leetcode');
    const cleanCf = sanitizeHandle(u.codeforces, 'codeforces');
    const cleanCc = sanitizeHandle(u.codechef, 'codechef');

    if (
      cleanLc !== u.leetcode ||
      cleanCf !== u.codeforces ||
      cleanCc !== u.codechef
    ) {
      console.log(`Fixing handles for user ${u.name}...`);
      await prisma.user.update({
        where: { id: u.id },
        data: {
          leetcode: cleanLc,
          codeforces: cleanCf,
          codechef: cleanCc,
        },
      });

      const updatedUser = {
        id: u.id,
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role as any,
        handles: {
          leetcode: cleanLc,
          codeforces: cleanCf,
          codechef: cleanCc,
        },
        stats: {
          todaySolved: u.todaySolved,
          leetcode: u.solvedLc,
          codeforces: u.solvedCf,
          codechef: u.solvedCc,
          lastUpdated: u.lastUpdated.toISOString(),
        },
        createdAt: u.createdAt.toISOString(),
      };

      await syncUserSolves(updatedUser);
    }
  }

  console.log('All existing user handles are clean and verified!');
}

sanitizeExistingUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

