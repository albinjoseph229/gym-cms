'use client';

import { Mail, Phone, MapPin, Calendar, Trash2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function ContactRequestsPage() {
  const { contacts, loading, deleteContact } = useAdmin();

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this contact request?')) {
      await deleteContact(id);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Contact Requests</h1>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-700 text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Branch</th>
                <th className="px-6 py-3">Message</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {contacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 text-gray-400 text-sm whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {contact.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{contact.name}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="flex items-center text-gray-300 mb-1"><Mail className="w-3 h-3 mr-2" /> {contact.email}</p>
                      <p className="flex items-center text-gray-300"><Phone className="w-3 h-3 mr-2" /> {contact.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-bold uppercase">{contact.branch}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{contact.message}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded-lg"
                      title="Delete Request"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
