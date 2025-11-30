import { NextResponse } from 'next/server';
import { getSheetData, appendSheetData, mapGallery } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSheetData('Gallery!A2:D');
    if (data && data.length > 0) {
      const images = mapGallery(data);
      return NextResponse.json(images);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    const id = `img-${Date.now()}`;
    const newImage = [
      id,
      body.category || 'Other',
      body.imageUrl,
      body.caption || ''
    ];

    const success = await appendSheetData('Gallery!A:D', [newImage]);
    
    if (success) {
      return NextResponse.json({ success: true, id });
    } else {
      return NextResponse.json({ success: true, id, warning: 'Mock mode: Data not saved' });
    }
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  } catch (error) {
    console.error('Error adding image:', error);
    return NextResponse.json({ error: 'Failed to add image' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    const data = await getSheetData('Gallery!A2:D');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const sheetRowIndex = rowIndex + 2;
    const range = `Gallery!A${sheetRowIndex}:D${sheetRowIndex}`;
    const emptyRow = Array(4).fill('');
    
    const { updateSheetData } = await import('@/lib/googleSheets');
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
  }
}
