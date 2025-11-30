'use client';

import { useData } from '@/context/DataContext';
import PageHeader from '@/components/ui/PageHeader';
import { Instagram, Phone } from 'lucide-react';

export default function TrainersPage() {
  const { trainers, loading } = useData();

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHeader 
        title="Our Proficient Trainers" 
        subtitle="Meet the experts who will guide you on your fitness journey."
        bgImage="https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1975&auto=format&fit=crop"
      />

      <section className="py-8">
        <div className="container mx-auto px-4">


          {loading ? (
            <div className="text-center text-gray-500">Loading trainers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="group text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-primary transition-colors duration-300 mx-auto">
                      <img 
                        src={trainer.photoUrl || `https://ui-avatars.com/api/?name=${trainer.name}&background=random`} 
                        alt={trainer.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="flex space-x-1">
                         {/* Social Icons Placeholder */}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{trainer.name}</h3>
                  <p className="text-gray-500 text-sm uppercase tracking-wider mb-4">{trainer.specialization}</p>
                  
                  {trainer.description && (
                    <p className="text-gray-400 text-sm px-4 mb-6 line-clamp-3">{trainer.description}</p>
                  )}
                  
                  <div className="flex justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {trainer.instagramProfile && (
                      <a href={trainer.instagramProfile} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                    {trainer.contactNumber && (
                      <a href={`tel:${trainer.contactNumber}`} className="text-gray-400 hover:text-green-500 transition-colors">
                        <Phone className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
