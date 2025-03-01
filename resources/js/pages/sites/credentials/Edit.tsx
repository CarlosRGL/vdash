import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface EditSiteCredentialsProps {
  site: Site;
  credential: SiteCredential | null;
}

export default function EditSiteCredentials({ site, credential }: EditSiteCredentialsProps) {
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
      title: 'Credentials',
      href: `/sites/${site.id}/credentials/edit`,
    },
  ];

  const defaultCredential: SiteCredential = credential || {
    id: 0,
    site_id: site.id,
    ftp_host: '',
    ftp_username: '',
    ftp_password: '',
    db_host: '',
    db_name: '',
    db_username: '',
    db_password: '',
    login_url: '',
    login_username: '',
    login_password: '',
    api_keys: '',
    contract_start_date: null,
    contract_end_date: null,
    contract_capacity: '',
    contract_storage_usage: '',
    contract_storage_limit: '',
    created_at: '',
    updated_at: '',
  };

  const { setData, data, put, processing, errors } = useForm({
    ftp_host: defaultCredential.ftp_host || '',
    ftp_username: defaultCredential.ftp_username || '',
    ftp_password: defaultCredential.ftp_password || '',
    db_host: defaultCredential.db_host || '',
    db_name: defaultCredential.db_name || '',
    db_username: defaultCredential.db_username || '',
    db_password: defaultCredential.db_password || '',
    login_url: defaultCredential.login_url || '',
    login_username: defaultCredential.login_username || '',
    login_password: defaultCredential.login_password || '',
    api_keys: defaultCredential.api_keys || '',
    contract_start_date: defaultCredential.contract_start_date || '',
    contract_end_date: defaultCredential.contract_end_date || '',
    contract_capacity: defaultCredential.contract_capacity || '',
    contract_storage_usage: defaultCredential.contract_storage_usage || '',
    contract_storage_limit: defaultCredential.contract_storage_limit || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('sites.credentials.update', site.id));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Credentials: ${site.name}`} />
      <SiteLayout siteId={site.id} siteName={site.name}>
        <Card>
          <CardHeader>
            <CardTitle>Site Credentials</CardTitle>
            <CardDescription>Manage access credentials for this site</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* FTP Credentials */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">FTP Credentials</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="ftp_host">FTP Host</Label>
                    <Input id="ftp_host" placeholder="ftp.example.com" value={data.ftp_host} onChange={(e) => setData('ftp_host', e.target.value)} />
                    {errors.ftp_host && <p className="text-sm text-red-500">{errors.ftp_host}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ftp_username">FTP Username</Label>
                    <Input
                      id="ftp_username"
                      placeholder="username"
                      value={data.ftp_username}
                      onChange={(e) => setData('ftp_username', e.target.value)}
                    />
                    {errors.ftp_username && <p className="text-sm text-red-500">{errors.ftp_username}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ftp_password">FTP Password</Label>
                    <Input
                      id="ftp_password"
                      type="password"
                      placeholder="••••••••"
                      value={data.ftp_password}
                      onChange={(e) => setData('ftp_password', e.target.value)}
                    />
                    {errors.ftp_password && <p className="text-sm text-red-500">{errors.ftp_password}</p>}
                  </div>
                </div>
              </div>

              {/* Database Credentials */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Database Credentials</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="db_host">Database Host</Label>
                    <Input id="db_host" placeholder="localhost" value={data.db_host} onChange={(e) => setData('db_host', e.target.value)} />
                    {errors.db_host && <p className="text-sm text-red-500">{errors.db_host}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db_name">Database Name</Label>
                    <Input id="db_name" placeholder="database_name" value={data.db_name} onChange={(e) => setData('db_name', e.target.value)} />
                    {errors.db_name && <p className="text-sm text-red-500">{errors.db_name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db_username">Database Username</Label>
                    <Input id="db_username" placeholder="db_user" value={data.db_username} onChange={(e) => setData('db_username', e.target.value)} />
                    {errors.db_username && <p className="text-sm text-red-500">{errors.db_username}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="db_password">Database Password</Label>
                    <Input
                      id="db_password"
                      type="password"
                      placeholder="••••••••"
                      value={data.db_password}
                      onChange={(e) => setData('db_password', e.target.value)}
                    />
                    {errors.db_password && <p className="text-sm text-red-500">{errors.db_password}</p>}
                  </div>
                </div>
              </div>

              {/* Login Credentials */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Login Credentials</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="login_url">Login URL</Label>
                    <Input
                      id="login_url"
                      placeholder="https://example.com/wp-admin"
                      value={data.login_url}
                      onChange={(e) => setData('login_url', e.target.value)}
                    />
                    {errors.login_url && <p className="text-sm text-red-500">{errors.login_url}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login_username">Login Username</Label>
                    <Input
                      id="login_username"
                      placeholder="admin"
                      value={data.login_username}
                      onChange={(e) => setData('login_username', e.target.value)}
                    />
                    {errors.login_username && <p className="text-sm text-red-500">{errors.login_username}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login_password">Login Password</Label>
                    <Input
                      id="login_password"
                      type="password"
                      placeholder="••••••••"
                      value={data.login_password}
                      onChange={(e) => setData('login_password', e.target.value)}
                    />
                    {errors.login_password && <p className="text-sm text-red-500">{errors.login_password}</p>}
                  </div>
                </div>
              </div>

              {/* Contract Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Contract Information</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="contract_start_date">Contract Start Date</Label>
                    <Input
                      id="contract_start_date"
                      type="date"
                      value={data.contract_start_date as string}
                      onChange={(e) => setData('contract_start_date', e.target.value)}
                    />
                    {errors.contract_start_date && <p className="text-sm text-red-500">{errors.contract_start_date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_end_date">Contract End Date</Label>
                    <Input
                      id="contract_end_date"
                      type="date"
                      value={data.contract_end_date as string}
                      onChange={(e) => setData('contract_end_date', e.target.value)}
                    />
                    {errors.contract_end_date && <p className="text-sm text-red-500">{errors.contract_end_date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_capacity">Contract Capacity</Label>
                    <Input
                      id="contract_capacity"
                      placeholder="e.g., 10 hours/month"
                      value={data.contract_capacity}
                      onChange={(e) => setData('contract_capacity', e.target.value)}
                    />
                    {errors.contract_capacity && <p className="text-sm text-red-500">{errors.contract_capacity}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_storage_limit">Storage Limit</Label>
                    <Input
                      id="contract_storage_limit"
                      placeholder="e.g., 10GB"
                      value={data.contract_storage_limit}
                      onChange={(e) => setData('contract_storage_limit', e.target.value)}
                    />
                    {errors.contract_storage_limit && <p className="text-sm text-red-500">{errors.contract_storage_limit}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contract_storage_usage">Current Storage Usage</Label>
                    <Input
                      id="contract_storage_usage"
                      placeholder="e.g., 5GB"
                      value={data.contract_storage_usage}
                      onChange={(e) => setData('contract_storage_usage', e.target.value)}
                    />
                    {errors.contract_storage_usage && <p className="text-sm text-red-500">{errors.contract_storage_usage}</p>}
                  </div>
                </div>
              </div>

              {/* API Keys */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Keys</h3>
                <div className="space-y-2">
                  <Label htmlFor="api_keys">API Keys (JSON format)</Label>
                  <textarea
                    id="api_keys"
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-20 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder='{"api_key": "your-key", "api_secret": "your-secret"}'
                    value={data.api_keys}
                    onChange={(e) => setData('api_keys', e.target.value)}
                  />
                  {errors.api_keys && <p className="text-sm text-red-500">{errors.api_keys}</p>}
                  <p className="text-muted-foreground text-sm">Enter API keys in JSON format</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  Save Credentials
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SiteLayout>
    </AppLayout>
  );
}
