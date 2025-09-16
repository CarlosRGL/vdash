import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';
import { ArrowUpDown, Calendar, ChevronDown, ChevronUp, Copy, HardDrive, Pencil, RefreshCw } from 'lucide-react';
import { SiteTeamBadge, SiteTypeBadge } from './site-badges';

interface SitesTableColumnsProps {
  sorting: {
    field: string;
    direction: string;
  };
  onSort: (field: string) => void;
  onSync: (site: Site) => void;
  onShowCredentials: (site: Site) => void;
}

export function createSitesTableColumns({ sorting, onSort, onSync, onShowCredentials }: SitesTableColumnsProps): ColumnDef<Site>[] {
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM dd, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  const formatStorage = (usage: string | null, limit: string | null) => {
    if (!usage && !limit) return 'N/A';
    if (!usage) return `0 / ${limit || 'N/A'}`;
    if (!limit) return usage;
    return `${usage} / ${limit}`;
  };

  const getContractStatus = (startDate: string | null, endDate: string | null) => {
    if (!startDate || !endDate) return { status: 'unknown', color: 'bg-gray-500' };

    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      const now = new Date();

      if (!isValid(start) || !isValid(end)) return { status: 'unknown', color: 'bg-gray-500' };

      if (now < start) return { status: 'upcoming', color: 'bg-blue-500' };
      if (now > end) return { status: 'expired', color: 'bg-red-500' };

      // Check if contract expires within 30 days
      const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry <= 30) return { status: 'expiring', color: 'bg-orange-500' };

      return { status: 'active', color: 'bg-green-500' };
    } catch {
      return { status: 'unknown', color: 'bg-gray-500' };
    }
  };

  return [
    {
      accessorKey: 'name',
      header: () => <SortableHeader field="name">Site</SortableHeader>,
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        const url = row.original.url as string;
        return (
          <div className="flex flex-col">
            <span className="">{name}</span>
            {/* <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-400 underline hover:underline">
              {url}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a> */}
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
      accessorKey: 'php_version',
      header: () => <SortableHeader field="php_version">PHP Version</SortableHeader>,
      cell: ({ row }) => {
        const phpVersion = row.original.php_version as string | null;
        return <div className="font-mono text-sm">{phpVersion || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'team',
      header: () => <SortableHeader field="team">Team</SortableHeader>,
      cell: ({ row }) => {
        const team = row.getValue('team') as string;
        return <SiteTeamBadge team={team} />;
      },
    },
    {
      id: 'contract_status',
      header: () => (
        <SortableHeader field="contract_end_date">
          <Calendar className="mr-2 h-4 w-4" />
          Contract Status
        </SortableHeader>
      ),
      cell: ({ row }) => {
        const credential = row.original.credential;
        const startDate = credential?.contract_start_date ?? null;
        const endDate = credential?.contract_end_date ?? null;
        const { status, color } = getContractStatus(startDate, endDate);

        if (status === 'unknown') {
          return <span className="text-muted-foreground text-sm">No contract</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-sm capitalize">{status}</span>
          </div>
        );
      },
    },
    {
      id: 'contract_dates',
      header: () => <SortableHeader field="contract_start_date">Contract Period</SortableHeader>,
      cell: ({ row }) => {
        const credential = row.original.credential;
        const startDate = credential?.contract_start_date ?? null;
        const endDate = credential?.contract_end_date ?? null;

        if (!startDate && !endDate) {
          return <span className="text-muted-foreground text-sm">N/A</span>;
        }

        return (
          <div className="text-sm">
            <div>{formatDate(startDate)}</div>
            {/* <div className="text-muted-foreground">to {formatDate(endDate)}</div> */}
          </div>
        );
      },
    },
    {
      id: 'contract_capacity',
      header: () => <div>Capacity</div>,
      cell: ({ row }) => {
        const credential = row.original.credential;
        const capacity = credential?.contract_capacity;

        return <div className="font-mono text-sm">{capacity || 'N/A'}</div>;
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
        const credential = row.original.credential;
        const usage = credential?.contract_storage_usage ?? null;
        const limit = credential?.contract_storage_limit ?? null;

        return <div className="font-mono text-sm">{formatStorage(usage, limit)}</div>;
      },
    },
    {
      accessorKey: 'last_check',
      header: () => <SortableHeader field="last_check">Last Check</SortableHeader>,
      cell: ({ row }) => {
        const lastCheck = row.original.last_check as string | null;
        return <div className="text-sm">{lastCheck ? formatDistanceToNow(new Date(lastCheck), { addSuffix: true }) : 'Never'}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const site = row.original;
        return (
          <div className="flex justify-end gap-2">
            <TooltipProvider>
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
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Button variant="ghost" size="icon" onClick={() => onShowCredentials(site)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Show credentials</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Show credentials</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('sites.edit', { site: site.id })}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
          </div>
        );
      },
    },
  ];
}
