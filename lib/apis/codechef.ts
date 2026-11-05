import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

export const MIN_CODECHEF_RATING = 800;

export interface CodeChefResult {
  platform: 'codechef';
  handle: string;
  count: number;
  problems: string[];
  totalSolved?: number;
  error?: string;
}

// In-memory ratings cache backed by persistent file
const RATINGS_CACHE_FILE = path.join(process.cwd(), 'data', 'codechef_ratings.json');
const problemRatingsMap = new Map<string, number | null>();

// Initialize cache from disk if available
try {
  if (fs.existsSync(RATINGS_CACHE_FILE)) {
    const raw = fs.readFileSync(RATINGS_CACHE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    for (const [k, v] of Object.entries(parsed)) {
      problemRatingsMap.set(k, typeof v === 'number' ? v : null);
    }
  }
} catch {
  // Graceful fallback if file is not accessible
}

function persistRatingsCache() {
  try {
    const obj: Record<string, number | null> = {};
    problemRatingsMap.forEach((v, k) => {
      obj[k] = v;
    });
    const dir = path.dirname(RATINGS_CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(RATINGS_CACHE_FILE, JSON.stringify(obj, null, 2));
  } catch {}
}

/**
 * Fetches difficulty rating for a CodeChef problem with aggressive caching.
 * Returns null if the problem is unrated or does not exist.
 */
export async function getCodeChefProblemRating(problemCode: string): Promise<number | null> {
  const code = problemCode.trim();
  if (!code) return null;

  if (problemRatingsMap.has(code)) {
    return problemRatingsMap.get(code)!;
  }

  try {
    const url = `https://www.codechef.com/api/contests/PRACTICE/problems/${encodeURIComponent(code)}`;
    const res = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
      },
      timeout: 6000,
    });

    if (res.data?.status === 'success' && res.data.difficulty_rating !== undefined && res.data.difficulty_rating !== null) {
      const rating = Number(res.data.difficulty_rating);
      problemRatingsMap.set(code, rating);
      return rating;
    }
  } catch {}

  problemRatingsMap.set(code, null);
  return null;
}

/**
 * Filters a set of problem codes strictly by minimum difficulty rating.
 */
async function filterCodeChefProblemsByMinRating(
  problemCodes: string[],
  minRating: number = MIN_CODECHEF_RATING
): Promise<{ count: number; verifiedProblems: string[] }> {
  const verified: string[] = [];
  let cacheModified = false;

  // Process in parallel chunks to maximize speed without tripping rate limits
  const chunkSize = 15;
  for (let i = 0; i < problemCodes.length; i += chunkSize) {
    const chunk = problemCodes.slice(i, i + chunkSize);
    await Promise.all(
      chunk.map(async (code) => {
        const wasInCache = problemRatingsMap.has(code);
        const rating = await getCodeChefProblemRating(code);
        if (!wasInCache) cacheModified = true;

        if (rating !== null && rating >= minRating) {
          verified.push(`${code} [${rating}]`);
        }
      })
    );
  }

  if (cacheModified) {
    persistRatingsCache();
  }

  return { count: verified.length, verifiedProblems: verified };
}

/**
 * Helper to parse CodeChef submission timestamps into epoch ms.
 * Supports both relative ("23 hours ago", "5 min ago", "45 secs ago")
 * and absolute timestamps ("10:32 PM 27/10/26", format: hh:mm A DD/MM/YY in IST).
 */
