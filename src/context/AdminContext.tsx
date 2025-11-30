'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Member, Trainer, Package, GalleryItem, Branch, ContactSubmission } from '@/types';

interface AdminContextType {
  members: Member[];
  trainers: Trainer[];
  packages: Package[];
  gallery: GalleryItem[];
  branches: Branch[];
  contacts: ContactSubmission[];
  loading: boolean;
  isSyncing: boolean;
  lastSynced: Date | null;
  refreshData: () => Promise<void>;
  
  // CRUD Actions (Optimistic)
  addMember: (member: Omit<Member, 'id'>) => Promise<boolean>;
  updateMember: (member: Member) => Promise<boolean>;
  deleteMember: (id: string) => Promise<boolean>;
  addTrainer: (trainer: Omit<Trainer, 'id'>) => Promise<boolean>;
  updateTrainer: (trainer: Trainer) => Promise<boolean>;
  deleteTrainer: (id: string) => Promise<boolean>;
  addPackage: (pkg: Omit<Package, 'id'>) => Promise<boolean>;
  updatePackage: (pkg: Package) => Promise<boolean>;
  deletePackage: (id: string) => Promise<boolean>;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<boolean>;
  deleteGalleryItem: (id: string) => Promise<boolean>;
  addBranch: (branch: Omit<Branch, 'id'>) => Promise<boolean>;
  deleteBranch: (id: string) => Promise<boolean>;
  deleteContact: (id: string) => Promise<boolean>;
}

