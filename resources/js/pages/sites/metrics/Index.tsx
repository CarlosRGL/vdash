import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteMetric } from '@/types';
import { Head, router } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';

interface SiteMetricsProps {
  site: Site;
  metrics: SiteMetric[];
}

export default function SiteMetrics({ site, metrics }: SiteMetricsProps) {
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
      title: 'Metrics',
      href: `/sites/${site.id}/metrics`,
    },
  ];

  const refreshMetrics = () => {
    router.post(route('sites.metrics.refresh', site.id));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Metrics: ${site.name}`} />
      <SiteLayout siteId={site.id} siteName={site.name}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Site Metrics</CardTitle>
              <CardDescription>Performance and configuration metrics for this site</CardDescription>
            </div>
            <Button onClick={refreshMetrics} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Metrics
            </Button>
          </CardHeader>
          <CardContent>
            {metrics.length > 0 ? (
              <div className="space-y-8">
                {/* Latest Metrics Summary */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Latest Metrics</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">PHP Version</div>
                        <div className="text-2xl font-bold">{metrics[0].php_version || 'N/A'}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">Lighthouse Score</div>
                        <div className="text-2xl font-bold">{metrics[0].lighthouse_score || 'N/A'}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-muted-foreground text-sm">Last Check</div>
                        <div className="text-2xl font-bold">{formatDate(metrics[0].last_check)}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* PHP Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">PHP Configuration</h3>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                        <div>
                          <div className="text-muted-foreground text-sm">Memory Limit</div>
                          <div className="text-lg font-medium">{metrics[0].memory_limit || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm">Max Execution Time</div>
                          <div className="text-lg font-medium">{metrics[0].max_execution_time || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm">Post Max Size</div>
                          <div className="text-lg font-medium">{metrics[0].post_max_size || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm">Upload Max Filesize</div>
                          <div className="text-lg font-medium">{metrics[0].upload_max_filesize || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm">Max Input Vars</div>
                          <div className="text-lg font-medium">{metrics[0].max_input_vars || 'N/A'}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground text-sm">Server IP</div>
                          <div className="text-lg font-medium">{metrics[0].server_ip || 'N/A'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Metrics History */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Metrics History</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>PHP Version</TableHead>
                          <TableHead>Memory Limit</TableHead>
                          <TableHead>Lighthouse Score</TableHead>
                          <TableHead>Server IP</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {metrics.map((metric) => (
                          <TableRow key={metric.id}>
                            <TableCell>{formatDate(metric.created_at)}</TableCell>
                            <TableCell>{metric.php_version || 'N/A'}</TableCell>
                            <TableCell>{metric.memory_limit || 'N/A'}</TableCell>
                            <TableCell>{metric.lighthouse_score || 'N/A'}</TableCell>
                            <TableCell>{metric.server_ip || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4 text-lg">No metrics data available for this site.</p>
                <Button onClick={refreshMetrics} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Collect Metrics
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </SiteLayout>
    </AppLayout>
  );
}
