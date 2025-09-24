import { AlertTriangle, HardDrive, TrendingUp } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface StorageUsageData {
  site_name: string;
  site_id: number;
  storage_usage: string;
  storage_limit: string;
  usage_gb: number;
  limit_gb: number;
  usage_percentage: number;
  is_critical: boolean;
  is_warning: boolean;
}

interface StorageUsageProps {
  storageUsage: StorageUsageData[];
}

export default function StorageUsage({ storageUsage }: StorageUsageProps) {
  const criticalSites = storageUsage.filter((site) => site.is_critical);
  const warningSites = storageUsage.filter((site) => site.is_warning);
  const totalSites = storageUsage.length;

  if (totalSites === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>Sites with highest storage capacity usage</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-2 text-2xl">📊</div>
            <p className="text-muted-foreground text-sm">No storage data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 75) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getVariant = (site: StorageUsageData) => {
    if (site.is_critical) return 'destructive';
    if (site.is_warning) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Usage
          {criticalSites.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {criticalSites.length} critical
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {totalSites} site{totalSites === 1 ? '' : 's'} • {criticalSites.length + warningSites.length} need attention
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-64">
          <div className="space-y-4 px-4">
            {storageUsage.slice(0, 8).map((site) => (
              <div
                key={site.site_id}
                className={cn(
                  'rounded-lg border p-3 transition-colors',
                  site.is_critical
                    ? 'border-destructive/20 bg-destructive/5'
                    : site.is_warning
                      ? 'border-orange-200 bg-orange-50 dark:border-orange-900/20 dark:bg-orange-950/10'
                      : 'border-border bg-muted/30',
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {site.is_critical && <AlertTriangle className="text-destructive h-4 w-4 flex-shrink-0" />}
                    <span className="truncate text-sm font-medium">{site.site_name}</span>
                  </div>
                  <Badge variant={getVariant(site)} className="ml-2 flex-shrink-0">
                    {site.usage_percentage}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="text-muted-foreground flex justify-between text-xs">
                    <span>{site.storage_usage} used</span>
                    <span>{site.storage_limit} total</span>
                  </div>
                  <div className="relative">
                    <Progress value={site.usage_percentage} className="h-2" />
                    <div
                      className={cn('absolute inset-0 h-2 rounded-full transition-all', getProgressColor(site.usage_percentage))}
                      style={{ width: `${Math.min(site.usage_percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}

            {storageUsage.length > 8 && (
              <div className="border-t pt-2 text-center">
                <p className="text-muted-foreground text-xs">
                  +{storageUsage.length - 8} more site{storageUsage.length - 8 === 1 ? '' : 's'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {totalSites > 0 && (
          <div className="mt-4 border-t pt-3">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3" />
              <span>Highest usage: {storageUsage[0]?.usage_percentage}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
