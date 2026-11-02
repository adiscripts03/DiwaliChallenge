import axios from 'axios';
import * as cheerio from 'cheerio';

export interface CodeChefResult {
  platform: 'codechef';
  handle: string;
  count: number;
  problems: string[];
  totalSolved?: number;
  error?: string;
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

    // Strategy 1: Fetch recent submissions list for user
    // CodeChef exposes /recent/user?page=0&user_handle=<handle>
    const recentUrl = `https://www.codechef.com/recent/user?page=0&user_handle=${encodeURIComponent(cleanHandle)}`;
    let recentRes: any = null;
    try {
      recentRes = await axios.get(recentUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'X-Requested-With': 'XMLHttpRequest',
        },
        timeout: 10000,
      });
    } catch (recentErr: any) {
      console.warn(`CodeChef /recent endpoint failed for "${cleanHandle}":`, recentErr.message);
    }

    if (recentRes?.data?.content && recentRes.data.content.includes('<table')) {
      const $ = cheerio.load(recentRes.data.content);
      const nowMs = Date.now();
      const sinceMs = sinceTimestamp * 1000;

      $('tr').each((idx, row) => {
        if (idx === 0) return; // skip header
        const tds = $(row).find('td');
        if (tds.length < 3) return;

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

        if (!isAccepted || !problemCode) return;

        const subMs = parseCodeChefTime(timeStr, nowMs);
        if (subMs >= sinceMs) {
          uniqueAcceptedProblems.add(problemCode);
        }
      });

      // Ground truth obtained directly from verified submissions table
      return {
        platform: 'codechef',
        handle: cleanHandle,
        count: uniqueAcceptedProblems.size,
        problems: Array.from(uniqueAcceptedProblems),
      };
    }

    // Strategy 2: Heatmap fallback ONLY if recent API completely failed to respond
    const profileUrl = `https://www.codechef.com/users/${encodeURIComponent(cleanHandle)}`;
    const profileRes = await axios.get(profileUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });

    let heatmapCount = 0;
    const heatmapMatch = profileRes.data.match(/var\s+userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\]);/);
    if (heatmapMatch) {
      try {
        const stats: Array<{ date: string; value: number }> = JSON.parse(heatmapMatch[1]);
        
        // Parse date in Asia/Kolkata (IST) timezone
        const parts = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
        }).formatToParts(new Date(sinceTimestamp * 1000));

        const year = parts.find((p) => p.type === 'year')?.value;
        const month = parts.find((p) => p.type === 'month')?.value;
        const day = parts.find((p) => p.type === 'day')?.value;

        const targetKey = `${year}-${month}-${day}`;
        const targetKeyWithLeadingZeros = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const foundDay = stats.find(
          (entry) => entry.date === targetKey || entry.date === targetKeyWithLeadingZeros
        );
        if (foundDay && typeof foundDay.value === 'number') {
          heatmapCount = foundDay.value;
        }
      } catch {}
    }

    return {
      platform: 'codechef',
      handle: cleanHandle,
      count: heatmapCount,
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
