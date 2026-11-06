import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAdminAuthorized } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Bug ID is required' }, { status: 400 });
    }

    const body = await req.json();
    const { status, adminNotes } = body;

    const validStatuses = ['open', 'in_progress', 'resolved'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = await db.updateBugReport(id, {
      status,
      adminNotes,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Bug report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report: updated,
    });
  } catch (error: any) {
    console.error('Error updating bug report:', error);
    return NextResponse.json(
      { error: 'Failed to update bug report: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAuth = await isAdminAuthorized();
    if (!isAuth) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Bug ID is required' }, { status: 400 });
    }

    const success = await db.deleteBugReport(id);

    if (!success) {
      return NextResponse.json({ error: 'Bug report not found or already deleted' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Bug report deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting bug report:', error);
    return NextResponse.json(
      { error: 'Failed to delete bug report: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}

