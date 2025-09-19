import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { DataTableToolbar, ColumnGroup } from "@/components/ui/data-table-toolbar"
import { LaravelPaginationData } from "@/types"

export interface DataTablePaginationData<TData = unknown> extends LaravelPaginationData {
  data: TData[]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: DataTablePaginationData<TData>
  itemName: string
  pagination: PaginationState
  setPagination: (pagination: PaginationState | ((prev: PaginationState) => PaginationState)) => void
  sorting?: SortingState
  setSorting?: (sorting: SortingState | ((prev: SortingState) => SortingState)) => void
  columnVisibility?: VisibilityState
  setColumnVisibility?: (visibility: VisibilityState | ((prev: VisibilityState) => VisibilityState)) => void
  loading?: boolean
  emptyStateMessage?: string
  showPagination?: boolean
  showToolbar?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showColumnVisibility?: boolean
  toolbarActions?: React.ReactNode
  className?: string
  columnGroups?: ColumnGroup[]
  alwaysVisibleColumns?: string[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  itemName,
  pagination,
  setPagination,
  sorting = [],
  setSorting,
  columnVisibility = {},
  setColumnVisibility,
  loading = false,
  emptyStateMessage,
  showPagination = true,
  showToolbar = false,
  searchValue = "",
  onSearchChange,
  searchPlaceholder,
  showColumnVisibility = true,
  toolbarActions,
  className,
  columnGroups = [],
  alwaysVisibleColumns = [],
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data.data,
    columns,
    pageCount: data.last_page,
    state: {
      pagination,
      sorting,
      columnVisibility,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {showToolbar && onSearchChange && (
        <DataTableToolbar
          table={table}
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          perPage={pagination.pageSize}
          onPerPageChange={(value) => {
            setPagination((prev) => ({
              ...prev,
              pageSize: parseInt(value),
              pageIndex: 0,
            }));
          }}
          showColumnVisibility={showColumnVisibility}
          actions={toolbarActions}
          columnGroups={columnGroups}
          alwaysVisibleColumns={alwaysVisibleColumns}
        />
      )}

      <div className="rounded-md border ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {emptyStateMessage || `No ${itemName} found.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && (
        <Pagination
          pagination={data}
          itemName={itemName}
          showTotalItems={true}
          onPerPageChange={(perPage) => {
            setPagination((prev) => ({
              ...prev,
              pageSize: perPage,
              pageIndex: 0, // Reset to first page when changing page size
            }));
          }}
        />
      )}
    </div>
  )
}