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
    const recentRes = await axios.get(recentUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
      },
      timeout: 10000,
    });

    if (recentRes.data?.content) {
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

        // Parse submission time to ensure it occurred today
        let subMs = 0;
        if (timeStr.includes('ago')) {
          // e.g. "5 hours ago", "30 minutes ago", "10 seconds ago"
          const match = timeStr.match(/(\d+)\s*(sec|min|hour|day)/i);
          if (match) {
            const val = parseInt(match[1], 10);
            const unit = match[2].toLowerCase();
            const mult =
              unit.startsWith('sec')
                ? 1000
                : unit.startsWith('min')
                ? 60 * 1000
                : unit.startsWith('hour')
                ? 3600 * 1000
                : 86400 * 1000;
            subMs = nowMs - val * mult;
          }
        } else {
          // e.g. "10:32 PM 27/10/26"
          const parsed = Date.parse(timeStr);
          if (!isNaN(parsed)) subMs = parsed;
        }

        if (subMs >= sinceMs) {
          uniqueAcceptedProblems.add(problemCode);
        }
      });
    }

    // Fallback: If recent endpoint found accepted solves, return them
    if (uniqueAcceptedProblems.size > 0) {
      return {
        platform: 'codechef',
        handle: cleanHandle,
        count: uniqueAcceptedProblems.size,
        problems: Array.from(uniqueAcceptedProblems),
      };
    }

    // Strategy 2: Heatmap fallback if recent API fails or table is empty
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
        const targetDate = new Date(sinceTimestamp * 1000);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const day = targetDate.getDate();

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
