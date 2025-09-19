import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useInitials } from '@/hooks/use-initials';
import { useToast } from '@/hooks/use-toast';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { ColumnDef, PaginationState, VisibilityState } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/users',
  },
];

interface UsersPageProps {
  users: {
    data: User[];
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

export default function UsersPage({ users, filters }: UsersPageProps) {
  useToast();
  const getInitials = useInitials();

  const [searchValue, setSearchValue] = useState(filters.search);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: users.current_page - 1,
    pageSize: users.per_page,
  });

  const [sorting, setSorting] = useState({
    field: filters.sortField,
    direction: filters.sortDirection,
  });
  const [debouncedSearchValue, setDebouncedSearchValue] = useState(filters.search);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

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
      route('users.index'),
      {
        search: debouncedSearchValue,
        sortField: sorting.field,
        sortDirection: sorting.direction,
      },
      {
        preserveState: true,
        replace: true,
        only: ['users', 'filters'],
      },
    );
  }, [debouncedSearchValue, sorting.field, sorting.direction]);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'id',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('id')} className="flex items-center">
          ID
          {sorting.field === 'id' ? (
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
      cell: ({ row }) => <div className="text-center">{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center">
          Name
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
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'email',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('email')} className="flex items-center">
          Email
          {sorting.field === 'email' ? (
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
    },
    {
      accessorKey: 'roles',
      header: () => (
        <Button variant="ghost" className="flex items-center">
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        const roles = user.roles || [];

        if (roles.length === 0) {
          return <div className="text-gray-500">No role</div>;
        }

        return (
          <div className="flex flex-wrap gap-1">
            {roles.map((role) => (
              <span
                key={role.id}
                className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              >
                {role.name}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: 'created_at',
      header: () => (
        <Button variant="ghost" onClick={() => handleSort('created_at')} className="flex items-center">
          Created At
          {sorting.field === 'created_at' ? (
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
        const date = new Date(row.getValue('created_at'));
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" asChild>
              <Link href={route('users.edit', { user: user.id })}>
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Users" />
      <div className="w-full px-4 py-6">
        <DataTable
          columns={columns}
          data={users}
          itemName="users"
          pagination={pagination}
          setPagination={setPagination}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          showToolbar={true}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          searchPlaceholder="Search users..."
          toolbarActions={
            <Button asChild>
              <Link href={route('users.create')}>Create User</Link>
            </Button>
          }
        />
      </div>
    </AppLayout>
  );
}
