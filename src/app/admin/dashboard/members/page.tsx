'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { Search, Plus, Trash2, CreditCard } from 'lucide-react';

export default function MembersPage() {
  const { members, loading, deleteMember } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.mobileNumber.includes(searchTerm)
  );

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this member?')) {
      await deleteMember(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Members</h1>
        <Link href="/admin/dashboard/members/add" className="bg-primary hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Add Member
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search by name, ID, or mobile..."
          className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
      </div>

      {/* Members Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
              <tr>
                <th className="py-4 px-6">ID</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Mobile</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Expiry</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">Loading members...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">No members found.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-750 transition-colors">
                    <td className="py-4 px-6 font-mono text-sm text-primary">{member.id}</td>
                    <td className="py-4 px-6 font-medium text-white">{member.fullName}</td>
                    <td className="py-4 px-6">{member.mobileNumber}</td>
                    <td className="py-4 px-6">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">{member.currentPlan}</span>
                    </td>
                    <td className="py-4 px-6 text-sm">{member.planExpiryDate}</td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-3">
                        <Link href={`/admin/dashboard/members/${member.id}/card`} className="text-blue-400 hover:text-blue-300" title="Generate ID Card">
                          <CreditCard className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="text-red-400 hover:text-red-300" 
                          title="Delete Member"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
