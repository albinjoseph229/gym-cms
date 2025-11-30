'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';

export default function AddMemberPage() {
  const router = useRouter();
  const { addMember, packages, branches } = useAdmin();
  const { addToast } = useToast();
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
    planFeePaid: false,
    planFee: 0,
    feeValidityDate: '',
    annualFeeExpiryDate: '',
    annualFeeAmount: 0,
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
        planExpiryDate: calculateExpiry(prev.planStartDate, firstPackage.durationDays),
        planFee: firstPackage.price
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
        const selectedPackage = packages.find((p: any) => p.name === value);
        if (selectedPackage) {
          newData.planExpiryDate = calculateExpiry(newData.planStartDate, selectedPackage.durationDays);
          newData.planFee = selectedPackage.price;
        }
      } else if (name === 'planStartDate') {
        const selectedPackage = packages.find((p: any) => p.name === newData.currentPlan);
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
    setLoading(true);

    try {
      const success = await addMember({
        ...formData,
        remainingDays: 0, // Will be calculated by backend or context if needed
        registrationDate: new Date().toISOString().split('T')[0],
        qrCodeUrl: '',
      });

      if (success) {
        addToast('Member added successfully', 'success');
        router.push('/admin/dashboard/members');
      } else {
        addToast('Failed to add member', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast('An error occurred', 'error');
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

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Details Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  {branches.map((branch: any) => (
                    <option key={branch.id} value={branch.name}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-2">Profile Photo URL</label>
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
          </div>

          {/* Plan Details Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Plan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Plan</label>
                <select 
                  name="currentPlan"
                  value={formData.currentPlan}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                >
                  <option value="">Select Plan</option>
                  {packages.map((pkg: any) => (
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
          </div>

          {/* Fees & Status Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Fees & Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Plan Fee */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                <h4 className="text-lg font-medium text-white mb-4">Plan Fee</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                    <input 
                      type="number" 
                      name="planFee"
                      value={formData.planFee}
                      onChange={handleChange}
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      name="planFeePaid"
                      id="planFeePaid"
                      checked={formData.planFeePaid}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary rounded border-gray-600 focus:ring-primary bg-gray-900"
                    />
                    <label htmlFor="planFeePaid" className="ml-3 text-white">Mark as Paid</label>
                  </div>
                </div>
              </div>

              {/* Annual Fee */}
              <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
                <h4 className="text-lg font-medium text-white mb-4">Annual Membership Fee</h4>
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      name="annualFeePaid"
                      id="annualFeePaid"
                      checked={formData.annualFeePaid}
                      onChange={handleChange}
                      className="w-5 h-5 text-primary rounded border-gray-600 focus:ring-primary bg-gray-900"
                    />
                    <label htmlFor="annualFeePaid" className="ml-3 text-white">Annual Fee Paid?</label>
                  </div>

                  {formData.annualFeePaid && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                          <input 
                            type="number" 
                            name="annualFeeAmount" 
                            value={formData.annualFeeAmount}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Payment Date</label>
                          <input 
                            type="date" 
                            name="feeValidityDate" 
                            value={formData.feeValidityDate}
                            onChange={handleChange}
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                        <input 
                          type="date" 
                          name="annualFeeExpiryDate" 
                          value={formData.annualFeeExpiryDate}
                          onChange={handleChange}
                          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

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
