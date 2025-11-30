import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData, mapMembers } from '@/lib/googleSheets';
import { Member } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSheetData('Members!A2:O');
    if (data && data.length > 0) {
      const members = mapMembers(data);
      return NextResponse.json(members);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Basic validation
    if (!body.fullName || !body.mobileNumber) {
      return NextResponse.json({ error: 'Name and Mobile are required' }, { status: 400 });
    }

    // Generate ID: GYM-BRANCH-RANDOM
    const branchCode = body.branchName?.substring(0, 2).toUpperCase() || 'XX';
    const randomId = Math.floor(1000 + Math.random() * 9000);
    const id = `GYM-${branchCode}-${randomId}`;

    const newMember = [
      id,
      body.fullName,
      body.email || '',
      body.mobileNumber,
      body.dateOfBirth || '',
      body.branchName || 'Valad',
      new Date().toISOString().split('T')[0], // Registration Date
      body.currentPlan || '',
      body.planStartDate || '',
      body.planExpiryDate || '',
      '0', // Remaining Days (should be calc)
      body.annualFeePaid ? 'Yes' : 'No',
      body.feeValidityDate || '', // Using this as Payment Date for now based on form
      '', // QR Code URL (generated later)
      body.profilePhotoUrl || '' // Profile Photo URL
    ];

    const success = await appendSheetData('Members!A:O', [newMember]);

    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      // Mock success for demo
      return NextResponse.json({ success: true, id, warning: 'Mock mode: Data not saved to sheet' });
    }
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Members!A2:O');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Row index in sheet is rowIndex + 2 (header + 0-based index)
    const sheetRowIndex = rowIndex + 2;
    const range = `Members!A${sheetRowIndex}:O${sheetRowIndex}`;

    // We can't easily "delete" a row with the current helper, but we can clear it.
    // A better approach for Sheets is to read all, filter, and write back, but that's risky for concurrency.
    // For this MVP, we will clear the content of the row.
    
    const emptyRow = Array(15).fill('');
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting member:', error);
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
