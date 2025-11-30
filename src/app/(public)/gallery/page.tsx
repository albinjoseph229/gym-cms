'use client';

import { useState } from 'react';
import { useData } from '@/context/DataContext';
import PageHeader from '@/components/ui/PageHeader';


export default function GalleryPage() {
  const { gallery: images, loading } = useData();
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Equipment', 'Group Classes', 'Transformation', 'Other'];
  const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHeader 
        title="Gallery" 
        subtitle="Take a look inside our world-class facilities."
        bgImage="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                filter === cat 
                  ? 'bg-primary text-white shadow-lg scale-105' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading gallery...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-xl aspect-square bg-gray-900 border border-gray-800">
                <img 
                  src={item.imageUrl} 
                  alt={item.caption || 'Gym Image'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-bold text-lg px-4 text-center">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
