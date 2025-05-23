import { SiteCredentialsSheet, SitesFilters, SitesTable, createSitesTableColumns } from '@/components/sites';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Site, type SiteCredential } from '@/types';
import { Head, router } from '@inertiajs/react';
import { PaginationState } from '@tanstack/react-table';
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
  const { toast } = useToast();

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

  const handleSync = (site: Site) => {
    router.post(
      route('sites.metrics.refresh', { site: site.id }),
      {},
      {
        onSuccess: () => {
          toast.success('Site metrics synced successfully.');
        },
        onError: () => {
          toast.error('Failed to sync site metrics.');
        },
      },
    );
  };

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

  const handlePerPageChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(value),
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  const columns = createSitesTableColumns({
    sorting,
    onSort: handleSort,
    onSync: handleSync,
    onShowCredentials: handleShowCredentials,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head>
        <title>Sites</title>
      </Head>
      <div className="w-full space-y-4 px-4 py-6">
        <SitesFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          pageSize={pagination.pageSize}
          onPageSizeChange={handlePerPageChange}
        />

        <SitesTable sites={sites} columns={columns} pagination={pagination} setPagination={setPagination} />
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
