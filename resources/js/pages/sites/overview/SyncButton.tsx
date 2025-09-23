import { Button } from '@/components/ui/button';
import { type Site } from '@/types';
import { router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface SyncButtonProps {
  site: Site;
}

export function SyncButton({ site }: SyncButtonProps) {
  const [syncing, setSyncing] = useState(false);

  const handleSync = () => {
    if (!site.sync_enabled) {
      alert('Please enable sync first and save the settings.');
      return;
    }

    setSyncing(true);
    router.post(
      route('sites.sync', site.id),
      {},
      {
        onFinish: () => setSyncing(false),
      },
    );
  };

  return (
    <Button onClick={handleSync} disabled={syncing || !site.sync_enabled} className="flex items-center gap-2">
      <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Syncing...' : 'Sync Now'}
    </Button>
  );
}
