'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddMemberPage() {
  const router = useRouter();
  const { addMember, packages, branches } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    branchName: '',
    currentPlan: '',
    planStartDate: new Date().toISOString().split('T')[0],
    planExpiryDate: '',
    annualFeePaid: false,
    feeValidityDate: '',
    profilePhotoUrl: '',
  });

  // Set default branch and plan when data loads
  useEffect(() => {
    if (branches.length > 0 && !formData.branchName) {
      setFormData(prev => ({ ...prev, branchName: branches[0].name }));
    }
    if (packages.length > 0 && !formData.currentPlan) {
      const firstPackage = packages[0];
      setFormData(prev => ({ 
        ...prev, 
        currentPlan: firstPackage.name,
        planExpiryDate: calculateExpiry(prev.planStartDate, firstPackage.durationDays)
      }));
    }
  }, [branches, packages]);

  const calculateExpiry = (startDate: string, days: number) => {
    if (!startDate || !days) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };

      // Recalculate expiry if plan or start date changes
      if (name === 'currentPlan') {
        const selectedPackage = packages.find(p => p.name === value);
        if (selectedPackage) {
          newData.planExpiryDate = calculateExpiry(newData.planStartDate, selectedPackage.durationDays);
        }
      } else if (name === 'planStartDate') {
        const selectedPackage = packages.find(p => p.name === newData.currentPlan);
        if (selectedPackage) {
          newData.planExpiryDate = calculateExpiry(value, selectedPackage.durationDays);
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await addMember({
        ...formData,
        remainingDays: 0, // Will be calculated by backend or context if needed
        registrationDate: new Date().toISOString().split('T')[0],
        qrCodeUrl: '',
      });

      if (success) {
        router.push('/admin/dashboard/members');
      } else {
        alert('Failed to add member');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard/members" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Add New Member</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input 
                type="text" 
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mobile Number</label>
              <input 
                type="tel" 
                name="mobileNumber"
                required
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Date of Birth</label>
              <input 
                type="date" 
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
              <select 
                name="branchName"
                value={formData.branchName}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select Branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.name}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan</label>
              <select 
                name="currentPlan"
                value={formData.currentPlan}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              >
                <option value="">Select Plan</option>
                {packages.map(pkg => (
                  <option key={pkg.id} value={pkg.name}>{pkg.name} ({pkg.durationDays} days)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Fees & Validity</h3>
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                name="annualFeePaid"
                id="annualFeePaid"
                checked={formData.annualFeePaid}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-600 focus:ring-primary bg-gray-900"
              />
              <label htmlFor="annualFeePaid" className="ml-3 text-white">Annual Membership Fee Paid?</label>
            </div>

            {formData.annualFeePaid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Payment Date</label>
                  <input 
                    type="date" 
                    name="feeValidityDate" 
                    value={formData.feeValidityDate}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Date when the fee was paid.</p>
                </div>
              </div>
            )}
            
            <div>
               <label className="block text-sm font-medium text-gray-400 mb-2">Profile Photo URL (Optional)</label>
               <input 
                 type="url" 
                 name="profilePhotoUrl"
                 value={formData.profilePhotoUrl}
                 onChange={handleChange}
                 placeholder="https://example.com/photo.jpg"
                 className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
               />
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
