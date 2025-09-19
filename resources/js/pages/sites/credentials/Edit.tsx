import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Check, Copy } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface EditSiteCredentialsProps {
  site: Site;
  credentials: SiteCredential;
}

export default function EditSiteCredentials({ site, credentials }: EditSiteCredentialsProps) {
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Format date string to YYYY-MM-DD for date input
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) return;

    // Fallback function for copying text
    const fallbackCopyTextToClipboard = (text: string) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Make the textarea out of viewport
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
      }

      document.body.removeChild(textArea);
      return success;
    };

    // Try to use the modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedFields({ ...copiedFields, [fieldName]: true });

          toast.success('Copied to clipboard', {
            description: `${fieldName} has been copied to clipboard.`,
          });

          setTimeout(() => {
            setCopiedFields({ ...copiedFields, [fieldName]: false });
          }, 2000);
        })
        .catch((err) => {
          console.error('Could not copy text: ', err);
        });
    } else {
      // Fallback for older browsers
      const success = fallbackCopyTextToClipboard(text);
      if (success) {
        setCopiedFields({ ...copiedFields, [fieldName]: true });

        toast.success('Copied to clipboard', {
          description: `${fieldName} has been copied to clipboard.`,
        });

        setTimeout(() => {
          setCopiedFields({ ...copiedFields, [fieldName]: false });
        }, 2000);
      } else {
        toast.error('Copy failed', {
          description: 'Please copy the text manually.',
        });
      }
    }
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
    contract_start_date: formatDateForInput(credentials?.contract_start_date),
    contract_end_date: formatDateForInput(credentials?.contract_end_date),
    contract_capacity: credentials?.contract_capacity || '',
    contract_storage_usage: credentials?.contract_storage_usage || '',
    contract_storage_limit: credentials?.contract_storage_limit || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    put(route('sites.credentials.update', site.id));
  };

  // Helper component for input fields with copy button
  const InputWithCopy = ({
    id,
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    error = null,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    placeholder?: string;
    error?: string | null;
  }) => (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex">
        <Input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange} className="rounded-r-none" />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-l-none border-l-0"
          onClick={() => copyToClipboard(value, id)}
          disabled={!value}
        >
          {copiedFields[id] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

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
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* FTP Credentials */}
              <div className="space-y-4">
                <h3 className="">FTP Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="ftp_host"
                    label="FTP Host"
                    placeholder="ftp.example.com"
                    value={data.ftp_host}
                    onChange={(e) => setData('ftp_host', e.target.value)}
                    error={errors.ftp_host}
                  />
                  <InputWithCopy
                    id="ftp_username"
                    label="FTP Username"
                    placeholder="username"
                    value={data.ftp_username}
                    onChange={(e) => setData('ftp_username', e.target.value)}
                    error={errors.ftp_username}
                  />
                  <InputWithCopy
                    id="ftp_password"
                    label="FTP Password"
                    type="password"
                    placeholder="••••••••"
                    value={data.ftp_password}
                    onChange={(e) => setData('ftp_password', e.target.value)}
                    error={errors.ftp_password}
                  />
                </div>
              </div>

              {/* Database Credentials */}
              <div className="space-y-4">
                <h3 className="">Database Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="db_host"
                    label="Database Host"
                    placeholder="localhost"
                    value={data.db_host}
                    onChange={(e) => setData('db_host', e.target.value)}
                    error={errors.db_host}
                  />
                  <InputWithCopy
                    id="db_name"
                    label="Database Name"
                    placeholder="database_name"
                    value={data.db_name}
                    onChange={(e) => setData('db_name', e.target.value)}
                    error={errors.db_name}
                  />
                  <InputWithCopy
                    id="db_username"
                    label="Database Username"
                    placeholder="db_user"
                    value={data.db_username}
                    onChange={(e) => setData('db_username', e.target.value)}
                    error={errors.db_username}
                  />
                  <InputWithCopy
                    id="db_password"
                    label="Database Password"
                    type="password"
                    placeholder="••••••••"
                    value={data.db_password}
                    onChange={(e) => setData('db_password', e.target.value)}
                    error={errors.db_password}
                  />
                </div>
              </div>

              {/* Login Credentials */}
              <div className="space-y-4">
                <h3 className="">Login Credentials</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <InputWithCopy
                    id="login_url"
                    label="Login URL"
                    placeholder="https://example.com/wp-admin"
                    value={data.login_url}
                    onChange={(e) => setData('login_url', e.target.value)}
                    error={errors.login_url}
                  />
                  <InputWithCopy
                    id="login_username"
                    label="Login Username"
                    placeholder="admin"
                    value={data.login_username}
                    onChange={(e) => setData('login_username', e.target.value)}
                    error={errors.login_username}
                  />
                  <InputWithCopy
                    id="login_password"
                    label="Login Password"
                    type="password"
                    placeholder="••••••••"
                    value={data.login_password}
                    onChange={(e) => setData('login_password', e.target.value)}
                    error={errors.login_password}
                  />
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
