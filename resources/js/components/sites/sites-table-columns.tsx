import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, formatStorage, getContractStatus, getMonthsLeft, getProgressColor, getStoragePercentage } from '@/lib/utils';
import { type Site, type SitePageSpeedInsight } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  Gauge,
  HardDrive,
  LockKeyhole,
  Monitor,
  Pencil,
  RefreshCw,
  Server,
  Smartphone,
} from 'lucide-react';
import { SiteTypeBadge } from './site-badges';
interface SitesTableColumnsProps {
  sorting: {
    field: string;
    direction: string;
  };
  onSort: (field: string) => void;
  onShowCredentials: (site: Site) => void;
  onSync: (site: Site) => void;
}

export function createSitesTableColumns({ sorting, onSort, onShowCredentials, onSync }: SitesTableColumnsProps): ColumnDef<Site>[] {
  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button variant="ghost" onClick={() => onSort(field)} className="flex items-center">
      {children}
      {sorting.field === field ? (
        sorting.direction === 'asc' ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );

  return [
    {
      accessorKey: 'name',

      header: () => <SortableHeader field="name">Site</SortableHeader>,
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        const url = row.original.url as string;
        const team = row.original.team as string;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="flex items-center gap-2 font-semibold">
                {name}
                <Badge variant="outline" className="text-xs">
                  {team}
                </Badge>
              </span>
              <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-gray-400 underline hover:underline">
                {url}
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        );
      },
    },

    {
      id: 'server_info',
      header: () => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4" />
          Server
        </div>
      ),
      cell: ({ row }) => {
        const serverInfo = row.original.server_info;

        if (!serverInfo) {
          return <div className="text-muted-foreground text-sm">N/A</div>;
        }

        return (
          <div className="flex flex-col">
            {/* Server Details */}
            {(serverInfo.server_ip || serverInfo.server_hostname) && (
              <div className="flex flex-col gap-1">
                {serverInfo.server_ip && <div className="font-mono text-xs">{serverInfo.server_ip}</div>}
                {serverInfo.server_hostname && (
                  <div className="text-muted-foreground max-w-[150px] truncate text-xs" title={serverInfo.server_hostname}>
                    {serverInfo.server_hostname}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },

    {
      id: 'php_info',
      header: () => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4" />
          PHP
        </div>
      ),
      cell: ({ row }) => {
        const serverInfo = row.original.server_info;

        if (!serverInfo) {
          return <div className="text-muted-foreground text-sm">N/A</div>;
        }

        return (
          <div className="flex flex-col">
            {/* PHP Info */}
            {(serverInfo.php_version || serverInfo.php_memory_limit) && (
              <div className="mb-1 flex flex-col gap-1">
                <div className="font-mono text-xs font-medium">{serverInfo.php_version || 'Unknown'}</div>
              </div>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: 'type',

      header: () => <SortableHeader field="type">Type</SortableHeader>,

      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <SiteTypeBadge type={type} />;
      },
    },
    {
      id: 'pagespeed',
      header: () => (
        <div className="flex items-center">
          <Gauge className="mr-2 h-4 w-4" />
          PageSpeed
        </div>
      ),
      cell: ({ row }) => {
        const pageSpeedInsights = row.original.page_speed_insights as SitePageSpeedInsight[] | undefined;
        const mobileInsight = pageSpeedInsights?.find((insight) => insight.strategy === 'mobile');
        const desktopInsight = pageSpeedInsights?.find((insight) => insight.strategy === 'desktop');

        if (!desktopInsight || !desktopInsight.performance_score) {
          return <div className="text-muted-foreground text-sm">N/A</div>;
        }

        if (!mobileInsight || !mobileInsight.performance_score) {
          return <div className="text-muted-foreground text-sm">N/A</div>;
        }

        const score_mobile = parseFloat(mobileInsight.performance_score) * 100;
        const score_desktop = parseFloat(desktopInsight.performance_score) * 100;
        const getScoreColor = (score: number) => {
          if (score >= 90) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800';
          if (score >= 50) return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900 border-orange-200 dark:border-orange-800';
          return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800';
        };

        return (
          <div className="flex items-center gap-2">
            <Badge className={`px-3 py-1 ${getScoreColor(score_mobile)} hover:bg-inherit`}>
              <div className="flex items-center gap-1">
                <div className={`font-bold`}>{Math.round(score_mobile)}</div>
                <Smartphone className="size-4" />
              </div>
            </Badge>
            <Badge className={`px-3 py-1 ${getScoreColor(score_desktop)} hover:bg-inherit`}>
              <div className="flex items-center gap-1">
                <div className={`font-bold`}>{Math.round(score_desktop)}</div>
                <Monitor className="size-4" />
              </div>
            </Badge>
          </div>
        );
      },
    },
    {
      id: 'storage_usage',
      header: () => (
        <div className="flex items-center">
          <HardDrive className="mr-2 h-4 w-4" />
          Contract
        </div>
      ),
      cell: ({ row }) => {
        const contract = row.original.contract;
        const usage = contract?.contract_storage_usage ?? null;
        const limit = contract?.contract_storage_limit ?? null;
        const percentage = getStoragePercentage(usage, limit);
        const startDate = contract?.contract_start_date ?? null;
        const endDate = contract?.contract_end_date ?? null;
        const { status, color } = getContractStatus(startDate, endDate);
        const monthsLeft = getMonthsLeft(endDate);

        if (!usage && !limit) {
          return <div className="text-muted-foreground w-[120px] text-sm">N/A</div>;
        }

        return (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${color}`} />
                <span className="capitalize">{status}</span>
              </div>
              {formatStorage(usage, limit)}
              <div className="text-muted-foreground text-xs">
                {monthsLeft !== null && <div>{monthsLeft === 0 ? 'Expired' : `${monthsLeft}`}</div>}
              </div>
            </div>
            {limit && (
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Progress value={percentage} className="h-2" />
                  <div
                    className={cn('absolute inset-0 h-2 rounded-full transition-all', getProgressColor(percentage))}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <span className="text-muted-foreground min-w-[30px] text-xs">{percentage}%</span>
              </div>
            )}
          </div>
        );
      },
    },

    // {
    //   accessorKey: 'clients',

    //   header: () => 'Clients',

    //   cell: ({ row }) => {
    //     const users = row.original.users as Array<{ id: number; name: string; email: string }> | null;

    //     if (!users || users.length === 0) {
    //       return <div className="text-muted-foreground text-sm">No clients</div>;
    //     }

    //     return (
    //       <div className="text-sm">
    //         <div className="text-muted-foreground text-xs">
    //           <div className="flex -space-x-2">
    //             {users.slice(0, 3).map((user) => (
    //               <TooltipProvider key={user.id}>
    //                 <Tooltip>
    //                   <TooltipTrigger>
    //                     <Avatar className="border-background border-2">
    //                       <AvatarFallback>
    //                         {user.name.charAt(0).toUpperCase()}
    //                         {user.name.slice(1).split(' ').length > 1 ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
    //                       </AvatarFallback>
    //                     </Avatar>
    //                   </TooltipTrigger>
    //                   <TooltipContent>
    //                     <p>{user.name}</p>
    //                     <p className="text-muted-foreground text-xs">{user.email}</p>
    //                   </TooltipContent>
    //                 </Tooltip>
    //               </TooltipProvider>
    //             ))}
    //           </div>
    //           {users.length > 3 && (
    //             <div className="border-background bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
    //               +{users.length - 3}
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    {
      id: 'actions',
      size: 50,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const site = row.original;
        return (
          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  className="hover:bg-muted-foreground/10 cursor-pointer rounded p-2"
                  onClick={() => onSync(site)}
                  disabled={!site.sync_enabled}
                >
                  <RefreshCw className={`size-4 ${site.sync_enabled ? '' : 'text-muted-foreground'}`} />
                  <span className="sr-only">Sync</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{site.sync_enabled ? 'Sync site data' : 'Sync not enabled'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="hover:bg-muted-foreground/10 cursor-pointer rounded p-2" onClick={() => onShowCredentials(site)}>
                  <LockKeyhole className="size-4" />
                  <span className="sr-only">Show credentials</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="hover:bg-muted-foreground/10 cursor-pointer rounded p-2">
                  <Link href={route('sites.edit', { site: site.id })}>
                    <Pencil className="size-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="hover:bg-muted-foreground/10 rounded p-2">
                  <Link href={route('sites.show', { site: site.id })}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];
}
