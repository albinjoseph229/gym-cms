import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData, updateSheetData, mapMembers } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Range: Members!A2:R (18 columns)
    const data = await getSheetData('Members!A2:R');
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
    
    // Generate ID: GYM-BRANCH-RANDOM
    const branchCode = body.branchName ? body.branchName.substring(0, 2).toUpperCase() : 'XX';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `GYM-${branchCode}-${randomNum}`;

    // Calculate remaining days
    let remainingDays = 0;
    if (body.planExpiryDate) {
      const expiry = new Date(body.planExpiryDate);
      const today = new Date();
      // Reset time part
      expiry.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    }

    // New Structure:
    // 0: ID, 1: Full Name, 2: Mobile, 3: Email, 4: DOB, 5: Branch, 6: Reg Date
    // 7: Plan, 8: Start Date, 9: End Date, 10: Plan Fee Paid, 11: Plan Fee Amount
    // 12: Annual Fee Paid, 13: Payment Date, 14: Expiry Date, 15: Amount
    // 16: QR URL, 17: Photo URL

    const newMember = [
      newId,
      body.fullName,
      body.mobileNumber,
      body.email,
      body.dateOfBirth,
      body.branchName,
      new Date().toISOString().split('T')[0], // Registration Date
      body.currentPlan,
      body.planStartDate,
      body.planExpiryDate,
      body.planFeePaid ? 'Yes' : 'No', // Plan Fee Paid
      body.planFee ? body.planFee.toString() : '0', // Plan Fee Amount
      body.annualFeePaid ? 'Yes' : 'No',
      body.feeValidityDate, // Annual Fee Payment Date
      body.annualFeeExpiryDate || '',
      body.annualFeeAmount ? body.annualFeeAmount.toString() : '0',
      '', // QR Code URL
      body.profilePhotoUrl || ''
    ];

    const success = await appendSheetData('Members!A:R', [newMember]);

    if (success) {
      return NextResponse.json({ success: true, id: newId });
    } else {
      return NextResponse.json({ error: 'Failed to add member to sheet' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding member:', error);
    return NextResponse.json({ error: 'Failed to add member' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Members!A2:R');
    const rowIndex = data.findIndex(row => row[0] === id);

    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Row index in sheet is rowIndex + 2 (header is row 1, data starts row 2)
    const sheetRowIndex = rowIndex + 2;
    
    // Calculate remaining days (not stored but good to verify logic if needed)
    // We don't store remaining days anymore.

    const updatedRow = [
      id,
      body.fullName,
      body.mobileNumber,
      body.email,
      body.dateOfBirth,
      body.branchName,
      body.registrationDate,
      body.currentPlan,
      body.planStartDate,
      body.planExpiryDate,
      body.planFeePaid ? 'Yes' : 'No',
      body.planFee ? body.planFee.toString() : '0',
      body.annualFeePaid ? 'Yes' : 'No',
      body.feeValidityDate,
      body.annualFeeExpiryDate || '',
      body.annualFeeAmount ? body.annualFeeAmount.toString() : '0',
      body.qrCodeUrl || '',
      body.profilePhotoUrl || ''
    ];

    const range = `Members!A${sheetRowIndex}:R${sheetRowIndex}`;
    const success = await updateSheetData(range, [updatedRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update member in sheet' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Members!A2:R');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Row index in sheet is rowIndex + 2 (header + 0-based index)
    const sheetRowIndex = rowIndex + 2;
    const range = `Members!A${sheetRowIndex}:R${sheetRowIndex}`;

    // Clear the row
    const emptyRow = Array(18).fill('');
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
