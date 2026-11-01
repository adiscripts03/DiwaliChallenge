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
 * Fetches problems/submissions solved on CodeChef for today.
 * CodeChef renders daily submission activity inside a userDailySubmissionsStats
 * JavaScript variable in the user profile page.
 *
 * @param handle CodeChef username
 * @param sinceTimestamp Epoch seconds timestamp (start of today)
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
    const url = `https://www.codechef.com/users/${encodeURIComponent(cleanHandle)}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
      },
      timeout: 12000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract total problems solved count (e.g., "Total Problems Solved: 1327")
    let totalSolved = 0;
    const totalMatch = $('h3:contains("Total Problems Solved:")').text().match(/(\d+)/);
    if (totalMatch) {
      totalSolved = parseInt(totalMatch[1], 10);
    }

    let challengeCount = 0;

    // Strategy 1: Check heatmap submission stats (userDailySubmissionsStats)
    // Format: [{ "date": "2026-11-1", "value": 3 }, ...]
    const heatmapMatch = html.match(/var\s+userDailySubmissionsStats\s*=\s*(\[[\s\S]*?\]);/);
    if (heatmapMatch) {
      try {
        const stats: Array<{ date: string; value: number }> = JSON.parse(heatmapMatch[1]);
        const sinceDate = new Date(sinceTimestamp * 1000);
        // Normalize sinceDate to midnight in local time
        const sinceMidnight = new Date(sinceDate.getFullYear(), sinceDate.getMonth(), sinceDate.getDate()).getTime();

        for (const entry of stats) {
          if (!entry.date || typeof entry.value !== 'number') continue;
          // Format in heatmap is YYYY-M-D or YYYY-MM-DD
          const parts = entry.date.split('-').map(Number);
          if (parts.length === 3) {
            const entryDate = new Date(parts[0], parts[1] - 1, parts[2]).getTime();
            if (entryDate >= sinceMidnight) {
              challengeCount += entry.value;
            }
          }
        }
      } catch (err: any) {
        console.warn(`Failed parsing userDailySubmissionsStats for ${cleanHandle}:`, err.message);
      }
    }

    // Strategy 2: If table rows or submissions exist in static HTML
    const uniqueProblems = new Set<string>();
    $('table.dataTable tbody tr').each((_, row) => {
      const text = $(row).text().toLowerCase();
      if (text.includes('100') || text.includes('accepted') || $(row).find('.tick').length > 0) {
        const problemLink = $(row).find('a[href*="/problems/"]').first();
        const problemCode = problemLink.text().trim();
        if (problemCode) {
          uniqueProblems.add(problemCode);
        }
      }
    });

    const count = challengeCount > 0 ? challengeCount : uniqueProblems.size;

    return {
      platform: 'codechef',
      handle: cleanHandle,
      count,
      problems: Array.from(uniqueProblems),
      totalSolved,
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


