import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, Filter, X } from 'lucide-react';
import { useState } from 'react';

export interface SiteFilters {
  type: string[];
  team: string[];
  sync_enabled: boolean[];
}

interface SitesFilterPopoverProps {
  filters: SiteFilters;
  onFiltersChange: (filters: SiteFilters) => void;
  className?: string;
}

export const SITE_TYPES = [
  { value: 'WordPress', label: 'WordPress' },
  { value: 'Drupal', label: 'Drupal' },
  { value: 'SPIP', label: 'SPIP' },
  { value: 'Typo3', label: 'Typo3' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'symfony', label: 'Symfony' },
  { value: 'other', label: 'Other' },
];

export const SITE_TEAMS = [
  { value: 'quai13', label: 'Quai13' },
  { value: 'vernalis', label: 'Vernalis' },
];

export const SYNC_STATUS = [
  { value: true, label: 'Sync Enabled' },
  { value: false, label: 'Sync Disabled' },
];

interface ComboboxFilterProps<T = string | boolean> {
  title: string;
  options: { value: T; label: string }[];
  selectedValues: T[];
  onSelectionChange: (values: T[]) => void;
  placeholder?: string;
}

function ComboboxFilter<T = string | boolean>({ title, options, selectedValues, onSelectionChange, placeholder }: ComboboxFilterProps<T>) {
  const [open, setOpen] = useState(false);

  const toggleSelection = (value: T) => {
    const isSelected = selectedValues.includes(value);
    if (isSelected) {
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-3">
      <h5 className="text-sm font-medium">{title}</h5>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left font-normal">
            {selectedValues.length > 0
              ? selectedValues.length === 1
                ? options.find((option) => option.value === selectedValues[0])?.label
                : `${selectedValues.length} selected`
              : placeholder || `Select ${title.toLowerCase()}...`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder={`Search ${title.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No {title.toLowerCase()} found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem key={String(option.value)} value={String(option.value)} onSelect={() => toggleSelection(option.value)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={selectedValues.includes(option.value)} onChange={() => {}} />
                      <span>{option.label}</span>
                    </div>
                    {selectedValues.includes(option.value) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function SitesFilterPopover({ filters, onFiltersChange, className }: SitesFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  const clearAllFilters = () => {
    onFiltersChange({
      type: [],
      team: [],
      sync_enabled: [],
    });
  };

  const hasActiveFilters = filters.type.length > 0 || filters.team.length > 0 || filters.sync_enabled.length > 0;
  const activeFiltersCount = filters.type.length + filters.team.length + filters.sync_enabled.length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {activeFiltersCount > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {activeFiltersCount}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {activeFiltersCount > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {activeFiltersCount} selected
                  </Badge>
                ) : (
                  <>
                    {filters.type.slice(0, 2).map((type) => (
                      <Badge variant="secondary" key={type} className="rounded-sm px-1 font-normal">
                        {SITE_TYPES.find((t) => t.value === type)?.label}
                      </Badge>
                    ))}
                    {filters.team.slice(0, 2).map((team) => (
                      <Badge variant="secondary" key={team} className="rounded-sm px-1 font-normal">
                        {SITE_TEAMS.find((t) => t.value === team)?.label}
                      </Badge>
                    ))}
                    {filters.sync_enabled.slice(0, 2).map((sync) => (
                      <Badge variant="secondary" key={sync.toString()} className="rounded-sm px-1 font-normal">
                        {SYNC_STATUS.find((s) => s.value === sync)?.label}
                      </Badge>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="border-b p-4">
          <div className="flex items-center justify-between">
            <h4 className="leading-none font-medium">Filters</h4>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground hover:text-foreground h-auto p-0 text-xs">
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          {/* Site Type Filter */}
          <ComboboxFilter
            title="Site Type"
            options={SITE_TYPES}
            selectedValues={filters.type}
            onSelectionChange={(types) => onFiltersChange({ ...filters, type: types })}
            placeholder="Select site types..."
          />

          <Separator className="my-4" />

          {/* Team Filter */}
          <ComboboxFilter
            title="Team"
            options={SITE_TEAMS}
            selectedValues={filters.team}
            onSelectionChange={(teams) => onFiltersChange({ ...filters, team: teams })}
            placeholder="Select teams..."
          />

          <Separator className="my-4" />

          {/* Sync Status Filter */}
          <ComboboxFilter
            title="Sync Status"
            options={SYNC_STATUS}
            selectedValues={filters.sync_enabled}
            onSelectionChange={(syncEnabled) => onFiltersChange({ ...filters, sync_enabled: syncEnabled })}
            placeholder="Select sync status..."
          />

          {/* Clear filters button */}
          {hasActiveFilters && (
            <>
              <Separator className="my-4" />
              <Button variant="ghost" onClick={clearAllFilters} className="h-8 w-full justify-center text-sm">
                <X className="mr-2 h-3 w-3" />
                Clear filters
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
