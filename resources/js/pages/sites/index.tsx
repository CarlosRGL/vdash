import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronUp, ExternalLink, Pencil, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Sites',
    href: '/sites',
  },
];

interface SitesPageProps {
  sites: {
    data: Site[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
  };
  filters: {
    search: string;
    sortField: string;
    sortDirection: string;
    perPage: number;
  };
}

export default function SitesPage({ sites, filters }: SitesPageProps) {
  useToast();

  const [searchValue, setSearchValue] = useState(filters.search);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: sites.current_page - 1,
    pageSize: sites.per_page,
  });
  const [sorting, setSorting] = useState({
    field: filters.sortField,
    direction: filters.sortDirection,
  });
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(filters.search);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update URL when filters change
  useEffect(() => {
    router.get(
      route('sites.index'),
      {
        search: debouncedSearchValue,
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        sortField: sorting.field,
        sortDirection: sorting.direction,
      },
      {
        preserveState: true,
        replace: true,
        only: ['sites', 'filters'],
      },
    );
  }, [debouncedSearchValue, pagination.pageIndex, pagination.pageSize, sorting.field, sorting.direction]);

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'WordPress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Drupal':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      case 'SPIP':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Typo3':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'laravel':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'symfony':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'other':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getTeamBadgeColor = (team: string) => {
    switch (team) {
      case 'quai13':
        return 'bg-[#FE6213]/10 text-[#FE6213] border border-[#FE6213]/30 dark:bg-[#FE6213]/20 dark:text-[#FE6213] dark:border-[#FE6213]/50';
      case 'vernalis':
        return 'bg-[#01BB9D]/10 text-[#01BB9D] border border-[#01BB9D]/30 dark:bg-[#01BB9D]/20 dark:text-[#01BB9D] dark:border-[#01BB9D]/50';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const columns: ColumnDef<Site>[] = [
    {
      accessorKey: 'name',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center">
          Site
          {sorting.field === 'name' ? (
            sorting.direction === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const name = row.getValue('name') as string;
        const url = row.original.url as string;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{name}</span>
            <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:underline">
              {url}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: 'type',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('type')} className="flex items-center">
          Type
          {sorting.field === 'type' ? (
            sorting.direction === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        return <Badge className={getTypeBadgeColor(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>;
      },
    },
    {
      accessorKey: 'php_version',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('php_version')} className="flex items-center">
          PHP Version
          {sorting.field === 'php_version' ? (
            sorting.direction === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const phpVersion = row.original.php_version as string | null;
        return <div className="font-mono text-sm">{phpVersion || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'team',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('team')} className="flex items-center">
          Team
          {sorting.field === 'team' ? (
            sorting.direction === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const team = row.getValue('team') as string;
        return <Badge className={getTeamBadgeColor(team)}>{team.charAt(0).toUpperCase() + team.slice(1)}</Badge>;
      },
    },
    {
      accessorKey: 'last_check',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('last_check')} className="flex items-center">
          Last Check
          {sorting.field === 'last_check' ? (
            sorting.direction === 'asc' ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => {
        const lastCheck = row.original.last_check as string | null;
        return <div className="text-sm">{lastCheck ? new Date(lastCheck).toLocaleString() : 'Never'}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const site = row.original;
        return (
          <div className="flex justify-end">
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

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePerPageChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(value),
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  const table = useReactTable({
    data: sites.data,
    columns,
    pageCount: sites.last_page,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sites" />
      <div className="container mx-auto space-y-4 px-4 py-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search sites..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={pagination.pageSize.toString()} onValueChange={handlePerPageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rows per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button asChild>
            <Link href={route('sites.create')}>Create Site</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {sites.data.length ? (
                sites.data.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{site.name}</span>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:underline"
                        >
                          {site.url}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeBadgeColor(site.type)}>{site.type.charAt(0).toUpperCase() + site.type.slice(1)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">{site.php_version || 'N/A'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTeamBadgeColor(site.team)}>{site.team.charAt(0).toUpperCase() + site.team.slice(1)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{site.last_check ? new Date(site.last_check as string).toLocaleString() : 'Never'}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={route('sites.edit', { site: site.id })}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No sites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          totalItems={sites.total}
          itemName="sites"
          showTotalItems={true}
          from={sites.from}
          to={sites.to}
        />
      </div>
    </AppLayout>
  );
}
