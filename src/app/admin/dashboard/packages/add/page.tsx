'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AddPackagePage() {
  const router = useRouter();
  const { addPackage } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationDays: '',
    benefits: ['']
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData({ ...formData, benefits: newBenefits });
  };

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index);
    setFormData({ ...formData, benefits: newBenefits });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await addPackage({
        ...formData,
        price: Number(formData.price),
        durationDays: Number(formData.durationDays),
        benefits: formData.benefits.filter(b => b.trim() !== '')
      });

      if (success) {
        router.push('/admin/dashboard/packages');
      } else {
        alert('Failed to add package');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard/packages" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Add New Package</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Package Name</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Premium Plan"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
              <input 
                type="number" 
                name="price"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Duration (Days)</label>
              <input 
                type="number" 
                name="durationDays"
                required
                value={formData.durationDays}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Benefits</label>
            <div className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    placeholder="e.g. Free Personal Training"
                    className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  />
                  <button 
                    type="button" 
                    onClick={() => removeBenefit(index)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                onClick={addBenefit}
                className="text-primary text-sm font-medium flex items-center hover:text-orange-400"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Benefit
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
