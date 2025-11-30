export interface Member {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  branchName: string;
  registrationDate: string;
  currentPlan: string;
  planStartDate: string;
  planExpiryDate: string;
  remainingDays: number;
  annualFeePaid: boolean;
  feeValidityDate: string;
  qrCodeUrl?: string;
  profilePhotoUrl?: string;
}

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  photoUrl: string;
  branch: string;
  description?: string;
  instagramProfile?: string;
  contactNumber?: string;
}

export interface Package {
  id: string;
  name: string; // e.g., Monthly, Quarterly
  price: number;
  durationDays: number;
  benefits: string[]; // Comma separated or JSON string in sheet
}

export interface GalleryItem {
  id: string;
  category: 'Equipment' | 'Group Classes' | 'Transformation' | 'Other';
  imageUrl: string;
  caption?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  message: string;
  date: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string; // Embed URL or address
  contactPhone: string;
  contactEmail: string;
}
