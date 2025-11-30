import Link from 'next/link';
import { LayoutDashboard, Users, Dumbbell, Package, Image, MapPin, MessageSquare, LogOut } from 'lucide-react';
import { AdminProvider } from '@/context/AdminContext';
import SyncStatus from '@/components/admin/SyncStatus';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col fixed h-full z-10">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-extrabold uppercase tracking-tighter">
              OASIS <span className="text-primary">ADMIN</span>
            </h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <Link href="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <LayoutDashboard className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
            <Link href="/admin/dashboard/members" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Users className="w-5 h-5 mr-3" />
              Members
            </Link>
            <Link href="/admin/dashboard/trainers" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Dumbbell className="w-5 h-5 mr-3" />
              Trainers
            </Link>
            <Link href="/admin/dashboard/packages" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Package className="w-5 h-5 mr-3" />
              Packages
            </Link>
            <Link href="/admin/dashboard/gallery" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <Image className="w-5 h-5 mr-3" />
              Gallery
            </Link>
            <Link href="/admin/dashboard/branches" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <MapPin className="w-5 h-5 mr-3" />
              Branches
            </Link>
            <Link href="/admin/dashboard/contacts" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
              <MessageSquare className="w-5 h-5 mr-3" />
              Contact Requests
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-700">
            <Link href="/admin/login" className="flex items-center px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Header with Sync Status */}
          <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-end sticky top-0 z-20 shadow-md">
             <SyncStatus />
          </header>
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminProvider>
  );
}
