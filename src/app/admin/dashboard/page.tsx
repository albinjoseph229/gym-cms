import { Users, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Total Members</p>
              <h3 className="text-3xl font-bold text-white">1,245</h3>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">+12% from last month</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Active Plans</p>
              <h3 className="text-3xl font-bold text-white">892</h3>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <span className="text-gray-400 text-sm">72% of total members</span>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm">Expiring Soon</p>
              <h3 className="text-3xl font-bold text-white">45</h3>
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
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <h3 className="text-3xl font-bold text-white">₹4.2L</h3>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
          <span className="text-green-400 text-sm font-medium">+8% vs last month</span>
        </div>
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4">Recent Registrations</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">New Member {i}</p>
                    <p className="text-xs text-gray-400">Joined today</p>
                  </div>
                </div>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
             <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <Users className="w-6 h-6 text-primary mb-2" />
               <span className="font-bold block">Add Member</span>
             </button>
             <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <CreditCard className="w-6 h-6 text-green-500 mb-2" />
               <span className="font-bold block">Renew Plan</span>
             </button>
             <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <AlertTriangle className="w-6 h-6 text-yellow-500 mb-2" />
               <span className="font-bold block">Send Reminders</span>
             </button>
             <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-left transition-colors">
               <TrendingUp className="w-6 h-6 text-blue-500 mb-2" />
               <span className="font-bold block">View Reports</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
