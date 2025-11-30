import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData } from '@/lib/googleSheets';
import { Branch } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSheetData('Branches!A2:E');
    if (data && data.length > 0) {
      const branches: Branch[] = data.map((row: string[]) => ({
        id: row[0],
        name: row[1],
        location: row[2],
        contactPhone: row[3],
        contactEmail: row[4]
      }));
      return NextResponse.json(branches);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.location) {
      return NextResponse.json({ error: 'Name and Location are required' }, { status: 400 });
    }

    const id = `BRANCH-${Date.now()}`;
    const newBranch = [
      id,
      body.name,
      body.location,
      body.contactPhone || '',
      body.contactEmail || ''
    ];

    const success = await appendSheetData('Branches!A:E', [newBranch]);

    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save to sheet' }, { status: 500 });
    }
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  } catch (error) {
    console.error('Error creating branch:', error);
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Branches!A2:E');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    const sheetRowIndex = rowIndex + 2;
    const range = `Branches!A${sheetRowIndex}:E${sheetRowIndex}`;
    const emptyRow = Array(5).fill('');
    
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: 'Failed to delete branch' }, { status: 500 });
  }
}
