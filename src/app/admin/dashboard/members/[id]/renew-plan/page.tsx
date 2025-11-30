'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Member } from '@/types';

export default function RenewPlanPage() {
  const router = useRouter();
  const params = useParams();
  const { members, updateMember, packages, loading: contextLoading } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Member | null>(null);

  useEffect(() => {
    if (members.length > 0 && params.id) {
      const member = members.find(m => m.id === params.id);
      if (member) {
        // Initialize with current member data but set start date to today for renewal
        const today = new Date().toISOString().split('T')[0];
        setFormData({
          ...member,
          planStartDate: today,
          planFeePaid: false, // Reset fee status for new plan
        });
      }
    }
  }, [members, params.id]);

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
        alert('Failed to renew plan');
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
        <h1 className="text-3xl font-bold">Renew Plan</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <div className="mb-6 pb-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-2">{formData.fullName}</h2>
          <p className="text-gray-400">ID: {formData.id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Select New Plan</label>
            <select 
              name="currentPlan"
              value={formData.currentPlan}
              onChange={handleChange}
              required
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            >
              <option value="">Select Plan</option>
              {packages.map(pkg => (
                <option key={pkg.id} value={pkg.name}>{pkg.name} ({pkg.durationDays} days)</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Plan Start Date</label>
              <input 
                type="date" 
                name="planStartDate"
                value={formData.planStartDate}
                onChange={handleChange}
                required
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
                required
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold mb-4">Payment Details</h3>
            
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
                name="planFeePaid"
                id="planFeePaid"
                checked={formData.planFeePaid || false}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-600 focus:ring-primary bg-gray-900"
              />
              <label htmlFor="planFeePaid" className="ml-3 text-white">Plan Fee Paid?</label>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Renew Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
