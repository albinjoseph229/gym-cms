import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData, mapTrainers } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSheetData('Trainers!A2:I');
    if (data && data.length > 0) {
      const trainers = mapTrainers(data);
      return NextResponse.json(trainers);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json({ error: 'Failed to fetch trainers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.specialization) {
      return NextResponse.json({ error: 'Name and Specialization are required' }, { status: 400 });
    }

    const id = `trainer-${Date.now()}`;
    const newTrainer = [
      id,
      body.name,
      body.specialization,
      body.experience || '',
      body.photoUrl || '',
      body.branch || 'Valad',
      body.description || '',
      body.instagramProfile || '',
      body.contactNumber || ''
    ];

    const success = await appendSheetData('Trainers!A:I', [newTrainer]);
    
    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save to sheet' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding trainer:', error);
    return NextResponse.json({ error: 'Failed to add trainer' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Trainer ID is required' }, { status: 400 });
    }

    // In a real DB we would update by ID. With Sheets, we need to find the row.
    // For this MVP, we will fetch all, find index, and update that row.
    // This is inefficient but works for small datasets.
    
    const data = await getSheetData('Trainers!A2:I');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === body.id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    // Row index in sheet is rowIndex + 2 (header + 0-based index)
    const sheetRowIndex = rowIndex + 2;
    const range = `Trainers!A${sheetRowIndex}:I${sheetRowIndex}`;

    const updatedRow = [
      body.id,
      body.name,
      body.specialization,
      body.experience || '',
      body.photoUrl || '',
      body.branch || '',
      body.description || '',
      body.instagramProfile || '',
      body.contactNumber || ''
    ];

    const { updateSheetData } = await import('@/lib/googleSheets'); // Dynamic import to avoid circular dep if any, or just import at top
    const success = await updateSheetData(range, [updatedRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
  } catch (error) {
    console.error('Error updating trainer:', error);
    return NextResponse.json({ error: 'Failed to update trainer' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Trainer ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Trainers!A2:I');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
    }

    const sheetRowIndex = rowIndex + 2;
    const range = `Trainers!A${sheetRowIndex}:I${sheetRowIndex}`;
    const emptyRow = Array(9).fill('');
    
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete trainer' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting trainer:', error);
    return NextResponse.json({ error: 'Failed to delete trainer' }, { status: 500 });
  }
}
