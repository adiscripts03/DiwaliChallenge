import axios from 'axios';

export interface LeetCodeResult {
  platform: 'leetcode';
  handle: string;
  count: number;
  problems: string[];
  error?: string;
}

const LEETCODE_GRAPHQL_URL = 'https://leetcode.com/graphql';

const RECENT_AC_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

/**
 * Fetches unique problems solved on LeetCode since a given timestamp.
 * @param handle LeetCode username
 * @param sinceTimestamp Epoch seconds timestamp
 */
export async function fetchLeetCodeSolved(
  handle: string,
  sinceTimestamp: number
): Promise<LeetCodeResult> {
  if (!handle || handle.trim() === '') {
    return { platform: 'leetcode', handle: '', count: 0, problems: [] };
  }

  try {
    const response = await axios.post(
      LEETCODE_GRAPHQL_URL,
      {
        query: RECENT_AC_QUERY,
        variables: { username: handle.trim(), limit: 100 },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        },
        timeout: 9000,
      }
    );

    const submissions = response.data?.data?.recentAcSubmissionList || [];
    const uniqueProblems = new Set<string>();

    for (const sub of submissions) {
      const subTime = parseInt(sub.timestamp, 10);
      if (subTime >= sinceTimestamp) {
        uniqueProblems.add(sub.title || sub.titleSlug);
      }
    }

    return {
      platform: 'leetcode',
      handle,
      count: uniqueProblems.size,
      problems: Array.from(uniqueProblems),
    };
  } catch (error: any) {
    console.warn(`LeetCode fetch failed for "${handle}":`, error.message);
    return {
      platform: 'leetcode',
      handle,
      count: 0,
      problems: [],
      error: error.message,
    };
  }
}

