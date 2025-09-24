import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, CirclePlus, X } from 'lucide-react';
import { useState } from 'react';

export const SYNC_STATUS = [
  { value: true, label: 'Sync Enabled' },
  { value: false, label: 'Sync Disabled' },
];

interface SiteSyncFilterProps {
  selectedSyncStatus: boolean[];
  onSyncStatusChange: (syncStatus: boolean[]) => void;
  className?: string;
}

export function SiteSyncFilter({ selectedSyncStatus, onSyncStatusChange, className }: SiteSyncFilterProps) {
  const [open, setOpen] = useState(false);

  const handleSyncToggle = (syncEnabled: boolean) => {
    const newSync = selectedSyncStatus.includes(syncEnabled)
      ? selectedSyncStatus.filter((s) => s !== syncEnabled)
      : [...selectedSyncStatus, syncEnabled];

    onSyncStatusChange(newSync);
  };

  const clearAllSync = () => {
    onSyncStatusChange([]);
  };

  const hasActiveFilters = selectedSyncStatus.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)}>
          <CirclePlus />
          Sync
          {hasActiveFilters && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedSyncStatus.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedSyncStatus.length > 1 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedSyncStatus.length} selected
                  </Badge>
                ) : (
                  selectedSyncStatus.slice(0, 2).map((sync) => (
                    <Badge variant="secondary" key={sync.toString()} className="rounded-sm px-1 font-normal">
                      {SYNC_STATUS.find((s) => s.value === sync)?.label}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="">
          <Command>
            <CommandInput placeholder="Search sync status..." />
            <CommandList>
              <CommandEmpty>No sync status found.</CommandEmpty>
              <CommandGroup>
                {SYNC_STATUS.map((status) => (
                  <CommandItem key={status.value.toString()} value={status.value.toString()} onSelect={() => handleSyncToggle(status.value)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={selectedSyncStatus.includes(status.value)} onChange={() => {}} />
                      <span>{status.label}</span>
                    </div>
                    {selectedSyncStatus.includes(status.value) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {hasActiveFilters && (
            <>
              <Separator className="my-4" />
              <Button variant="ghost" onClick={clearAllSync} className="h-8 w-full justify-center text-sm">
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
