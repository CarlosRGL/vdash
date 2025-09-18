import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface SitesFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (value: string) => void;
}

export function SitesFilters({ searchValue, onSearchChange, pageSize, onPageSizeChange }: SitesFiltersProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search sites..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-64 pl-10"
          />
        </div>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger className="min-w-[130px]">
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
  );
}
