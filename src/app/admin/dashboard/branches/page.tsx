'use client';

import { MapPin, Phone, Mail, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';

export default function BranchesPage() {
  const { branches, loading, deleteBranch } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Branches</h1>
        <Link href="/admin/dashboard/branches/add" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Branch
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading branches...</div>
      ) : branches.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No branches found. Add one to get started.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch) => (
            <div key={branch.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">{branch.name}</h3>
              </div>
              
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> {branch.location}</p>
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> {branch.contactPhone}</p>
                <p className="flex items-center"><Mail className="w-4 h-4 mr-2" /> {branch.contactEmail}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700 flex justify-end">
                 <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this branch?')) {
                      deleteBranch(branch.id);
                    }
                  }}
                  className="text-red-400 hover:text-red-300 flex items-center text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
