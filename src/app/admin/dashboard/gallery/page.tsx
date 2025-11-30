'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { Plus, Trash2 } from 'lucide-react';

export default function GalleryAdminPage() {
  const { gallery: images, loading, deleteGalleryItem } = useAdmin();

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Gallery</h1>
        <Link href="/admin/dashboard/gallery/add" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Image
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="text-gray-400 col-span-4 text-center">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-gray-400 col-span-4 text-center">No images found.</div>
        ) : (
          images.map((item) => (
            <div key={item.id} className="group relative aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
              <img 
                src={item.imageUrl} 
                alt={item.caption} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <p className="text-white font-medium text-sm truncate">{item.caption}</p>
                <p className="text-primary text-xs uppercase">{item.category}</p>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this image?')) {
                      deleteGalleryItem(item.id);
                    }
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
