'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Member } from '@/types';

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const { members, updateMember, packages, branches, loading: contextLoading } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Member | null>(null);

  useEffect(() => {
    if (members.length > 0 && params.id) {
      const member = members.find(m => m.id === params.id);
      if (member) {
        setFormData(member);
      } else {
        // Handle not found or fetch individual if needed (but context should have it)
        // For now, redirect if not found after loading
        if (!contextLoading) {
           // router.push('/admin/dashboard/members');
        }
      }
    }
  }, [members, params.id, contextLoading, router]);

  const calculateExpiry = (startDate: string, days: number) => {
    if (!startDate || !days) return '';
    const date = new Date(startDate);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      if (!prev) return null;
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };

      // Recalculate expiry if plan or start date changes
      if (name === 'currentPlan') {
        const selectedPackage = packages.find(p => p.name === value);
        if (selectedPackage) {
          newData.planExpiryDate = calculateExpiry(newData.planStartDate, selectedPackage.durationDays);
          newData.planFee = selectedPackage.price;
        }
      } else if (name === 'planStartDate') {
        const selectedPackage = packages.find(p => p.name === newData.currentPlan);
        if (selectedPackage) {
          newData.planExpiryDate = calculateExpiry(value, selectedPackage.durationDays);
        }
      } else if (name === 'feeValidityDate') {
        // Auto-set annual fee expiry to 1 year from payment date
        if (value) {
          const date = new Date(value);
          date.setFullYear(date.getFullYear() + 1);
          newData.annualFeeExpiryDate = date.toISOString().split('T')[0];
        }
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setLoading(true);

    try {
      const success = await updateMember(formData);

      if (success) {
        router.push('/admin/dashboard/members');
      } else {
        alert('Failed to update member');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (contextLoading || !formData) {
    return <div className="text-white">Loading member details...</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard/members" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Edit Member</h1>
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Start Date</label>
              <input 
                type="date" 
                name="planStartDate"
                value={formData.planStartDate}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Expiry Date</label>
              <input 
                type="date" 
                name="planExpiryDate"
                value={formData.planExpiryDate}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Fees & Status</h3>
            
            <div className="flex items-center mb-4">
              <input 
                type="checkbox" 
                name="planFeePaid"
                id="planFeePaid"
                checked={formData.planFeePaid || false}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-600 focus:ring-primary bg-gray-900"
              />
              <label htmlFor="planFeePaid" className="ml-3 text-white">Plan Fee Paid?</label>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Fee Amount</label>
              <input 
                type="number" 
                name="planFee"
                value={formData.planFee || 0}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>

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
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Annual Fee Expiry Date</label>
                  <input 
                    type="date" 
                    name="annualFeeExpiryDate" 
                    value={formData.annualFeeExpiryDate || ''}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Valid until (defaults to 1 year).</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Annual Fee Amount</label>
                  <input 
                    type="number" 
                    name="annualFeeAmount" 
                    value={formData.annualFeeAmount || 0}
                    onChange={handleChange}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                  />
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
              {loading ? 'Saving...' : 'Update Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
