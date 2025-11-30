import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData, mapPackages } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSheetData('Plans!A2:E');
    if (data && data.length > 0) {
      const packages = mapPackages(data);
      return NextResponse.json(packages);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and Price are required' }, { status: 400 });
    }

    const id = `pkg-${Date.now()}`;
    const newPackage = [
      id,
      body.name,
      body.price.toString(),
      body.durationDays.toString(),
      Array.isArray(body.benefits) ? body.benefits.join(', ') : (body.benefits || '')
    ];

    const success = await appendSheetData('Plans!A:E', [newPackage]);
    
    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save to sheet' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding package:', error);
    return NextResponse.json({ error: 'Failed to add package' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.name || !body.price) {
      return NextResponse.json({ error: 'ID, Name and Price are required' }, { status: 400 });
    }

    const data = await getSheetData('Plans!A2:E');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === body.id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const updatedPackage = [
      body.id,
      body.name,
      body.price.toString(),
      body.durationDays.toString(),
      Array.isArray(body.benefits) ? body.benefits.join(', ') : (body.benefits || '')
    ];

    const sheetRowIndex = rowIndex + 2;
    const range = `Plans!A${sheetRowIndex}:E${sheetRowIndex}`;
    
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [updatedPackage]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Package ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Plans!A2:E');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const sheetRowIndex = rowIndex + 2;
    const range = `Plans!A${sheetRowIndex}:E${sheetRowIndex}`;
    const emptyRow = Array(5).fill('');
    
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 });
  }
}
