import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Filter, X } from 'lucide-react';
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

export function SitesFilterPopover({ filters, onFiltersChange, className }: SitesFilterPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleTypeToggle = (type: string) => {
    const newTypes = filters.type.includes(type) ? filters.type.filter((t) => t !== type) : [...filters.type, type];

    onFiltersChange({ ...filters, type: newTypes });
  };

  const handleTeamToggle = (team: string) => {
    const newTeams = filters.team.includes(team) ? filters.team.filter((t) => t !== team) : [...filters.team, team];

    onFiltersChange({ ...filters, team: newTeams });
  };

  const handleSyncToggle = (syncEnabled: boolean) => {
    const newSync = filters.sync_enabled.includes(syncEnabled)
      ? filters.sync_enabled.filter((s) => s !== syncEnabled)
      : [...filters.sync_enabled, syncEnabled];

    onFiltersChange({ ...filters, sync_enabled: newSync });
  };

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
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Site Type</h5>
            <div className="space-y-2">
              {SITE_TYPES.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={filters.type.includes(type.value)}
                    onCheckedChange={() => handleTypeToggle(type.value)}
                  />
                  <label
                    htmlFor={`type-${type.value}`}
                    className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {type.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Team Filter */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Team</h5>
            <div className="space-y-2">
              {SITE_TEAMS.map((team) => (
                <div key={team.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`team-${team.value}`}
                    checked={filters.team.includes(team.value)}
                    onCheckedChange={() => handleTeamToggle(team.value)}
                  />
                  <label
                    htmlFor={`team-${team.value}`}
                    className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {team.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Sync Status Filter */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium">Sync Status</h5>
            <div className="space-y-2">
              {SYNC_STATUS.map((status) => (
                <div key={status.value.toString()} className="flex items-center space-x-2">
                  <Checkbox
                    id={`sync-${status.value}`}
                    checked={filters.sync_enabled.includes(status.value)}
                    onCheckedChange={() => handleSyncToggle(status.value)}
                  />
                  <label
                    htmlFor={`sync-${status.value}`}
                    className="text-sm leading-none font-normal peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {status.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

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
