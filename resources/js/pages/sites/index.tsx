import { SiteCredentialsSheet, createSitesTableColumns } from '@/components/sites';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { PaginationState, VisibilityState } from '@tanstack/react-table';
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
    first_page_url: string;
    last_page_url: string;
    next_page_url: string | null;
    prev_page_url: string | null;
    path: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
  };
  filters: {
    search: string;
    sortField: string;
    sortDirection: string;
    perPage: number;
  };
}

export default function SitesPage({ sites, filters }: SitesPageProps) {
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
  const [credentialsDialogOpen, setCredentialsDialogOpen] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState<SiteCredential | null>(null);
  const [selectedSiteName, setSelectedSiteName] = useState<string>('');
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Define column groups for the sites table
  const columnGroups = [
    {
      id: 'server',
      label: 'Server',
      columns: ['php_info', 'mysql_info', 'server_details'],
    },
    {
      id: 'contract',
      label: 'Contract',
      columns: ['contract_info', 'storage_usage'],
    },
  ];

  const alwaysVisibleColumns = ['name', 'type', 'clients', 'actions'];

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

  const handleShowCredentials = (site: Site) => {
    const cred =
      site.credential && typeof site.credential === 'object' && 'login_url' in site.credential ? (site.credential as SiteCredential) : null;
    setSelectedCredentials(cred);
    setSelectedSiteName(site.name);
    setCredentialsDialogOpen(true);
  };

  const handleSort = (field: string) => {
    setSorting((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const columns = createSitesTableColumns({
    sorting,
    onSort: handleSort,
    onShowCredentials: handleShowCredentials,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Sites</title>
      </Head>
      <div className="w-full space-y-4 px-4 py-6">
        <DataTable
          columns={columns}
          data={sites}
          itemName="sites"
          pagination={pagination}
          setPagination={setPagination}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          showPagination={true}
          showToolbar={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search sites..."
          columnGroups={columnGroups}
          alwaysVisibleColumns={alwaysVisibleColumns}
          toolbarActions={
            <Button>
              <Link href={route('sites.create')}>Create Site</Link>
            </Button>
          }
        />
      </div>

      <SiteCredentialsSheet
        open={credentialsDialogOpen}
        onOpenChange={setCredentialsDialogOpen}
        credentials={selectedCredentials}
        siteName={selectedSiteName}
      />
    </AppLayout>
  );
}
