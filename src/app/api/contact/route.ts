import { NextResponse } from 'next/server';
import { appendSheetData } from '@/lib/googleSheets';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, branch, message } = body;

    // Validate
    if (!name || !email || !phone || !branch) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const date = new Date().toISOString();
    const row = [
      Math.random().toString(36).substring(7), // ID
      name,
      email,
      phone,
      branch,
      message || '',
      date
    ];

    // Append to Contacts sheet
    const success = await appendSheetData('Contacts!A:G', [row]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      // If sheet append fails (e.g. no creds), we still return success for the demo
      // but log the error on server.
      console.warn('Failed to append to sheet (likely no credentials), returning success for demo.');
      return NextResponse.json({ success: true, warning: 'Data not saved to sheet' });
    }

  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { getSheetData, mapContacts } = await import('@/lib/googleSheets');
    const rows = await getSheetData('Contacts!A2:G');
    const contacts = mapContacts(rows);
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Contact ID is required' }, { status: 400 });
    }

    const { getSheetData, updateSheetData } = await import('@/lib/googleSheets');
    const data = await getSheetData('Contacts!A2:G');
    if (!data) return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });

    const rowIndex = data.findIndex((row: string[]) => row[0] === id);
    
    if (rowIndex === -1) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    const sheetRowIndex = rowIndex + 2;
    const range = `Contacts!A${sheetRowIndex}:G${sheetRowIndex}`;
    const emptyRow = Array(7).fill('');
    
    const success = await updateSheetData(range, [emptyRow]);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 });
  }
}
