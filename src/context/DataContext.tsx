'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Trainer, Package, GalleryItem } from '@/types';

interface DataContextType {
  trainers: Trainer[];
  packages: Package[];
  gallery: GalleryItem[];
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  trainers: [],
  packages: [],
  gallery: [],
  loading: true,
});

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [trainersRes, packagesRes, galleryRes] = await Promise.all([
          fetch('/api/trainers'),
          fetch('/api/packages'),
          fetch('/api/gallery')
        ]);

        if (trainersRes.ok) setTrainers(await trainersRes.json());
        if (packagesRes.ok) setPackages(await packagesRes.json());
        if (galleryRes.ok) setGallery(await galleryRes.json());
      } catch (error) {
        console.error('Error prefetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ trainers, packages, gallery, loading }}>
      {children}
    </DataContext.Provider>
  );
};
