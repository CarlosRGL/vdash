import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
interface EditSiteApiSyncProps {
  site: Site;
}

export default function EditSiteApiSync({ site }: EditSiteApiSyncProps) {
  const { setData, data, put, processing, errors } = useForm({
    sync_enabled: site.sync_enabled || false,
    api_token: site.api_token || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('sites.api-sync.update', site.id));
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
    {
      title: 'Contract Information',
      href: `/sites/${site.id}/contracts/edit`,
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <SiteLayout siteId={site.id} siteName={site.name}>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>API Sync Settings</CardTitle>
            <CardDescription>Configure automatic sync from WordPress system info API</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="sync_enabled" checked={data.sync_enabled} onCheckedChange={(checked) => setData('sync_enabled', checked as boolean)} />
                <Label htmlFor="sync_enabled" className="text-sm font-medium">
                  Enable automatic sync
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api_token" className="text-sm font-medium">
                  API Token
                </Label>
                <Input
                  id="api_token"
                  type="text"
                  value={data.api_token}
                  onChange={(e) => setData('api_token', e.target.value)}
                  placeholder="Enter API token"
                />
                {errors.api_token && <p className="text-sm text-red-500">{errors.api_token}</p>}
                <p className="text-xs text-gray-500">API token for accessing /wp-json/teamtreize/v1/system-info/{'{token}'}</p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </SiteLayout>
    </AppLayout>
  );
}
