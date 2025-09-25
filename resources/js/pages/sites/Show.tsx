import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Globe } from 'lucide-react';
import { useState } from 'react';
import { CredentialsTab, OverviewTab } from './overview';

interface Props {
  site: Site;
}

function Show({ site }: Props) {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStoragePercentage = () => {
    if (!site.contract?.contract_storage_usage || !site.contract?.contract_storage_limit) {
      return 0;
    }
    const usage = parseFloat(site.contract.contract_storage_usage);
    const limit = parseFloat(site.contract.contract_storage_limit);
    return isNaN(usage) || isNaN(limit) || limit === 0 ? 0 : (usage / limit) * 100;
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sites',
      href: '/sites',
    },
    {
      title: site.name,
      href: `/sites/${site.id}`,
    },
  ];

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`${site.name} - Site Details`} />

      <div className="mx-auto flex h-full w-full max-w-[1920px] flex-1 flex-col gap-4 p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-xl font-bold">{site.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {site.url && (
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <Globe className="h-4 w-4" />
                    {site.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {site.type && <Badge variant="secondary">{site.type}</Badge>}
                {site.team && <Badge variant="outline">{site.team}</Badge>}
              </div>
              <div className="mt-4 flex space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</label>
                  <p className="text-sm">{formatDate(site.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</label>
                  <p className="text-sm">{formatDate(site.updated_at)}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/sites/${site.id}/edit`}>Edit Site & Sync Settings</Link>
              </Button>
              <Button asChild>
                <Link href="/sites">Back to Sites</Link>
              </Button>
            </div>
          </div>

          {site.description && (
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300">{site.description}</p>
            </div>
          )}
        </div>

        <OverviewTab site={site} formatDate={formatDate} getStoragePercentage={getStoragePercentage} />
        <CredentialsTab site={site} showPasswords={showPasswords} togglePasswordVisibility={togglePasswordVisibility} />
      </div>
    </AppLayout>
  );
}

export default Show;
