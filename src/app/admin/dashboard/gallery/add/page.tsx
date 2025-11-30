'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddGalleryPage() {
  const router = useRouter();
  const { addGalleryItem } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: '',
    caption: '',
    category: 'Equipment'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await addGalleryItem({
        ...formData,
        category: formData.category as "Equipment" | "Group Classes" | "Transformation" | "Other"
      });

      if (success) {
        router.push('/admin/dashboard/gallery');
      } else {
        alert('Failed to add image');
      }
    } catch (error) {
      console.error(error);
      alert('Error adding image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard/gallery" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Add New Image</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Image URL</label>
            <input 
              type="url" 
              name="imageUrl"
              required
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Caption</label>
            <input 
              type="text" 
              name="caption"
              required
              value={formData.caption}
              onChange={handleChange}
              placeholder="e.g. New Treadmills"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            >
              <option value="Equipment">Equipment</option>
              <option value="Group Classes">Group Classes</option>
              <option value="Transformation">Transformation</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
