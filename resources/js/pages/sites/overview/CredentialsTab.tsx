import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { Copy, Database, Eye, EyeOff, Key, Server, Shield } from 'lucide-react';

interface CredentialsTabProps {
  site: Site;
  showPasswords: { [key: string]: boolean };
  togglePasswordVisibility: (field: string) => void;
  copyToClipboard: (text: string) => void;
}

export function CredentialsTab({ site, showPasswords, togglePasswordVisibility, copyToClipboard }: CredentialsTabProps) {
  if (!site.credential) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No credentials found</h3>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">No credentials have been added for this site yet.</p>
          <Button asChild>
            <Link href={`/sites/${site.id}/credentials/create`}>Add Credentials</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* FTP Credentials */}
      {(site.credential.ftp_host || site.credential.ftp_username) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              FTP Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {site.credential.ftp_host && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.ftp_host}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_host!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.ftp_username && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Username:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.ftp_username}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_username!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.ftp_password && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{showPasswords.ftp_password ? site.credential.ftp_password : '••••••••'}</span>
                  <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('ftp_password')}>
                    {showPasswords.ftp_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.ftp_password!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Database Credentials */}
      {(site.credential.db_host || site.credential.db_name) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {site.credential.db_host && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Host:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.db_host}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_host!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.db_name && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.db_name}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_name!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.db_username && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Username:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.db_username}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_username!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.db_password && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{showPasswords.db_password ? site.credential.db_password : '••••••••'}</span>
                  <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('db_password')}>
                    {showPasswords.db_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.db_password!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Login Credentials */}
      {(site.credential.login_url || site.credential.login_username) && (
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Login Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {site.credential.login_url && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Login URL:</span>
                <div className="flex items-center gap-2">
                  <a
                    href={site.credential.login_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {site.credential.login_url}
                  </a>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_url!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.login_username && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Username:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{site.credential.login_username}</span>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_username!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            {site.credential.login_password && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Password:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{showPasswords.login_password ? site.credential.login_password : '••••••••'}</span>
                  <Button size="sm" variant="ghost" onClick={() => togglePasswordVisibility('login_password')}>
                    {showPasswords.login_password ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.credential!.login_password!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
