import { NextResponse } from 'next/server';
import { getSheetData, mapMembers } from '@/lib/googleSheets';
import { Member } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // Note: In Next.js 15 App Router, params is a Promise.
  // However, this is a route handler, so we access params from the second argument.
  // But wait, for dynamic routes like [id], we need to extract it.
  // Actually, for search params (query string), we use request.url.
  // For path params, we use the second argument.
  
  // Let's use query param ?id=... for simplicity in searching the sheet, 
  // or we can fetch all and filter (not efficient but okay for small gyms).
  // Or we can use the [id] route if we want /api/members/123.
  
  // Let's stick to a generic search endpoint or just fetch all and filter here for MVP.
  // Since we don't have a database index, fetching all is the only way with Sheets unless we use a specific lookup function.
  
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
  }

  try {
    // Range: Members!A2:R
    const data = await getSheetData('Members!A2:R');
    
    if (data && data.length > 0) {
      const members = mapMembers(data);
      const member = members.find(m => m.id.toLowerCase() === id.toLowerCase());
      
      if (member) {
        return NextResponse.json(member);
      }
    }

    // Fallback Mock Data for testing
    if (id === 'GYM-001') {
      const mockMember: Member = {
        id: 'GYM-001',
        fullName: 'Albin User',
        email: 'albin@example.com',
        mobileNumber: '9876543210',
        dateOfBirth: '1995-05-15',
        branchName: 'Valad',
        registrationDate: '2024-01-01',
        currentPlan: 'Yearly Plan',
        planStartDate: '2024-01-01',
        planExpiryDate: '2025-01-01',
        remainingDays: 30,
        annualFeePaid: true,
        feeValidityDate: '2025-01-01',
        qrCodeUrl: '',
        profilePhotoUrl: ''
      };
      return NextResponse.json(mockMember);
    }
    
    if (id === 'GYM-002') { // Expired example
       const mockMember: Member = {
        id: 'GYM-002',
        fullName: 'Expired User',
        email: 'expired@example.com',
        mobileNumber: '9876543210',
        dateOfBirth: '1990-01-01',
        branchName: 'Vellamunda',
        registrationDate: '2023-01-01',
        currentPlan: 'Monthly Plan',
        planStartDate: '2023-01-01',
        planExpiryDate: '2023-02-01',
        remainingDays: 0,
        annualFeePaid: false,
        feeValidityDate: '2024-01-01',
        qrCodeUrl: '',
        profilePhotoUrl: ''
      };
      return NextResponse.json(mockMember);
    }

    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching member:', error);
    return NextResponse.json({ error: 'Failed to fetch member' }, { status: 500 });
  }
}
