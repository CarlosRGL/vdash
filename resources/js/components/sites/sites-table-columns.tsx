import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { isValid, parseISO } from 'date-fns';
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink, Eye, HardDrive, LockKeyhole, Pencil, Server } from 'lucide-react';
import { SiteTypeBadge } from './site-badges';
interface SitesTableColumnsProps {
  sorting: {
    field: string;
    direction: string;
  };
  onSort: (field: string) => void;
  onShowCredentials: (site: Site) => void;
}

export function createSitesTableColumns({ sorting, onSort, onShowCredentials }: SitesTableColumnsProps): ColumnDef<Site>[] {
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

  const getMonthsLeft = (endDate: string | null) => {
    if (!endDate) return null;

    try {
      const end = parseISO(endDate);
      const now = new Date();

      if (!isValid(end)) return null;

      if (end < now) return 0; // Contract already ended

      const monthsLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)); // Average days per month
      return monthsLeft;
    } catch {
      return null;
    }
  };

  const parseStorageValue = (value: string | null): number | null => {
    if (!value) return null;
    // Extract numeric value and convert to MB
    const match = value.match(/([0-9,.]+)\s*(GB|MB|KB|B)?/i);
    if (!match) return null;

    const num = parseFloat(match[1].replace(',', ''));
    const unit = match[2]?.toUpperCase() || 'MB';

    switch (unit) {
      case 'GB':
        return num * 1024;
      case 'MB':
        return num;
      case 'KB':
        return num / 1024;
      case 'B':
        return num / (1024 * 1024);
      default:
        return num;
    }
  };

  const formatStorage = (usage: string | null, limit: string | null) => {
    if (!usage && !limit) return 'N/A';
    if (!usage) return `0 / ${limit || 'N/A'}`;
    if (!limit) return usage;
    return `${usage} / ${limit}`;
  };

  const getStoragePercentage = (usage: string | null, limit: string | null): number => {
    const usageValue = parseStorageValue(usage);
    const limitValue = parseStorageValue(limit);

    if (!usageValue || !limitValue || limitValue === 0) return 0;
    return Math.min(Math.round((usageValue / limitValue) * 100), 100);
  };

  const getContractStatus = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return { status: 'unknown', color: 'bg-gray-400' };

    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const now = new Date();

      if (!isValid(start) || !isValid(end)) return { status: 'unknown', color: 'bg-gray-400' };

      if (now < start) return { status: 'upcoming', color: 'bg-blue-400' };
      if (now > end) return { status: 'expired', color: 'bg-red-400' };

      // Check if contract expires within 30 days
      const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-orange-400' };

      return { status: 'active', color: 'bg-green-400' };
    } catch {
      return { status: 'unknown', color: 'bg-gray-400' };
    }
  };

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
      id: 'storage_usage',

      header: () => (
        <div className="flex items-center">
          <HardDrive className="mr-2 h-4 w-4" />
          Storage
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
          <div className="flex max-w-[300px] min-w-[120px] flex-col gap-2">
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${color}`} />
                <span className="capitalize">{status}</span>
              </div>
              {formatStorage(usage, limit)}
              <div className="text-muted-foreground text-xs">
                {monthsLeft !== null && <div>{monthsLeft === 0 ? 'Expired' : `${monthsLeft} month${monthsLeft !== 1 ? 's' : ''} left`}</div>}
              </div>
            </div>
            {limit && (
              <div className="flex items-center gap-2">
                <Progress value={percentage} className="h-2 flex-1" />
                <span className="text-muted-foreground min-w-[30px] text-xs">{percentage}%</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: 'server_info',

      header: () => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4" />
          Server Info
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
                <div className="font-mono text-xs font-medium">PHP {serverInfo.php_version || 'Unknown'}</div>
              </div>
            )}

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
    // {
    //   id: 'credentials_status',
    //   header: () => (
    //     <div className="flex items-center">
    //       <LockKeyhole className="mr-2 h-4 w-4" />
    //       Credentials
    //     </div>
    //   ),
    //   cell: ({ row }) => {
    //     const credential = row.original.credential;

    //     if (!credential) {
    //       return <div className="text-muted-foreground text-sm">No credentials</div>;
    //     }

    //     const hasCredentials = {
    //       ftp: !!(credential.ftp_host && credential.ftp_username),
    //       db: !!(credential.db_host && credential.db_name),
    //       login: !!(credential.login_url && credential.login_username),
    //       api: !!credential.api_keys,
    //     };

    //     const credentialCount = Object.values(hasCredentials).filter(Boolean).length;
    //     const totalTypes = Object.keys(hasCredentials).length;

    //     return (
    //       <div className="flex flex-col gap-1">
    //         <div className="flex items-center gap-2">
    //           <span className="text-sm font-medium">
    //             {credentialCount}/{totalTypes} types
    //           </span>
    //         </div>
    //         <div className="flex gap-1">
    //           {hasCredentials.ftp && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">FTP</span>}
    //           {hasCredentials.db && <span className="rounded bg-green-100 px-1.5 py-0.5 text-xs text-green-800">DB</span>}
    //           {hasCredentials.login && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-800">Login</span>}
    //           {hasCredentials.api && <span className="rounded bg-orange-100 px-1.5 py-0.5 text-xs text-orange-800">API</span>}
    //         </div>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: 'ftp_status',
    //   header: () => 'FTP Access',
    //   cell: ({ row }) => {
    //     const credential = row.original.credential;
    //     const hasFtp = credential?.ftp_host && credential?.ftp_username;

    //     return (
    //       <div className="flex items-center gap-2">
    //         <div className={`h-2 w-2 rounded-full ${hasFtp ? 'bg-green-400' : 'bg-gray-300'}`} />
    //         <span className="text-sm">{hasFtp ? 'Available' : 'Not set'}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: 'db_status',
    //   header: () => 'Database Access',
    //   cell: ({ row }) => {
    //     const credential = row.original.credential;
    //     const hasDb = credential?.db_host && credential?.db_name;

    //     return (
    //       <div className="flex items-center gap-2">
    //         <div className={`h-2 w-2 rounded-full ${hasDb ? 'bg-green-400' : 'bg-gray-300'}`} />
    //         <span className="text-sm">{hasDb ? 'Available' : 'Not set'}</span>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   id: 'login_status',
    //   header: () => 'CMS Login',
    //   cell: ({ row }) => {
    //     const credential = row.original.credential;
    //     const hasLogin = credential?.login_url && credential?.login_username;

    //     return (
    //       <div className="flex items-center gap-2">
    //         <div className={`h-2 w-2 rounded-full ${hasLogin ? 'bg-green-400' : 'bg-gray-300'}`} />
    //         <span className="text-sm">{hasLogin ? 'Available' : 'Not set'}</span>
    //       </div>
    //     );
    //   },
    // },
    {
      accessorKey: 'type',

      header: () => <SortableHeader field="type">Type</SortableHeader>,

      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <SiteTypeBadge type={type} />;
      },
    },
    {
      accessorKey: 'clients',

      header: () => 'Clients',

      cell: ({ row }) => {
        const users = row.original.users as Array<{ id: number; name: string; email: string }> | null;

        if (!users || users.length === 0) {
          return <div className="text-muted-foreground text-sm">No clients</div>;
        }

        return (
          <div className="text-sm">
            <div className="text-muted-foreground text-xs">
              <div className="flex -space-x-2">
                {users.slice(0, 3).map((user) => (
                  <TooltipProvider key={user.id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <Avatar className="border-background border-2">
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                            {user.name.slice(1).split(' ').length > 1 ? user.name.split(' ')[1].charAt(0).toUpperCase() : ''}
                          </AvatarFallback>
                        </Avatar>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{user.name}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
              {users.length > 3 && (
                <div className="border-background bg-muted text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium">
                  +{users.length - 3}
                </div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      size: 50,
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const site = row.original;
        return (
          <div className="flex justify-end">
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={() => onSync(site)}>
                    <RefreshCw className="h-4 w-4" />
                    <span className="sr-only">Sync</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sync metrics</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={() => onShowCredentials(site)}>
                    <LockKeyhole className="h-4 w-4" />
                    <span className="sr-only">Show credentials</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={route('sites.edit', { site: site.id })}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={route('sites.show', { site: site.id })}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
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
