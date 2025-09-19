import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import {LaravelPaginationData} from "@/types/index";


interface PaginationProps {
  pagination: LaravelPaginationData;
  itemName?: string;
  showTotalItems?: boolean;
  onPerPageChange?: (perPage: number) => void;
}

export function Pagination({
  pagination,
  itemName = 'items',
  showTotalItems = false,
  onPerPageChange,
}: PaginationProps) {
  const handlePerPageChange = (value: string) => {
    if (onPerPageChange) {
      onPerPageChange(parseInt(value));
    } else {
      // If no callback provided, navigate using current URL with updated per_page parameter
      const url = new URL(window.location.href);
      url.searchParams.set('per_page', value);
      url.searchParams.set('page', '1'); // Reset to first page when changing per_page

      router.get(url.pathname + url.search, {}, {
        preserveState: true,
        replace: true,
      });
    }
  };


  const canPreviousPage = pagination.prev_page_url !== null;
  const canNextPage = pagination.next_page_url !== null;

  return (
    <div className="mt-4 flex items-center justify-between border-t pt-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">Rows per page</span>
          <Select value={pagination.per_page?.toString() || "10"} onValueChange={handlePerPageChange}>
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

        {showTotalItems && (
          <div className="text-sm text-muted-foreground">
            Showing {pagination.from} to {pagination.to} of {pagination.total} {itemName}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm">
          Page {pagination.current_page} of {pagination.last_page}
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            disabled={!canPreviousPage}
            asChild={canPreviousPage}
          >
            {canPreviousPage ? (
              <Link href={pagination.first_page_url} preserveState>
                <span className="sr-only">First page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <span className="sr-only">First page</span>
                <ChevronsLeft className="h-4 w-4" />
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            disabled={!canPreviousPage}
            asChild={canPreviousPage}
          >
            {canPreviousPage ? (
              <Link href={pagination.prev_page_url!} preserveState>
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <span className="sr-only">Previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            disabled={!canNextPage}
            asChild={canNextPage}
          >
            {canNextPage ? (
              <Link href={pagination.next_page_url!} preserveState>
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <span className="sr-only">Next page</span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-md border border-gray-200 shadow-sm"
            disabled={!canNextPage}
            asChild={canNextPage}
          >
            {canNextPage ? (
              <Link href={pagination.last_page_url} preserveState>
                <span className="sr-only">Last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <span className="sr-only">Last page</span>
                <ChevronsRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}