'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Plus, Check, Trash2, Edit } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function PackagesPage() {
  const { packages, loading, deletePackage } = useAdmin();
  const { addToast } = useToast();

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setPackageToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (packageToDelete) {
      const success = await deletePackage(packageToDelete);
      if (success) {
        addToast('Package deleted successfully', 'success');
      } else {
        addToast('Failed to delete package', 'error');
      }
      setPackageToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Packages</h1>
        <Link href="/admin/dashboard/packages/add" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Package
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-gray-400 col-span-3 text-center">Loading packages...</div>
        ) : packages.length === 0 ? (
          <div className="text-gray-400 col-span-3 text-center">No packages found.</div>
        ) : (
          packages.map((pkg) => (
            <div key={pkg.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white uppercase tracking-wider">{pkg.name}</h3>
                  <p className="text-gray-400 text-sm">{pkg.durationDays} Days</p>
                </div>
                <div className="text-2xl font-bold text-primary">₹{pkg.price}</div>
              </div>
              
              <ul className="space-y-2 mb-6 flex-grow">
                {pkg.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-300">
                    <Check className="w-4 h-4 text-primary mr-2 mt-0.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-700">
                <Link href={`/admin/dashboard/packages/${pkg.id}/edit`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors">
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => confirmDelete(pkg.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
}
