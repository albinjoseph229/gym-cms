'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Branch } from '@/types';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [loadingBranches, setLoadingBranches] = useState(true);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const res = await fetch('/api/branches');
        if (res.ok) {
          const data = await res.json();
          setBranches(data);
          if (data.length > 0) {
            setFormData(prev => ({ ...prev, branch: data[0].name }));
            setSelectedBranch(data[0]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error);
      } finally {
        setLoadingBranches(false);
      }
    };

    fetchBranches();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'branch') {
      const branch = branches.find(b => b.name === value);
      if (branch) {
        setSelectedBranch(branch);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', branch: branches[0]?.name || '', message: '' });
        if (branches.length > 0) setSelectedBranch(branches[0]);
      } else {
        setStatus('error');
      }
    } catch (error) {
        console.error(error);
      setStatus('error');
    }
  };

  return (
    <div>
      <PageHeader 
        title="Contact Us" 
        subtitle="Get in touch with us for any inquiries or to join."
        bgImage="https://images.unsplash.com/photo-1596357395217-80de13130e92?q=80&w=1471&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-secondary p-8 md:p-10 rounded-2xl shadow-xl h-full">
              <h2 className="text-3xl font-bold mb-8 text-white text-center">Send us a Message</h2>
              {status === 'success' ? (
                <div className="bg-green-500/20 text-green-400 p-4 rounded-lg mb-6 text-center">
                  Thank you! Your message has been sent. We will contact you soon.
                </div>
              ) : status === 'error' ? (
                <div className="bg-red-500/20 text-red-400 p-4 rounded-lg mb-6 text-center">
                  Something went wrong. Please try again later.
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Branch</label>
                    <select 
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                      disabled={loadingBranches}
                    >
                      {loadingBranches ? (
                        <option>Loading branches...</option>
                      ) : (
                        branches.map(branch => (
                          <option key={branch.id} value={branch.name}>{branch.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message (Optional)</label>
                  <textarea 
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-primary hover:bg-red-600 text-white font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="lg:col-span-1">
            <div className="bg-secondary p-8 rounded-2xl shadow-xl h-full">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-primary mr-4" />
                <h3 className="text-2xl font-bold text-white">Opening Hours</h3>
              </div>
              <div className="space-y-6 text-gray-300">
                <div className="border-b border-gray-700 pb-4">
                  <span className="block text-sm text-gray-400 mb-1">Monday - Saturday</span>
                  <span className="text-xl font-bold text-white">5:00 AM - 10:00 PM</span>
                </div>
                <div className="border-b border-gray-700 pb-4">
                  <span className="block text-sm text-gray-400 mb-1">Sunday</span>
                  <span className="text-xl font-bold text-white">6:00 AM - 12:00 PM</span>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-gray-400 italic">
                    * Hours may vary on public holidays. Please contact your local branch for confirmation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branch Details Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Our Branches</h2>
          
          {loadingBranches ? (
            <div className="text-center text-gray-400">Loading branch details...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div key={branch.id} className="bg-secondary p-8 rounded-2xl shadow-lg border border-gray-800 hover:border-primary/50 transition-colors group">
                  <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <span className="w-2 h-8 bg-primary rounded-full mr-3 group-hover:h-10 transition-all"></span>
                    {branch.name}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-primary mr-3 mt-1 shrink-0" />
                      <p className="text-gray-300">{branch.location}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-primary mr-3 shrink-0" />
                      <p className="text-gray-300">{branch.contactPhone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-primary mr-3 shrink-0" />
                      <p className="text-gray-300">{branch.contactEmail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Embedded Map */}
        <div className="bg-secondary rounded-2xl overflow-hidden shadow-xl h-96 relative">
            <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250151.1627658512!2d75.836592!3d11.685357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba60c2393043255%3A0x6284e3575973715!2sWayanad%2C%20Kerala!5e0!3m2!1sen!2sin!4v1625123456789!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
            allowFullScreen 
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
