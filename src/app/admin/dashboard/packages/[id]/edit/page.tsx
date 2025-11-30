'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { ChevronLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const { packages, updatePackage } = useAdmin();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    durationDays: 30,
    benefits: [] as string[],
  });

  const [newBenefit, setNewBenefit] = useState('');

  useEffect(() => {
    if (packages.length > 0 && params.id) {
      const pkg = packages.find(p => p.id === params.id);
      if (pkg) {
        setFormData({
          name: pkg.name,
          price: pkg.price,
          durationDays: pkg.durationDays,
          benefits: pkg.benefits || [],
        });
      } else {
        addToast('Package not found', 'error');
        router.push('/admin/dashboard/packages');
      }
    }
  }, [packages, params.id, router, addToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'durationDays' ? Number(value) : value
    }));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await updatePackage({
        id: params.id as string,
        ...formData
      });

      if (success) {
        addToast('Package updated successfully', 'success');
        router.push('/admin/dashboard/packages');
      } else {
        addToast('Failed to update package', 'error');
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
        <Link href="/admin/dashboard/packages" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Edit Package</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 md:p-8 max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Package Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Package Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price (₹)</label>
                <input 
                  type="number" 
                  name="price"
                  required
                  min="0"
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
                  min="1"
                  value={formData.durationDays}
                  onChange={handleChange}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">Benefits</h3>
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit..."
                className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <button 
                type="button"
                onClick={addBenefit}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <ul className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-300">{benefit}</span>
                  <button 
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full md:w-auto bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
