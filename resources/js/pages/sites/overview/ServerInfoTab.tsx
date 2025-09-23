import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { Copy, Database, Monitor, Server } from 'lucide-react';

interface ServerInfoTabProps {
  site: Site;
  copyToClipboard: (text: string) => void;
}

export function ServerInfoTab({ site, copyToClipboard }: ServerInfoTabProps) {
  if (!site.server_info) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Server className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No server information found</h3>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">Server information has not been added for this site yet.</p>
          <Button asChild>
            <Link href={`/sites/${site.id}/server-info/create`}>Add Server Info</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            PHP Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {site.server_info.php_version && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">PHP Version:</span>
              <Badge variant="secondary">{site.server_info.php_version}</Badge>
            </div>
          )}
          {site.server_info.php_memory_limit && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Memory Limit:</span>
              <span className="text-sm">{site.server_info.php_memory_limit}</span>
            </div>
          )}
          {site.server_info.php_max_execution_time && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Max Execution Time:</span>
              <span className="text-sm">{site.server_info.php_max_execution_time}s</span>
            </div>
          )}
          {site.server_info.php_post_max_size && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Post Max Size:</span>
              <span className="text-sm">{site.server_info.php_post_max_size}</span>
            </div>
          )}
          {site.server_info.php_upload_max_filesize && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Upload Max Filesize:</span>
              <span className="text-sm">{site.server_info.php_upload_max_filesize}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {site.server_info.mysql_version && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">MySQL Version:</span>
              <Badge variant="secondary">{site.server_info.mysql_version}</Badge>
            </div>
          )}
          {site.server_info.mysql_server_info && (
            <div>
              <span className="text-sm font-medium">Server Info:</span>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{site.server_info.mysql_server_info}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Server Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {site.server_info.server_ip && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Server IP:</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-sm">{site.server_info.server_ip}</span>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.server_info!.server_ip!)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          {site.server_info.server_hostname && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hostname:</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-sm">{site.server_info.server_hostname}</span>
                <Button size="sm" variant="ghost" onClick={() => copyToClipboard(site.server_info!.server_hostname!)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
