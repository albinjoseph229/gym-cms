'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Member } from '@/types';

export default function RenewMembershipPage() {
  const router = useRouter();
  const params = useParams();
  const { members, updateMember, loading: contextLoading } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Member | null>(null);

  useEffect(() => {
    if (members.length > 0 && params.id) {
      const member = members.find(m => m.id === params.id);
      if (member) {
        // Initialize with current member data
        const today = new Date().toISOString().split('T')[0];
        
        // Calculate default expiry (1 year from today)
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 1);
        const expiryStr = expiry.toISOString().split('T')[0];

        setFormData({
          ...member,
          annualFeePaid: false, // Reset for new payment
          feeValidityDate: today, // Default payment date to today
          annualFeeExpiryDate: expiryStr,
          annualFeeAmount: 0 // Reset amount or keep previous? Better reset or maybe keep standard fee if we had one. Let's reset to 0 to force entry or maybe 0 is fine.
        });
      }
    }
  }, [members, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      if (!prev) return null;
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      };

      if (name === 'feeValidityDate') {
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
        alert('Failed to renew membership');
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
        <h1 className="text-3xl font-bold">Renew Membership</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-2">{formData.fullName}</h2>
          <p className="text-gray-400">ID: {formData.id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Payment Date</label>
              <input 
                type="date" 
                name="feeValidityDate" 
                value={formData.feeValidityDate}
                onChange={handleChange}
                required
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
                required
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-gray-500 mt-1">Valid until (defaults to 1 year).</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Payment Details</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">Annual Fee Amount</label>
              <input 
                type="number" 
                name="annualFeeAmount" 
                value={formData.annualFeeAmount || 0}
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
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Renew Membership'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
