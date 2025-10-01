import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useToast } from '@/hooks/use-toast';
import { getMonthsLeft } from '@/lib/utils';
import { type Site } from '@/types';
import { Copy, Globe, HardDrive, RefreshCw, Server } from 'lucide-react';
import { SyncButton } from './SyncButton';

interface OverviewTabProps {
  site: Site;

  formatDate: (dateString: string) => string;
  getStoragePercentage: () => number;
}

export function OverviewTab({ site, formatDate, getStoragePercentage }: OverviewTabProps) {
  const { toast } = useToast();
  const [copy] = useCopyToClipboard();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Site URL</CardTitle>
            <Globe className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {site.url ? (
                <a href={site.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                  {site.url}
                </a>
              ) : (
                <span className="text-gray-500">Not set</span>
              )}
              {/* add site type and wp version */}
              <div className="flex flex-col gap-1 text-sm text-gray-500">
                {site.type} {site.wordpress_version}
              </div>
              {site.server_info?.server_ip && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{site.server_info.server_ip}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copy(site.server_info!.server_ip!).then(() => toast.success(`server IP copied to clipboard`))}
                    >
                      <Copy className="size-2" />
                    </Button>
                  </div>
                </div>
              )}
              {site.server_info?.server_hostname && (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{site.server_info.server_hostname}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copy(site.server_info!.server_hostname!).then(() => toast.success(`server hostname copied to clipboard`))}
                    >
                      <Copy className="size-2" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* PHP Version Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Server Info</CardTitle>
            <Server className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mb-4 text-lg font-bold">
              {site.server_info?.php_version ? (
                <Badge variant="secondary" className="text-sm">
                  PHP {site.server_info?.php_version}
                </Badge>
              ) : (
                <span className="text-gray-500">Unknown</span>
              )}
            </div>
            {site.server_info?.php_memory_limit && (
              <div className="flex justify-between font-mono">
                <span className="text-sm font-medium">Memory Limit:</span>
                <span className="text-sm">{site.server_info?.php_memory_limit}</span>
              </div>
            )}
            {site.server_info?.php_max_execution_time && (
              <div className="flex justify-between font-mono">
                <span className="text-sm font-medium">Max Execution Time:</span>
                <span className="text-sm">{site.server_info?.php_max_execution_time}s</span>
              </div>
            )}
            {site.server_info?.php_post_max_size && (
              <div className="flex justify-between font-mono">
                <span className="text-sm font-medium">Post Max Size:</span>
                <span className="text-sm">{site.server_info?.php_post_max_size}</span>
              </div>
            )}
            {site.server_info?.php_upload_max_filesize && (
              <div className="flex justify-between font-mono">
                <span className="text-sm font-medium">Upload Max Filesize:</span>
                <span className="text-sm">{site.server_info?.php_upload_max_filesize}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Storage Usage Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base font-semibold">Contract Overview</CardTitle>
            <HardDrive className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="mb-5 text-lg font-bold">
              {site.contract?.contract_storage_usage && site.contract?.contract_storage_limit ? (
                <div className="space-y-2">
                  <span>{getStoragePercentage().toFixed(1)}%</span>
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full ${
                        getStoragePercentage() > 90 ? 'bg-red-500' : getStoragePercentage() > 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {site.contract.contract_storage_usage}GB / {site.contract.contract_storage_limit}GB
                  </p>
                </div>
              ) : (
                <span className="text-gray-500">Not available</span>
              )}
            </div>
            <div className="mb-5 text-sm">
              <span className="font-medium">From</span> {site.contract?.contract_start_date ? formatDate(site.contract.contract_start_date) : 'N/A'}{' '}
              to {site.contract?.contract_end_date ? formatDate(site.contract.contract_end_date) : 'N/A'}
            </div>
            <div className="">
              {site.contract?.contract_end_date && <div className="text-sm">{getMonthsLeft(site.contract.contract_end_date)} left</div>}
            </div>
          </CardContent>
        </Card>

        {/* API Sync Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Sync</CardTitle>
            <RefreshCw className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-lg font-bold">
                {site.sync_enabled ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Enabled
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Disabled
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">{site.api_token ? 'API token configured' : 'No API token set'}</div>
              <div className="text-sm text-gray-500">
                {' '}
                {site.last_sync ? (
                  <span className="font-mono text-xs text-gray-500">
                    Last Sync: {formatDate(site.last_sync, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                ) : (
                  <span className="text-gray-500">No syncs yet</span>
                )}
              </div>
              {site.sync_enabled && (
                <div className="pt-2">
                  <SyncButton site={site} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
