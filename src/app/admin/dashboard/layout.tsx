import { AdminProvider } from '@/context/AdminContext';
import { ToastProvider } from '@/context/ToastContext';
import SyncStatus from '@/components/admin/SyncStatus';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <ToastProvider>
        <div className="flex min-h-screen bg-gray-900 text-white">
          <AdminSidebar />

          {/* Main Content */}
          <main className="flex-1 md:ml-64 transition-all duration-300">
            {/* Header with Sync Status */}
            <header className="bg-gray-800 border-b border-gray-700 p-4 flex justify-end sticky top-0 z-20 shadow-md">
               <SyncStatus />
            </header>
            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </AdminProvider>
  );
}
