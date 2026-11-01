/**
 * Extracts and sanitizes the username/handle from either a plain handle,
 * a handle with @ prefix, or a full profile URL.
 */
export function sanitizeHandle(
  input: string | undefined | null,
  platform?: 'leetcode' | 'codeforces' | 'codechef'
): string {
  if (!input) return '';
  let h = input.trim();

  // Strip trailing slashes
  h = h.replace(/\/+$/, '');

  // If user pasted a full URL
  if (h.includes('leetcode.com')) {
    const match = h.match(/leetcode\.com\/(?:u\/)?([^\/\?#]+)/i);
    if (match) return match[1];
  }
  if (h.includes('codeforces.com')) {
    const match = h.match(/codeforces\.com\/(?:profile\/)?([^\/\?#]+)/i);
    if (match) return match[1];
  }
  if (h.includes('codechef.com')) {
    const match = h.match(/codechef\.com\/(?:users\/)?([^\/\?#]+)/i);
    if (match) return match[1];
  }

  // If user pasted any general URL, take the last path segment
  if (h.startsWith('http://') || h.startsWith('https://')) {
    try {
      const url = new URL(h);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        return parts[parts.length - 1];
      }
    } catch {
      // ignore
    }
  }

  // Strip leading @
  h = h.replace(/^@/, '');

  return h;
}

