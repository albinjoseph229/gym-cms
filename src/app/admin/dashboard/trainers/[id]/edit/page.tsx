'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTrainerPage() {
  const router = useRouter();
  const params = useParams();
  const { trainers, updateTrainer, branches } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [isCustomBranch, setIsCustomBranch] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    specialization: '',
    experience: '',
    branch: '',
    description: '',
    instagramProfile: '',
    contactNumber: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (params.id && trainers.length > 0) {
      const trainer = trainers.find(t => t.id === params.id);
      if (trainer) {
        setFormData({
            id: trainer.id,
            name: trainer.name,
            specialization: trainer.specialization,
            experience: trainer.experience,
            branch: trainer.branch,
            description: trainer.description || '',
            instagramProfile: trainer.instagramProfile || '',
            contactNumber: trainer.contactNumber || '',
            photoUrl: trainer.photoUrl
        });

        // Check if branch is custom
        const isStandardBranch = branches.some(b => b.name === trainer.branch);
        if (!isStandardBranch && trainer.branch) {
            setIsCustomBranch(true);
        }
      }
    }
  }, [params.id, trainers, branches]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'branch') {
      if (value === 'Other') {
        setIsCustomBranch(true);
        setFormData(prev => ({ ...prev, branch: '' }));
      } else {
        setIsCustomBranch(false);
        setFormData(prev => ({ ...prev, branch: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCustomBranchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, branch: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await updateTrainer(formData);

      if (success) {
        router.push('/admin/dashboard/trainers');
      } else {
        alert('Failed to update trainer');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating trainer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Link href="/admin/dashboard/trainers" className="mr-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold">Edit Trainer</h1>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Trainer Name</label>
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
            <label className="block text-sm font-medium text-gray-400 mb-2">Specialization</label>
            <input 
              type="text" 
              name="specialization"
              required
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g. Bodybuilding, Yoga, Cardio"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Experience</label>
            <input 
              type="text" 
              name="experience"
              required
              value={formData.experience}
              onChange={handleChange}
              placeholder="e.g. 5 Years"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
            <select 
              name="branch"
              value={isCustomBranch ? 'Other' : formData.branch}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary mb-3"
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.name}>{branch.name}</option>
              ))}
              <option value="Other">Other (Custom Input)</option>
            </select>
            
            {isCustomBranch && (
              <input 
                type="text" 
                name="customBranch"
                required
                value={formData.branch}
                onChange={handleCustomBranchChange}
                placeholder="Enter custom branch name (e.g. Multiple Branches)"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary animate-in fade-in slide-in-from-top-2"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief bio about the trainer..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary h-24"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Instagram Profile</label>
            <input 
              type="url" 
              name="instagramProfile"
              value={formData.instagramProfile}
              onChange={handleChange}
              placeholder="https://instagram.com/username"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Contact Number</label>
            <input 
              type="tel" 
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Photo URL (Optional)</label>
            <input 
              type="url" 
              name="photoUrl"
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/trainer.jpg"
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex justify-end pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-red-600 text-white px-8 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Update Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
