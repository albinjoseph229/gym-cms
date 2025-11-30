'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Branch } from '@/types';

export default function Footer() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch('/api/branches');
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
  }, []);

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <Link href="/" className="text-3xl font-extrabold uppercase tracking-tighter mb-6 block">
              OASIS <span className="text-primary">FITNESS ACADEMY</span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed">
              The most effective routine advice for your health. We have a great deal of experience with fitness.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary text-white transition-all transform hover:-translate-y-1">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary text-white transition-all transform hover:-translate-y-1">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary text-white transition-all transform hover:-translate-y-1">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-extrabold mb-8 uppercase tracking-widest border-l-4 border-primary pl-4">Quick Links</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              <li><Link href="/" className="hover:text-primary transition-colors flex items-center"><span className="mr-2">›</span> Home</Link></li>
              <li><Link href="/trainers" className="hover:text-primary transition-colors flex items-center"><span className="mr-2">›</span> Trainers</Link></li>
              <li><Link href="/packages" className="hover:text-primary transition-colors flex items-center"><span className="mr-2">›</span> Packages</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors flex items-center"><span className="mr-2">›</span> Gallery</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors flex items-center"><span className="mr-2">›</span> Contact</Link></li>
            </ul>
          </div>

          {/* Branches */}
          <div>
            <h3 className="text-lg font-extrabold mb-8 uppercase tracking-widest border-l-4 border-primary pl-4">Our Branches</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              {loading ? (
                <li>Loading...</li>
              ) : (
                branches.map((branch) => (
                  <li key={branch.id} className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-1" />
                    <span>{branch.name}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-extrabold mb-8 uppercase tracking-widest border-l-4 border-primary pl-4">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 font-medium">
              {loading ? (
                <li>Loading...</li>
              ) : (
                <>
                  {branches.map((branch) => (
                    <li key={`phone-${branch.id}`} className="flex items-center">
                      <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <span>{branch.contactPhone}</span>
                    </li>
                  ))}
                  {branches.map((branch) => (
                    <li key={`email-${branch.id}`} className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                      <span>{branch.contactEmail}</span>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Oasis Fitness Academy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">Privacy Policy</Link>
            <Link href="#" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
