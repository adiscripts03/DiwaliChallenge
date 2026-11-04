/**
 * Date and timezone utilities for the GDG Diwali Challenge.
 * Challenge operates in Asia/Kolkata (IST - UTC+05:30).
 */

export const CHALLENGE_TIMEZONE = process.env.NEXT_PUBLIC_TIMEZONE || 'Asia/Kolkata';

/**
 * Official Diwali Day in the 2026 challenge: November 8, 2026 (Asia/Kolkata).
 */
export const DIWALI_DATE_STRING = '2026-11-08';

/**
 * Returns today's date string (e.g. "2026-11-08") in the target timezone (Asia/Kolkata).
 */
export function getTodayDateString(timeZone: string = CHALLENGE_TIMEZONE): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now);
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Checks whether the current date in IST (Asia/Kolkata) is Diwali Day (2026-11-08).
 */
export function isDiwaliDay(timeZone: string = CHALLENGE_TIMEZONE): boolean {
  return getTodayDateString(timeZone) === DIWALI_DATE_STRING;
}

/**
 * Returns midnight timestamp (epoch seconds) for today in the given timezone.
 * Explicitly parses IST (+05:30 offset) to guarantee correct midnight epoch
 * regardless of whether the host server runs in UTC (e.g. Render/AWS/Docker) or local time.
 */
export function getStartOfTodayTimestamp(timeZone: string = CHALLENGE_TIMEZONE): number {
  try {
    const todayStr = getTodayDateString(timeZone);
    // Asia/Kolkata has a constant UTC+05:30 offset with no daylight saving time.
    const midnightIST = new Date(`${todayStr}T00:00:00+05:30`);
    return Math.floor(midnightIST.getTime() / 1000);
  } catch {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);
    return Math.floor(now.getTime() / 1000);
  }
}

