'use client';

import { useAdmin } from '@/context/AdminContext';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns'; // We might need to install date-fns or use simple formatter
import { useState, useEffect } from 'react';

export default function SyncStatus() {
  const { isSyncing, lastSynced, refreshData } = useAdmin();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSynced) {
        // Simple time ago logic to avoid dependency if possible, or use date-fns if available
        const diff = Math.floor((new Date().getTime() - lastSynced.getTime()) / 60000);
        if (diff < 1) setTimeAgo('Just now');
        else setTimeAgo(`${diff} min${diff > 1 ? 's' : ''} ago`);
      }
    }, 60000);
    
    // Initial set
    if (lastSynced) {
        const diff = Math.floor((new Date().getTime() - lastSynced.getTime()) / 60000);
        if (diff < 1) setTimeAgo('Just now');
        else setTimeAgo(`${diff} min${diff > 1 ? 's' : ''} ago`);
    }

    return () => clearInterval(interval);
  }, [lastSynced]);

  return (
    <div className="flex items-center space-x-4 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
      <div className="flex flex-col items-end">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
          {isSyncing ? 'Syncing...' : 'Last Synced'}
        </span>
        <span className="text-sm text-white font-bold">
          {isSyncing ? 'Updating Data' : (timeAgo || 'Never')}
        </span>
      </div>
      <button 
        onClick={() => refreshData()}
        disabled={isSyncing}
        className={`p-2 rounded-full transition-all ${isSyncing ? 'bg-gray-700 text-gray-500' : 'bg-primary/20 text-primary hover:bg-primary hover:text-white'}`}
        title="Sync Now"
      >
        <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
