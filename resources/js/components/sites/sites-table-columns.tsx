import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpDown, ChevronDown, ChevronUp, Copy, ExternalLink, Pencil, RefreshCw } from 'lucide-react';
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

  return [
    {
      accessorKey: 'name',
      header: () => <SortableHeader field="name">Site</SortableHeader>,
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        const url = row.original.url as string;
        return (
          <div className="flex flex-col">
            <span className="text-lg font-medium">{name}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-400 underline hover:underline">
              {url}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
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
