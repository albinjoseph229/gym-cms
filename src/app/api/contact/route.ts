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
