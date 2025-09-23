import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ExternalLink, Globe } from 'lucide-react';
import { useState } from 'react';
import { ContractTab, CredentialsTab, OverviewTab, ServerInfoTab, UsersTab } from './overview';

interface Props {
  site: Site;
}

function Show({ site }: Props) {
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You might want to add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

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

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-10 grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="server">Server Info</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab site={site} copyToClipboard={copyToClipboard} formatDate={formatDate} getStoragePercentage={getStoragePercentage} />
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <CredentialsTab
              site={site}
              showPasswords={showPasswords}
              togglePasswordVisibility={togglePasswordVisibility}
              copyToClipboard={copyToClipboard}
            />
          </TabsContent>

          {/* Server Info Tab */}
          <TabsContent value="server" className="space-y-6">
            <ServerInfoTab site={site} copyToClipboard={copyToClipboard} />
          </TabsContent>

          {/* Contract Tab */}
          <TabsContent value="contract" className="space-y-6">
            <ContractTab site={site} formatDate={formatDate} getStoragePercentage={getStoragePercentage} />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <UsersTab site={site} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

export default Show;
