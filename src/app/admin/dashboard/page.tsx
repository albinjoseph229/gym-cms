'use client';

import { Users, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import Link from 'next/link';

export default function AdminDashboard() {
  const { members, packages, loading } = useAdmin();

  // 1. Total Members
  const totalMembers = members.length;

  // 2. Active Plans (Expiry > Today)
  const today = new Date();
  const activePlans = members.filter(m => {
    if (!m.planExpiryDate) return false;
    return new Date(m.planExpiryDate) > today;
  }).length;

  // 3. Expiring Soon (Expiry within next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(today.getDate() + 7);
  
  const expiringSoon = members.filter(m => {
    if (!m.planExpiryDate) return false;
    const expiry = new Date(m.planExpiryDate);
    return expiry > today && expiry <= sevenDaysFromNow;
  }).length;

  // 4. Monthly Revenue (Sum of package prices and annual fees for current month)
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const monthlyRevenue = members.reduce((acc, member) => {
    let total = acc;

    // Add Plan Fee if plan started this month
    if (member.planStartDate) {
      const planDate = new Date(member.planStartDate);
      if (planDate.getMonth() === currentMonth && planDate.getFullYear() === currentYear) {
        total += (member.planFee || 0);
      }
    }

    // Add Annual Fee if paid this month
    if (member.feeValidityDate && member.annualFeePaid) {
      const feeDate = new Date(member.feeValidityDate);
      if (feeDate.getMonth() === currentMonth && feeDate.getFullYear() === currentYear) {
        total += (member.annualFeeAmount || 0);
      }
    }

    return total;
  }, 0);

  // 5. Expired Plans (Expiry < Today)
  const expiredPlans = members.filter(m => {
    if (!m.planExpiryDate) return false;
    return new Date(m.planExpiryDate) < today;
  }).length;

  // 6. Expired Memberships (Annual Fee Expiry < Today)
  const expiredMemberships = members.filter(m => {
    if (!m.annualFeeExpiryDate) return false;
    return new Date(m.annualFeeExpiryDate) < today;
  }).length;

  // 7. Recent Registrations (Last 5)
  // Assuming members are added in order or we sort by registrationDate (desc)
  // For now, just take last 5 reversed
  const recentMembers = [...members].reverse().slice(0, 5);

  if (loading) {
    return <div className="text-white">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <h3 className="text-3xl font-bold text-white">{totalMembers}</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">Updated just now</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Active Plans</p>
              <h3 className="text-3xl font-bold text-white">{activePlans}</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <span className="text-gray-400 text-sm">{totalMembers > 0 ? Math.round((activePlans / totalMembers) * 100) : 0}% of total members</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-white">₹{monthlyRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">Current Month</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Expiring Soon</p>
              <h3 className="text-3xl font-bold text-white">{expiringSoon}</h3>
            </div>
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <span className="text-yellow-400 text-sm">Within 7 days</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Expired Plans</p>
              <h3 className="text-3xl font-bold text-white">{expiredPlans}</h3>
            </div>
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <span className="text-red-400 text-sm">Need Renewal</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Expired Memberships</p>
              <h3 className="text-3xl font-bold text-white">{expiredMemberships}</h3>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Users className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <span className="text-orange-400 text-sm">Annual Fee Due</span>
        </div>
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4">Recent Registrations</h3>
          <div className="space-y-4">
            {recentMembers.length === 0 ? (
                <p className="text-gray-400">No recent registrations.</p>
            ) : (
                recentMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="font-bold text-white">{member.fullName}</p>
                        <p className="text-xs text-gray-400">Joined {member.registrationDate}</p>
                    </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                        new Date(member.planExpiryDate) > today 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                        {new Date(member.planExpiryDate) > today ? 'Active' : 'Expired'}
                    </span>
                </div>
                ))
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <Link href="/admin/dashboard/members/add" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <Users className="w-6 h-6 text-primary mb-2" />
               <span className="font-bold block text-white">Add Member</span>
             </Link>
             <Link href="/admin/dashboard/packages/add" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <CreditCard className="w-6 h-6 text-green-500 mb-2" />
               <span className="font-bold block text-white">Add Package</span>
             </Link>
             <Link href="/admin/dashboard/contacts" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
               <span className="font-bold block text-white">Contact Requests</span>
             </Link>
             <Link href="/admin/dashboard/members" className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
               <span className="font-bold block text-white">View Members</span>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