const AdminContext = createContext<AdminContextType>({
  members: [],
  trainers: [],
  packages: [],
  gallery: [],
  branches: [],
  contacts: [],
  loading: true,
  isSyncing: false,
  lastSynced: null,
  refreshData: async () => {},
  addMember: async () => false,
  updateMember: async () => false,
  deleteMember: async () => false,
  addTrainer: async () => false,
  updateTrainer: async () => false,
  deleteTrainer: async () => false,
  addPackage: async () => false,
  updatePackage: async () => false,
  deletePackage: async () => false,
  addGalleryItem: async () => false,
  deleteGalleryItem: async () => false,
  addBranch: async () => false,
  deleteBranch: async () => false,
  deleteContact: async () => false,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setIsSyncing(true);
    try {
      const [membersRes, trainersRes, packagesRes, galleryRes, branchesRes, contactsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/trainers'),
        fetch('/api/packages'),
        fetch('/api/gallery'),
        fetch('/api/branches'),
        fetch('/api/contact'),
      ]);

      if (membersRes.ok) setMembers(await membersRes.json());
      if (trainersRes.ok) setTrainers(await trainersRes.json());
      if (packagesRes.ok) setPackages(await packagesRes.json());
      if (galleryRes.ok) setGallery(await galleryRes.json());
      if (branchesRes.ok) setBranches(await branchesRes.json());
      if (contactsRes.ok) setContacts(await contactsRes.json());
      
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Optimistic CRUD Actions ---

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    // 1. Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const newMember = { ...memberData, id: tempId } as Member;
    setMembers(prev => [...prev, newMember]);
    setIsSyncing(true);

    try {
      // 2. API Call
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (res.ok) {
        const result = await res.json();
        // 3. Confirm Update (Replace temp ID with real ID if needed, or just refresh)
        // For simplicity, we'll refresh data to get the server-generated ID and consistency
        await fetchData(); 
        return true;
      } else {
        throw new Error('Failed to add member');
      }
    } catch (error) {
      console.error(error);
      // 4. Revert on Failure
      setMembers(prev => prev.filter(m => m.id !== tempId));
      setIsSyncing(false);
      return false;
    }
  };

  const updateMember = async (memberData: Member) => {
    const previousMembers = [...members];
    setMembers(prev => prev.map(m => m.id === memberData.id ? memberData : m));
    setIsSyncing(true);

    try {
      const res = await fetch('/api/members', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to update member');
      }
    } catch (error) {
      console.error(error);
      setMembers(previousMembers);
      setIsSyncing(false);
      return false;
    }
  };

  const deleteMember = async (id: string) => {
    // 1. Optimistic Update
    const previousMembers = [...members];
    setMembers(prev => prev.filter(m => m.id !== id));
    setIsSyncing(true);

    try {
      // 2. API Call (Assuming DELETE endpoint exists, if not we need to create it)
      // For MVP, we might not have DELETE implemented in API yet.
      // If not, we'll just simulate it or implement it.
      // Let's assume we will implement DELETE /api/members?id=...
      const res = await fetch(`/api/members?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete member');
      }
    } catch (error) {
      console.error(error);
      // 4. Revert
      setMembers(previousMembers);
      setIsSyncing(false);
      return false;
    }
  };

  const addTrainer = async (trainerData: Omit<Trainer, 'id'>) => {
     const tempId = `temp-${Date.now()}`;
     const newTrainer = { ...trainerData, id: tempId } as Trainer;
     setTrainers(prev => [...prev, newTrainer]);
     setIsSyncing(true);

     try {
       const res = await fetch('/api/trainers', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(trainerData)
       });

       if (res.ok) {
         await fetchData();
         return true;
       } else {
         throw new Error('Failed to add trainer');
       }
     } catch (error) {
       console.error(error);
       setTrainers(prev => prev.filter(t => t.id !== tempId));
       setIsSyncing(false);
       return false;
     }
  };

  const updateTrainer = async (trainerData: Trainer) => {
    const previousTrainers = [...trainers];
    setTrainers(prev => prev.map(t => t.id === trainerData.id ? trainerData : t));
    setIsSyncing(true);

    try {
      const res = await fetch('/api/trainers', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trainerData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to update trainer');
      }
    } catch (error) {
      console.error(error);
      setTrainers(previousTrainers);
      setIsSyncing(false);
      return false;
    }
  };

  const deleteTrainer = async (id: string) => {
    const previousTrainers = [...trainers];
    setTrainers(prev => prev.filter(t => t.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/trainers?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete trainer');
      }
    } catch (error) {
      console.error(error);
      setTrainers(previousTrainers);
      setIsSyncing(false);
      return false;
    }
  };

  const addPackage = async (packageData: Omit<Package, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const newPackage = { ...packageData, id: tempId } as Package;
    setPackages(prev => [...prev, newPackage]);
    setIsSyncing(true);

    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to add package');
      }
    } catch (error) {
      console.error(error);
      setPackages(prev => prev.filter(p => p.id !== tempId));
      setIsSyncing(false);
      return false;
    }
  };

  const updatePackage = async (packageData: Package) => {
    const previousPackages = [...packages];
    setPackages(prev => prev.map(p => p.id === packageData.id ? packageData : p));
    setIsSyncing(true);

    try {
      const res = await fetch('/api/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packageData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to update package');
      }
    } catch (error) {
      console.error(error);
      setPackages(previousPackages);
      setIsSyncing(false);
      return false;
    }
  };

  const deletePackage = async (id: string) => {
    const previousPackages = [...packages];
    setPackages(prev => prev.filter(p => p.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete package');
      }
    } catch (error) {
      console.error(error);
      setPackages(previousPackages);
      setIsSyncing(false);
      return false;
    }
  };

  const addGalleryItem = async (itemData: Omit<GalleryItem, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const newItem = { ...itemData, id: tempId } as GalleryItem;
    setGallery(prev => [...prev, newItem]);
    setIsSyncing(true);

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to add gallery item');
      }
    } catch (error) {
      console.error(error);
      setGallery(prev => prev.filter(i => i.id !== tempId));
      setIsSyncing(false);
      return false;
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const previousGallery = [...gallery];
    setGallery(prev => prev.filter(i => i.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete gallery item');
      }
    } catch (error) {
      console.error(error);
      setGallery(previousGallery);
      setIsSyncing(false);
      return false;
    }
  };

  const addBranch = async (branchData: Omit<Branch, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const newBranch = { ...branchData, id: tempId } as Branch;
    setBranches(prev => [...prev, newBranch]);
    setIsSyncing(true);

    try {
      const res = await fetch('/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branchData)
      });

      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to add branch');
      }
    } catch (error) {
      console.error(error);
      setBranches(prev => prev.filter(b => b.id !== tempId));
      setIsSyncing(false);
      return false;
    }
  };

  const deleteBranch = async (id: string) => {
    const previousBranches = [...branches];
    setBranches(prev => prev.filter(b => b.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/branches?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete branch');
      }
    } catch (error) {
      console.error(error);
      setBranches(previousBranches);
      setIsSyncing(false);
      return false;
    }
  };

  const deleteContact = async (id: string) => {
    const previousContacts = [...contacts];
    setContacts(prev => prev.filter(c => c.id !== id));
    setIsSyncing(true);

    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        await fetchData();
        return true;
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error(error);
      setContacts(previousContacts);
      setIsSyncing(false);
      return false;
    }
  };

  const value = React.useMemo(() => ({
    members, trainers, packages, gallery, branches, contacts,
    loading, isSyncing, lastSynced, refreshData: fetchData,
    addMember, deleteMember, updateMember, addTrainer, updateTrainer, deleteTrainer, 
    addPackage, updatePackage, deletePackage, addGalleryItem, deleteGalleryItem, 
    addBranch, deleteBranch, deleteContact
  }), [
    members, trainers, packages, gallery, branches, contacts,
    loading, isSyncing, lastSynced, fetchData,
    // Functions are currently recreated on every render, so we need to include them or wrap them in useCallback.
    // However, since they depend on state (for rollback), they change when state changes anyway.
    // But wrapping the value in useMemo prevents it from changing when ONLY children changes (navigation).
  ]);

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
