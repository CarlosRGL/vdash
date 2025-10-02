import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface InputWithCopyProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCopy: () => void;
  copied: boolean;
  type?: string;
  placeholder?: string;
  error?: string | null;
}

function InputWithCopy({ id, label, value, onChange, onCopy, copied, type = 'text', placeholder = '', error = null }: InputWithCopyProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-1">
        <Input id={id} type={inputType} placeholder={placeholder} value={value} onChange={onChange} className="flex-1" />
        <div className="flex gap-1">
          {isPassword && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 flex-shrink-0"
            onClick={onCopy}
            disabled={!value}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
          >
            {copied ? <Check className="h-4 w-4 text-green-600 dark:text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
    </div>
  );
}

interface EditSiteCredentialsProps {
  site: Site;
  credentials: SiteCredential;
}

export default function EditSiteCredentials({ site, credentials }: EditSiteCredentialsProps) {
  const [copy, isCopied] = useCopyToClipboard();
  const { toast } = useToast();

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

  // Initialize form with data from credentials
  const { setData, data, put, processing, errors } = useForm({
    ftp_host: credentials?.ftp_host || '',
    ftp_username: credentials?.ftp_username || '',
    ftp_password: credentials?.ftp_password || '',
    db_host: credentials?.db_host || '',
    db_name: credentials?.db_name || '',
    db_username: credentials?.db_username || '',
    db_password: credentials?.db_password || '',
    login_url: credentials?.login_url || '',
    login_username: credentials?.login_username || '',
    login_password: credentials?.login_password || '',
    api_keys: credentials?.api_keys || '',
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
            <CardTitle className="text-lg">Site Credentials</CardTitle>
            <CardDescription>Manage access credentials for this site</CardDescription>
          </CardHeader>
          <CardContent>
            <form id="credentials" name="credentials" onSubmit={handleSubmit} className="space-y-8">
              {/* FTP Credentials */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">FTP Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="ftp_host"
                    label="FTP Host"
                    placeholder="ftp.example.com"
                    value={data.ftp_host}
                    onChange={(e) => setData('ftp_host', e.target.value)}
                    onCopy={() => copy(data.ftp_host).then(() => toast.success('FTP Host copied to clipboard'))}
                    copied={isCopied}
                    error={errors.ftp_host}
                  />
                  <InputWithCopy
                    id="ftp_username"
                    label="FTP Username"
                    placeholder="username"
                    value={data.ftp_username}
                    onChange={(e) => setData('ftp_username', e.target.value)}
                    onCopy={() => copy(data.ftp_username).then(() => toast.success('FTP Username copied to clipboard'))}
                    copied={isCopied}
                    error={errors.ftp_username}
                  />
                  <InputWithCopy
                    id="ftp_password"
                    label="FTP Password"
                    type="password"
                    value={data.ftp_password}
                    onChange={(e) => setData('ftp_password', e.target.value)}
                    onCopy={() => copy(data.ftp_password).then(() => toast.success('FTP Password copied to clipboard'))}
                    copied={isCopied}
                    error={errors.ftp_password}
                  />
                </div>
              </div>

              {/* Database Credentials */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Database Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="db_host"
                    label="Database Host"
                    placeholder="localhost"
                    value={data.db_host}
                    onChange={(e) => setData('db_host', e.target.value)}
                    onCopy={() => copy(data.db_host).then(() => toast.success('Database Host copied to clipboard'))}
                    copied={isCopied}
                    error={errors.db_host}
                  />
                  <InputWithCopy
                    id="db_name"
                    label="Database Name"
                    placeholder="database_name"
                    value={data.db_name}
                    onChange={(e) => setData('db_name', e.target.value)}
                    onCopy={() => copy(data.db_name).then(() => toast.success('Database Name copied to clipboard'))}
                    copied={isCopied}
                    error={errors.db_name}
                  />
                  <InputWithCopy
                    id="db_username"
                    label="Database Username"
                    placeholder="db_user"
                    value={data.db_username}
                    onChange={(e) => setData('db_username', e.target.value)}
                    onCopy={() => copy(data.db_username).then(() => toast.success('Database Username copied to clipboard'))}
                    copied={isCopied}
                    error={errors.db_username}
                  />
                  <InputWithCopy
                    id="db_password"
                    label="Database Password"
                    type="password"
                    value={data.db_password}
                    onChange={(e) => setData('db_password', e.target.value)}
                    onCopy={() => copy(data.db_password).then(() => toast.success('Database Password copied to clipboard'))}
                    copied={isCopied}
                    error={errors.db_password}
                  />
                </div>
              </div>

              {/* Login Credentials */}
              <div className="space-y-4">
                <h3 className="text-base font-semibold">Login Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="login_url"
                    label="Login URL"
                    placeholder="https://example.com/wp-admin"
                    value={data.login_url}
                    onChange={(e) => setData('login_url', e.target.value)}
                    onCopy={() => copy(data.login_url).then(() => toast.success('Login URL copied to clipboard'))}
                    copied={isCopied}
                    error={errors.login_url}
                  />
                  <InputWithCopy
                    id="login_username"
                    label="Login Username"
                    placeholder="admin"
                    value={data.login_username}
                    onChange={(e) => setData('login_username', e.target.value)}
                    onCopy={() => copy(data.login_username).then(() => toast.success('Login Username copied to clipboard'))}
                    copied={isCopied}
                    error={errors.login_username}
                  />
                  <InputWithCopy
                    id="login_password"
                    label="Login Password"
                    type="password"
                    value={data.login_password}
                    onChange={(e) => setData('login_password', e.target.value)}
                    onCopy={() => copy(data.login_password).then(() => toast.success('Login Password copied to clipboard'))}
                    copied={isCopied}
                    error={errors.login_password}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Credentials'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </SiteLayout>
    </AppLayout>
  );
}
