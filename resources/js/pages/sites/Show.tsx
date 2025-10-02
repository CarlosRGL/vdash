import { SiteCredentialsSheet } from '@/components/sites/site-credentials-sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Globe, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { OverviewTab, PageSpeedTab } from './overview';

interface Props {
  site: Site;
}

function Show({ site }: Props) {
  const [credentialsSheetOpen, setCredentialsSheetOpen] = useState(false);
  const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
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
              <Button variant="outline" onClick={() => setCredentialsSheetOpen(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                View Credentials
              </Button>
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
        <PageSpeedTab site={site} />
      </div>

      <SiteCredentialsSheet
        open={credentialsSheetOpen}
        onOpenChange={setCredentialsSheetOpen}
        credentials={site.credential || null}
        siteName={site.name}
      />
    </AppLayout>
  );
}

export default Show;
