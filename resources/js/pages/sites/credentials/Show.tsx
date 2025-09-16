import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Check, Copy, Pencil } from 'lucide-react';
import { useState } from 'react';

interface ShowSiteCredentialsProps {
  site: Site;
  credentials: SiteCredential;
}

export default function ShowSiteCredentials({ site, credentials }: ShowSiteCredentialsProps) {
  const [copiedFields, setCopiedFields] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const copyToClipboard = (text: string | null, fieldName: string) => {
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
      href: `/sites/${site.id}/credentials`,
    },
  ];

  // Helper component for displaying field with copy button
  const FieldWithCopy = ({ label, value, id, isPassword = false }: { label: string; value: string | null; id: string; isPassword?: boolean }) => (
    <div className="space-y-1">
      <label className="text-foreground mb-1 block text-sm font-semibold">{label}</label>
      <div className="border-input bg-background flex w-full max-w-md items-center rounded-md border">
        <div className="text-foreground flex-1 truncate px-3 py-2 text-sm">
          {isPassword && value ? '••••••••' : value || <span className="text-muted-foreground italic">Not set</span>}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="border-input rounded-l-none border-l"
          onClick={() => copyToClipboard(value, id)}
          disabled={!value}
          aria-label={`Copy ${label}`}
        >
          {copiedFields[id] ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Credentials: ${site.name}`} />
      <SiteLayout siteId={site.id} siteName={site.name}>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Site Credentials</h1>
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link href={route('sites.credentials.edit', site.id)}>
              <Pencil className="h-4 w-4" />
              Edit Credentials
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          {/* FTP Credentials */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">FTP Credentials</CardTitle>
              <CardDescription>FTP access details for this site</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldWithCopy label="FTP Host" value={credentials.ftp_host} id="ftp_host" />
              <FieldWithCopy label="FTP Username" value={credentials.ftp_username} id="ftp_username" />
              <FieldWithCopy label="FTP Password" value={credentials.ftp_password} id="ftp_password" isPassword />
            </CardContent>
          </Card>

          {/* Database Credentials */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Database Credentials</CardTitle>
              <CardDescription>Database access details for this site</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldWithCopy label="Database Host" value={credentials.db_host} id="db_host" />
              <FieldWithCopy label="Database Name" value={credentials.db_name} id="db_name" />
              <FieldWithCopy label="Database Username" value={credentials.db_username} id="db_username" />
              <FieldWithCopy label="Database Password" value={credentials.db_password} id="db_password" isPassword />
            </CardContent>
          </Card>

          {/* Login Credentials */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Login Credentials</CardTitle>
              <CardDescription>CMS login details for this site</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldWithCopy label="Login URL" value={credentials.login_url} id="login_url" />
              <FieldWithCopy label="Login Username" value={credentials.login_username} id="login_username" />
              <FieldWithCopy label="Login Password" value={credentials.login_password} id="login_password" isPassword />
            </CardContent>
          </Card>

          {/* Contract Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Contract Information</CardTitle>
              <CardDescription>Contract details for this site</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FieldWithCopy
                label="Contract Start Date"
                value={credentials.contract_start_date ? new Date(credentials.contract_start_date).toLocaleDateString() : null}
                id="contract_start_date"
              />
              <FieldWithCopy
                label="Contract End Date"
                value={credentials.contract_end_date ? new Date(credentials.contract_end_date).toLocaleDateString() : null}
                id="contract_end_date"
              />
              <FieldWithCopy label="Contract Capacity" value={credentials.contract_capacity} id="contract_capacity" />
              <FieldWithCopy label="Storage Limit" value={credentials.contract_storage_limit} id="contract_storage_limit" />
              <FieldWithCopy label="Current Storage Usage" value={credentials.contract_storage_usage} id="contract_storage_usage" />
            </CardContent>
          </Card>

          {/* API Keys */}
          {/* <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>API access details for this site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm font-medium">API Keys (JSON format)</p>
                <div className="flex">
                  <pre className="bg-muted flex-grow overflow-x-auto rounded-l-md px-3 py-2">
                    {credentials.api_keys || <span className="text-muted-foreground italic">Not set</span>}
                  </pre>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-auto rounded-l-none"
                    onClick={() => copyToClipboard(credentials.api_keys, 'api_keys')}
                    disabled={!credentials.api_keys}
                  >
                    {copiedFields['api_keys'] ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
      </SiteLayout>
    </AppLayout>
  );
}
