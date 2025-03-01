import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { PaginationState } from '@tanstack/react-table';

interface PaginationProps {
  pagination: PaginationState;
  setPagination: (updater: (prev: PaginationState) => PaginationState) => void;
  pageCount: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  totalItems?: number;
  itemName?: string;
  showTotalItems?: boolean;
  from?: number;
  to?: number;
}

export function Pagination({
  pagination,
  setPagination,
  pageCount,
  canPreviousPage,
  canNextPage,
  totalItems,
  itemName = 'items',
  showTotalItems = false,
  from,
  to,
}: PaginationProps) {
  const handlePerPageChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: parseInt(value),
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select value={pagination.pageSize.toString()} onValueChange={handlePerPageChange}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showTotalItems && totalItems !== undefined && (
          <div className="text-sm text-muted-foreground">
            {from !== undefined && to !== undefined
              ? `Showing ${from || 0} to ${to || 0} of ${totalItems} ${itemName}`
              : `Total: ${totalItems} ${itemName}`}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">
          Page {pagination.pageIndex + 1} of {pageCount}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: 0 }))}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">First page</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex - 1 }))}
            disabled={!canPreviousPage}
          >
            <span className="sr-only">Previous page</span>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            disabled={!canNextPage}
          >
            <span className="sr-only">Next page</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            onClick={() => setPagination((prev) => ({ ...prev, pageIndex: pageCount - 1 }))}
            disabled={!canNextPage}
          >
            <span className="sr-only">Last page</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}