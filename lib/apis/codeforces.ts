export interface CodeforcesResult {
  platform: 'codeforces';
  handle: string;
  count: number;
  problems: string[];
  error?: string;
}

/**
 * Fetches unique problems solved on Codeforces since a given timestamp.
 * @param handle Codeforces username
 * @param sinceTimestamp Epoch seconds timestamp
 */
export async function fetchCodeforcesSolved(
  handle: string,
  sinceTimestamp: number
): Promise<CodeforcesResult> {
  if (!handle || handle.trim() === '') {
    return { platform: 'codeforces', handle: '', count: 0, problems: [] };
  }

  const cleanHandle = handle.trim();
  const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
    cleanHandle
  )}&from=1&count=100`;

  // Codeforces API can experience high peak-load latency (up to 12-15s) and Cloudflare rate limiting.
  // We use native fetch with standard browser headers, a generous 22s timeout, and 1 retry.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(22000),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data?.status !== 'OK') {
        throw new Error(data?.comment || 'Codeforces API failed');
      }

      const submissions = data.result || [];
      const uniqueProblems = new Set<string>();

      for (const sub of submissions) {
        if (sub.creationTimeSeconds < sinceTimestamp) {
          continue;
        }

        if (sub.verdict === 'OK' && sub.problem) {
          const id = `${sub.problem.contestId || ''}${sub.problem.index || ''} - ${
            sub.problem.name || 'Problem'
          }`;
          uniqueProblems.add(id);
        }
      }

      return {
        platform: 'codeforces',
        handle: cleanHandle,
        count: uniqueProblems.size,
        problems: Array.from(uniqueProblems),
      };
    } catch (error: any) {
      if (attempt === 1) {
        console.warn(`Codeforces attempt 1 failed for "${cleanHandle}" (${error.message}), retrying...`);
        // Wait 1.5s before retry to clear Codeforces per-second rate limit
        await new Promise((r) => setTimeout(r, 1500));
      } else {
        console.warn(`Codeforces fetch failed for "${cleanHandle}":`, error.message);
        return {
          platform: 'codeforces',
          handle: cleanHandle,
          count: 0,
          problems: [],
          error: error.message,
        };
      }
    }
  }

  return {
    platform: 'codeforces',
    handle: cleanHandle,
    count: 0,
    problems: [],
  };
}

