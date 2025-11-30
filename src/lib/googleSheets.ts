import { google } from 'googleapis';
import { Member, Trainer, Package, GalleryItem, Branch, ContactSubmission } from '@/types';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Environment variables should be set in .env.local
// GOOGLE_SERVICE_ACCOUNT_EMAIL
// GOOGLE_PRIVATE_KEY
// GOOGLE_SHEET_ID

const getAuth = () => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!email || !privateKey) {
    console.warn('Google Sheets credentials missing. Email length:', email?.length, 'Key length:', privateKey?.length);
    return null;
  }

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    console.error('GOOGLE_PRIVATE_KEY does not contain "BEGIN PRIVATE KEY". Please check your .env.local file.');
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: email,
        private_key: privateKey,
      },
      scopes: SCOPES,
    });
    return auth;
  } catch (error) {
    console.error('Error creating GoogleAuth client:', error);
    return null;
  }
};

const getSheetsClient = async () => {
  const auth = getAuth();
  if (!auth) return null;
  try {
    const client = await auth.getClient();
    return google.sheets({ version: 'v4', auth: client as any });
  } catch (error) {
    console.error('Error getting sheets client:', error);
    return null;
  }
};

// Simple in-memory cache
const cache = new Map<string, { data: string[][], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getSheetData = async (range: string) => {
  const now = Date.now();
  const cached = cache.get(range);

  if (cached && (now - cached.timestamp < CACHE_DURATION)) {
    return cached.data;
  }

  const sheets = await getSheetsClient();
  if (!sheets) return [];

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const data = response.data.values || [];
    cache.set(range, { data, timestamp: now });
    return data;
  } catch (error: any) {
    if (error.code === 403 && error.message.includes('unregistered callers')) {
        console.error('GOOGLE SHEETS API ERROR: The Google Sheets API is not enabled for your project.');
        console.error('Please go to the Google Cloud Console > APIs & Services > Library and enable "Google Sheets API".');
    } else {
        console.error('Error fetching sheet data:', error);
    }
    return [];
  }
};

export const appendSheetData = async (range: string, values: string[][]) => {
  const sheets = await getSheetsClient();
  if (!sheets) return false;

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    
    // Invalidate cache for this range (or all related ranges)
    // For simplicity, we clear the specific range key if it matches, 
    // but since append usually affects the whole sheet range (e.g. 'Members!A:O'), 
    // we might want to clear any key starting with the sheet name.
    const sheetName = range.split('!')[0];
    for (const key of cache.keys()) {
      if (key.startsWith(sheetName)) {
        cache.delete(key);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error appending sheet data:', error);
    return false;
  }
};

export const updateSheetData = async (range: string, values: string[][]) => {
    const sheets = await getSheetsClient();
    if (!sheets) return false;
  
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      // Invalidate cache
      const sheetName = range.split('!')[0];
      for (const key of cache.keys()) {
        if (key.startsWith(sheetName)) {
          cache.delete(key);
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating sheet data:', error);
      return false;
    }
  };

// Helper to map array data to objects (assuming first row is header, but we'll hardcode indices for reliability or use a mapper)
// For simplicity in this MVP, we will assume fixed column order as per requirements.

export const mapMembers = (rows: string[][]): Member[] => {
  // New Structure:
  // 0: ID, 1: Full Name, 2: Mobile, 3: Email, 4: DOB, 5: Branch, 6: Reg Date
  // 7: Plan, 8: Start Date, 9: End Date, 10: Plan Fee Paid, 11: Plan Fee Amount
  // 12: Annual Fee Paid, 13: Payment Date, 14: Expiry Date, 15: Amount
  // 16: QR URL, 17: Photo URL

  return rows.map((row) => {
    const planExpiryDate = row[9] || '';
    let remainingDays = 0;
    
    if (planExpiryDate) {
      const expiry = new Date(planExpiryDate);
      const today = new Date();
      // Reset time part for accurate day calculation
      expiry.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      const diffTime = expiry.getTime() - today.getTime();
      remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      id: row[0] || '',
      fullName: row[1] || '',
      mobileNumber: row[2] || '',
      email: row[3] || '',
      dateOfBirth: row[4] || '',
      branchName: row[5] || '',
      registrationDate: row[6] || '',
      currentPlan: row[7] || '',
      planStartDate: row[8] || '',
      planExpiryDate: planExpiryDate,
      remainingDays: remainingDays, // Calculated in code
      planFeePaid: row[10] === 'Yes',
      planFee: parseFloat(row[11] || '0'),
      annualFeePaid: row[12] === 'Yes',
      feeValidityDate: row[13] || '', // Annual Fee Payment Date
      annualFeeExpiryDate: row[14] || '',
      annualFeeAmount: parseFloat(row[15] || '0'),
      qrCodeUrl: row[16] || '',
      profilePhotoUrl: row[17] || '',
    };
  });
};

export const mapTrainers = (rows: string[][]): Trainer[] => {
    return rows.map((row, index) => ({
        id: row[0] || `trainer-${index}`,
        name: row[1] || '',
        specialization: row[2] || '',
        experience: row[3] || '',
        photoUrl: row[4] || '',
        branch: row[5] || '',
        description: row[6] || '',
        instagramProfile: row[7] || '',
        contactNumber: row[8] || '',
    }));
};

export const mapPackages = (rows: string[][]): Package[] => {
    return rows.map((row, index) => ({
        id: row[0] || `pkg-${index}`,
        name: row[1] || '',
        price: parseFloat(row[2] || '0'),
        durationDays: parseInt(row[3] || '0'),
        benefits: row[4] ? row[4].split(',').map(b => b.trim()) : [],
    }));
};

export const mapGallery = (rows: string[][]): GalleryItem[] => {
    return rows.map((row, index) => ({
        id: row[0] || `img-${index}`,
        category: (row[1] as GalleryItem['category']) || 'Other',
        imageUrl: row[2] || '',
        caption: row[3] || '',
    }));
};

export const mapContacts = (rows: string[][]): ContactSubmission[] => {
  return rows.map((row, index) => ({
    id: row[0] || `contact-${index}`,
    name: row[1] || '',
    email: row[2] || '',
    phone: row[3] || '',
    branch: row[4] || '',
    message: row[5] || '',
    date: row[6] || '',
  }));
};
