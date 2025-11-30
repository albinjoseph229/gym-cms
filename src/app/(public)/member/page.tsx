'use client';

import { useState } from 'react';
import PageHeader from '@/components/ui/PageHeader';
import { Member } from '@/types';
import { Search, User, Calendar, CreditCard, AlertCircle, CheckCircle, Mail, Phone } from 'lucide-react';

export default function MemberStatusPage() {
  const [memberId, setMemberId] = useState('');
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId.trim()) return;

    setLoading(true);
    setError('');
    setMember(null);

    try {
      const res = await fetch(`/api/members/search?id=${encodeURIComponent(memberId)}`);
      if (res.ok) {
        const data = await res.json();
        setMember(data);
      } else {
        const errData = await res.json();
        setError(errData.error || 'Member not found');
      }
    } catch (err) {
        console.error(err);
      setError('Failed to fetch member details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* Page Header with inline background */}
      <div className="relative bg-gray-900 py-8 md:py-12 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-0"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 uppercase tracking-tight">
            MEMBER STATUS
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Check your membership validity and profile details.
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Search Box */}
          <div className="bg-secondary p-6 md:p-8 rounded-2xl shadow-xl mb-12">
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Enter Member ID</h2>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="Ex: GYM-001"
                className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-lg w-full"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-primary hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50 flex justify-center items-center"
              >
                {loading ? 'Searching...' : <Search className="w-6 h-6" />}
              </button>
            </form>
            <p className="text-gray-400 text-sm mt-4 text-center">
              You can find your Member ID on your membership card or welcome email.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 text-red-400 p-6 rounded-xl text-center mb-8 border border-red-500/50">
              <AlertCircle className="w-12 h-12 mx-auto mb-2" />
              <p className="font-bold text-lg">{error}</p>
            </div>
          )}

          {/* Member Details Card */}
          {member && (
            <div className="bg-white text-gray-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-primary overflow-hidden">
                  {member.profilePhotoUrl ? (
                    <img src={member.profilePhotoUrl} alt={member.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold">{member.fullName}</h2>
                  <p className="text-gray-400 text-lg">{member.id}</p>
                  <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold mt-2 uppercase">
                    {member.branchName} Branch
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Membership Status */}
                <div>
                  <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-4">Current Membership</h3>
                  <div className="flex items-center justify-between bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div>
                      <p className="text-xl font-bold text-gray-900">{member.currentPlan}</p>
                      <p className="text-sm text-gray-500">Expires on {member.planExpiryDate}</p>
                    </div>
                    <div className="text-right">
                      {member.remainingDays > 0 ? (
                        <>
                          <span className="block text-3xl font-extrabold text-green-600">{member.remainingDays}</span>
                          <span className="text-xs font-bold text-green-600 uppercase">Days Left</span>
                        </>
                      ) : (
                        <>
                          <span className="block text-3xl font-extrabold text-red-600">EXPIRED</span>
                          <span className="text-xs font-bold text-red-600 uppercase">Renew Now</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Annual Fee Status */}
                <div>
                  <h3 className="text-gray-500 font-bold uppercase tracking-wider text-sm mb-4">Annual Membership Fee</h3>
                  {(() => {
                    const isAnnualFeeExpired = member.annualFeeExpiryDate ? new Date(member.annualFeeExpiryDate) < new Date() : false;
                    const isPaid = member.annualFeePaid && !isAnnualFeeExpired;
                    
                    return (
                      <div className={`flex items-center p-6 rounded-xl border ${isPaid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        {isPaid ? (
                          <CheckCircle className="w-8 h-8 text-green-500 mr-4" />
                        ) : (
                          <AlertCircle className="w-8 h-8 text-red-500 mr-4" />
                        )}
                        <div>
                          <p className={`text-lg font-bold ${isPaid ? 'text-green-700' : 'text-red-700'}`}>
                            {member.annualFeePaid 
                              ? (isAnnualFeeExpired ? 'EXPIRED' : 'Paid') 
                              : 'Unpaid / Overdue'}
                          </p>
                          <p className={`text-sm ${isPaid ? 'text-green-600' : 'text-red-600'}`}>
                            Expires on: {member.annualFeeExpiryDate || 'N/A'}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Personal Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{member.mobileNumber}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                    <span>Joined: {member.registrationDate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}