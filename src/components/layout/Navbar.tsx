'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold uppercase tracking-tighter text-white">
          VITALITY <span className="text-primary">GYM</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Home</Link>
          <Link href="/trainers" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Trainers</Link>
          <Link href="/packages" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Packages</Link>
          <Link href="/gallery" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Gallery</Link>
          <Link href="/contact" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Contact</Link>
          <Link href="/member" className="text-sm font-bold uppercase tracking-widest text-white hover:text-primary transition-colors">Member Status</Link>
          <Link href="/contact" className="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all transform hover:scale-105">
            Join Now
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 absolute top-full left-0 w-full border-t border-gray-800">
          <div className="flex flex-col p-6 space-y-4">
            <Link href="/" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Home</Link>
            <Link href="/trainers" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Trainers</Link>
            <Link href="/packages" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Packages</Link>
            <Link href="/gallery" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Gallery</Link>
            <Link href="/contact" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link href="/member" className="text-white font-bold uppercase hover:text-primary" onClick={() => setIsOpen(false)}>Member Status</Link>
            <Link href="/contact" className="bg-primary text-white text-center py-3 rounded font-bold uppercase" onClick={() => setIsOpen(false)}>
              Join Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
