import axios from 'axios';

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

  try {
    const url = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(
      handle.trim()
    )}&from=1&count=50`;

    const response = await axios.get(url, {
      timeout: 9000,
      headers: {
        'User-Agent': 'CodingLeaderboardApp/1.0 (Educational API Project)',
      },
    });

    if (response.data?.status !== 'OK') {
      throw new Error(response.data?.comment || 'Codeforces API failed');
    }

    const submissions = response.data.result || [];
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
      handle,
      count: uniqueProblems.size,
      problems: Array.from(uniqueProblems),
    };
  } catch (error: any) {
    console.warn(`Codeforces fetch failed for "${handle}":`, error.message);
    return {
      platform: 'codeforces',
      handle,
      count: 0,
      problems: [],
      error: error.message,
    };
  }
}

