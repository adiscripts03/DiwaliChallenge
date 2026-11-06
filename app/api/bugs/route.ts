import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { isAdminAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userName, userEmail, coderHandle, category, message, deviceInfo, pageUrl } = body;

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please describe the bug in at least 5 characters.' },
        { status: 400 }
      );
    }

    if (message.length > 3000) {
      return NextResponse.json(
        { error: 'Bug message is too long (max 3000 characters).' },
        { status: 400 }
      );
    }

    // Try to auto-populate from authenticated user if available
    const loggedInUser = await getCurrentUser().catch(() => null);

    const effectiveName =
      (userName && String(userName).trim()) ||
      loggedInUser?.name ||
      'Anonymous Coder';

    const effectiveEmail =
      (userEmail && String(userEmail).trim()) ||
      loggedInUser?.email ||
      '';

    let effectiveHandle = (coderHandle && String(coderHandle).trim()) || '';
    if (!effectiveHandle && loggedInUser?.handles) {
      const handles = [];
      if (loggedInUser.handles.leetcode) handles.push(`LC:${loggedInUser.handles.leetcode}`);
      if (loggedInUser.handles.codeforces) handles.push(`CF:${loggedInUser.handles.codeforces}`);
      if (loggedInUser.handles.codechef) handles.push(`CC:${loggedInUser.handles.codechef}`);
      effectiveHandle = handles.join(' | ');
    }

    // Extract device/client info from headers if not provided
    const userAgent = deviceInfo || req.headers.get('user-agent') || 'Unknown Browser';
    const referer = pageUrl || req.headers.get('referer') || '';

    const bugReport = await db.createBugReport({
      userName: effectiveName,
      userEmail: effectiveEmail,
      coderHandle: effectiveHandle,
      category: category || 'other',
      message: message.trim(),
      deviceInfo: userAgent.slice(0, 500),
      pageUrl: referer.slice(0, 500),
    });

    // Optional webhook trigger (Discord/Slack/Telegram) if configured
    const webhookUrl = process.env.BUG_REPORT_WEBHOOK_URL;
    if (webhookUrl) {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `🐞 **New Bug Report Received!**\n**From:** ${effectiveName} (${effectiveEmail || 'No email'})\n**Category:** ${category || 'other'}\n**Handle:** ${effectiveHandle || 'N/A'}\n**Message:**\n> ${message.trim().replace(/\n/g, '\n> ')}`,
        }),
      }).catch((err) => console.warn('Webhook notification error:', err.message));
    }

    return NextResponse.json({
      success: true,
      report: bugReport,
      message: 'Bug report received successfully. Thank you for helping improve the platform!',
    });
  } catch (error: any) {
    console.error('Error submitting bug report:', error);
    return NextResponse.json(
      { error: 'Failed to submit bug report: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required to view bug reports' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'all';

    const data = await db.getBugReports(status);

    return NextResponse.json({
      success: true,
      reports: data.reports,
      openCount: data.openCount,
    });
  } catch (error: any) {
    console.error('Error fetching bug reports:', error);
    return NextResponse.json(
      { error: 'Failed to load bug reports: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}
