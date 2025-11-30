'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddBranchPage() {
  const router = useRouter();
  const { addBranch } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await addBranch(formData);

      if (success) {
        router.push('/admin/dashboard/branches');
      } else {
        alert('Failed to add branch');
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
        <Link href="/admin/dashboard/branches" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Add New Branch</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Branch Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Valad"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
            <input 
              type="text" 
              name="location"
              required
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Valad Town, Wayanad"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
            <input 
              type="tel" 
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
            <input 
              type="email" 
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              placeholder="branch@oasisfitness.com"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Branch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
