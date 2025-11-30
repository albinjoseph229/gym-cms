'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { useToast } from '@/context/ToastContext';
import { Plus, Search, Trash2, Edit, Instagram, Phone } from 'lucide-react';
import ConfirmationModal from '@/components/ui/ConfirmationModal';

export default function TrainersPage() {
  const { trainers, loading, deleteTrainer } = useAdmin();
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState<string | null>(null);

  const filteredTrainers = trainers.filter(trainer => 
    trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trainer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (id: string) => {
    setTrainerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (trainerToDelete) {
      const success = await deleteTrainer(trainerToDelete);
      if (success) {
        addToast('Trainer deleted successfully', 'success');
      } else {
        addToast('Failed to delete trainer', 'error');
      }
      setTrainerToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Trainers</h1>
        <Link href="/admin/dashboard/trainers/add" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Trainer
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by name or specialization..."
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Trainers Grid */}
      {loading ? (
        <div className="text-center text-gray-400 py-12">Loading trainers...</div>
      ) : filteredTrainers.length === 0 ? (
        <div className="text-center text-gray-400 py-12">No trainers found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary">
                <img 
                  src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=random`} 
                  alt={trainer.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
              <p className="text-primary text-sm uppercase tracking-wider mb-2">{trainer.specialization}</p>
              <p className="text-gray-400 text-sm mb-2">{trainer.experience} Experience</p>
              
              <div className="flex space-x-3 mb-4">
                {trainer.instagramProfile && (
                  <a href={trainer.instagramProfile} target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:text-pink-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {trainer.contactNumber && (
                  <a href={`tel:${trainer.contactNumber}`} className="text-green-400 hover:text-green-300">
                    <Phone className="w-5 h-5" />
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2 mt-auto">
                <Link href={`/admin/dashboard/trainers/${trainer.id}/edit`} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-full transition-colors">
                  <Edit className="w-5 h-5" />
                </Link>
                <button 
                  onClick={() => confirmDelete(trainer.id)}
                  className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Trainer"
        message="Are you sure you want to delete this trainer? This action cannot be undone."
        confirmText="Delete"
        isDangerous={true}
      />
    </div>
  );
}