function parseCodeChefTime(timeStr: string, nowMs: number): number {
  if (!timeStr) return 0;

  // Relative format: e.g. "5 hours ago", "30 minutes ago", "10 seconds ago", "1 day ago"
  const relMatch = timeStr.match(/(\d+)\s*(sec|min|hour|day)/i);
  if (relMatch) {
    const val = parseInt(relMatch[1], 10);
    const unit = relMatch[2].toLowerCase();
    const mult =
      unit.startsWith('sec')
        ? 1000
        : unit.startsWith('min')
        ? 60 * 1000
        : unit.startsWith('hour')
        ? 3600 * 1000
        : 86400 * 1000;
    return nowMs - val * mult;
  }

  // Absolute format: "hh:mm A DD/MM/YY" e.g. "10:32 PM 27/10/26" in IST (+05:30)
  const absMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i);
  if (absMatch) {
    const [, h, m, meridiem, d, mo, y] = absMatch;
    let hour = parseInt(h, 10);
    if (meridiem.toUpperCase() === 'PM' && hour < 12) hour += 12;
    if (meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0;
    let fullYear = parseInt(y, 10);
    if (fullYear < 100) fullYear += 2000;
    const minute = parseInt(m, 10);
    const day = parseInt(d, 10);
    const month = parseInt(mo, 10);
    const iso = `${fullYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00+05:30`;
    const t = new Date(iso).getTime();
    if (!isNaN(t)) return t;
  }

  const parsed = Date.parse(timeStr);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Fetches unique problems verified and accepted (100 pts) on CodeChef today.
 * Filters strictly for AC / Accepted (100) submissions.
 *
 * @param handle CodeChef username
 * @param sinceTimestamp Epoch seconds timestamp (start of today in IST)
 */
export async function fetchCodeChefSolved(
  handle: string,
  sinceTimestamp: number
): Promise<CodeChefResult> {
  if (!handle || handle.trim() === '') {
    return { platform: 'codechef', handle: '', count: 0, problems: [] };
  }

  const cleanHandle = handle.trim();

  try {
    const uniqueAcceptedProblems = new Set<string>();
    const nowMs = Date.now();
    const sinceMs = sinceTimestamp * 1000;
    let recentApiSucceeded = false;
    const profileUrl = `https://www.codechef.com/users/${encodeURIComponent(cleanHandle)}`;

    // Prime session cookies by loading profile first (bypasses Cloudflare / Drupal 429 WAF)
    let sessionCookies = '';
    try {
      const initProfileRes = await axios.get(profileUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000,
      });
      sessionCookies = initProfileRes.headers['set-cookie']?.map((c: string) => c.split(';')[0]).join('; ') || '';
    } catch {
      // Continue even if profile priming had an error
    }

    // Strategy 1: Fetch recent submissions across multiple pages (up to 20 pages = ~260 submissions)
    // CodeChef exposes /recent/user?page=X&user_handle=<handle>
    // Submissions are chronologically descending (newest first).
    const maxPages = 20;
    for (let page = 0; page < maxPages; page++) {
      const recentUrl = `https://www.codechef.com/recent/user?page=${page}&user_handle=${encodeURIComponent(cleanHandle)}`;
      let recentRes: any = null;

      // Retry mechanism on 429 (Too Many Requests) with backoff
      for (let attempt = 1; attempt <= 4; attempt++) {
        try {
          recentRes = await axios.get(recentUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
              Accept: 'application/json, text/javascript, */*; q=0.01',
              'X-Requested-With': 'XMLHttpRequest',
              Referer: profileUrl,
              ...(sessionCookies ? { Cookie: sessionCookies } : {}),
            },
            timeout: 12000,
          });
          break;
        } catch (recentErr: any) {
          if (recentErr.response?.status === 429 && attempt < 4) {
            const backoffMs = attempt * 1800;
            await new Promise((r) => setTimeout(r, backoffMs));
          } else {
            if (page === 0) {
              console.warn(`CodeChef /recent endpoint failed for "${cleanHandle}":`, recentErr.message);
            }
            break;
          }
        }
      }

      if (recentRes?.data?.content && recentRes.data.content.includes('<table')) {
        recentApiSucceeded = true;
        const $ = cheerio.load(recentRes.data.content);
        let validRowsOnPage = 0;
        let pageHasOlderThanToday = false;

        $('tr').each((idx, row) => {
          if (idx === 0) return; // skip header
          const tds = $(row).find('td');
          if (tds.length < 3) return;

          validRowsOnPage++;
          const timeStr = $(tds[0]).text().trim();
          const problemLink = $(tds[1]).find('a').first();
          const problemCode = (problemLink.text() || $(tds[1]).text()).trim();

          // Check if accepted: result contains '(100)' or status icon is tick-icon / accepted
          const resultSpan = $(tds[2]).find('span[title]').first().attr('title') || '';
          const resultText = $(tds[2]).text().trim();
          const isAccepted =
            resultSpan.toLowerCase() === 'accepted' ||
            resultText.includes('(100)') ||
            $(tds[2]).find('img[src*="tick"]').length > 0;

          if (!problemCode) return;

          const subMs = parseCodeChefTime(timeStr, nowMs);
          if (subMs > 0 && subMs < sinceMs) {
            pageHasOlderThanToday = true;
          }

          if (isAccepted && subMs >= sinceMs) {
            uniqueAcceptedProblems.add(problemCode);
          }
        });

        // If no rows were found on this page, or submissions have gone past today's start, stop fetching further pages
        if (validRowsOnPage === 0 || pageHasOlderThanToday) {
          break;
        }

        // Polite pacing to avoid triggering Cloudflare 429 rate limit
        await new Promise((r) => setTimeout(r, 600));
      } else {
        break;
      }
    }

    if (recentApiSucceeded) {
      // Filter strictly for questions with difficulty rating >= 800
      const { count, verifiedProblems } = await filterCodeChefProblemsByMinRating(
        Array.from(uniqueAcceptedProblems),
        MIN_CODECHEF_RATING
      );

      return {
        platform: 'codechef',
        handle: cleanHandle,
        count,
        problems: verifiedProblems,
      };
    }

    // If recent API could not retrieve individual problem codes, we cannot verify the 800+ rating requirement.
    // Return 0 rather than granting unrated submissions.
    return {
      platform: 'codechef',
      handle: cleanHandle,
      count: 0,
      problems: [],
    };
  } catch (error: any) {
    console.warn(`CodeChef fetch failed for "${cleanHandle}":`, error.message);
    return {
      platform: 'codechef',
      handle: cleanHandle,
      count: 0,
      problems: [],
      error: error.message,
    };
  }
}
