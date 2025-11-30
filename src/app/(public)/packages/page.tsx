'use client';

import { useData } from '@/context/DataContext';
import { Package } from '@/types';
import PageHeader from '@/components/ui/PageHeader';
import { Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PackagesPage() {
  const { packages, loading } = useData();

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <PageHeader 
        title="Membership Plans" 
        subtitle="Choose the perfect plan that fits your fitness goals."
        bgImage="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
      />

      <section className="py-8">
        <div className="container mx-auto px-4">


          {loading ? (
            <div className="text-center text-gray-500">Loading plans...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg, index) => (
                <div key={pkg.id} className={`relative bg-[#151515] rounded-2xl overflow-hidden border transition-all duration-300 group hover:-translate-y-2 ${index === 1 ? 'border-primary shadow-[0_0_30px_rgba(255,87,34,0.2)]' : 'border-gray-800 hover:border-gray-600'}`}>
                  {/* Header */}
                  <div className={`p-8 ${index === 1 ? 'bg-primary' : 'bg-[#1a1a1a] group-hover:bg-[#222]'}`}>
                    <h3 className={`text-xl font-bold uppercase tracking-wider mb-2 ${index === 1 ? 'text-white' : 'text-gray-300'}`}>{pkg.name}</h3>
                    <div className="flex items-baseline">
                      <span className={`text-5xl font-extrabold ${index === 1 ? 'text-white' : 'text-primary'}`}>₹{pkg.price}</span>
                      <span className={`ml-2 text-sm font-medium ${index === 1 ? 'text-white/80' : 'text-gray-500'}`}>/ {pkg.durationDays} Days</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8">
                    <ul className="space-y-4 mb-8">
                      {pkg.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <div className={`p-1 rounded-full mr-3 shrink-0 ${index === 1 ? 'bg-primary/20 text-white' : 'bg-gray-800 text-primary'}`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="text-gray-400 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/contact" className={`w-full block text-center py-4 rounded-lg font-bold uppercase tracking-widest transition-colors ${index === 1 ? 'bg-white text-primary hover:bg-gray-100' : 'bg-gray-800 text-white hover:bg-primary'}`}>
                      Choose Plan
                    </Link>
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
