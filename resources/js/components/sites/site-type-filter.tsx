import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, CirclePlus, X } from 'lucide-react';
import { useState } from 'react';

export const SITE_TYPES = [
  { value: 'WordPress', label: 'WordPress' },
  { value: 'Drupal', label: 'Drupal' },
  { value: 'SPIP', label: 'SPIP' },
  { value: 'Typo3', label: 'Typo3' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'symfony', label: 'Symfony' },
  { value: 'other', label: 'Other' },
];

interface SiteTypeFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  className?: string;
}

export function SiteTypeFilter({ selectedTypes, onTypesChange, className }: SiteTypeFilterProps) {
  const [open, setOpen] = useState(false);

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type];

    onTypesChange(newTypes);
  };

  const clearAllTypes = () => {
    onTypesChange([]);
  };

  const hasActiveFilters = selectedTypes.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)}>
          <CirclePlus />
          Type
          {hasActiveFilters && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedTypes.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedTypes.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedTypes.length} selected
                  </Badge>
                ) : (
                  selectedTypes.slice(0, 2).map((type) => (
                    <Badge variant="secondary" key={type} className="rounded-sm px-1 font-normal">
                      {SITE_TYPES.find((t) => t.value === type)?.label}
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
            <CommandInput placeholder="Search site types..." />
            <CommandList>
              <CommandEmpty>No site types found.</CommandEmpty>
              <CommandGroup>
                {SITE_TYPES.map((type) => (
                  <CommandItem key={type.value} value={type.value} onSelect={() => handleTypeToggle(type.value)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={selectedTypes.includes(type.value)} onChange={() => {}} />
                      <span>{type.label}</span>
                    </div>
                    {selectedTypes.includes(type.value) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {hasActiveFilters && (
            <>
              <Separator className="my-0" />
              <Button variant="ghost" onClick={clearAllTypes} className="h-8 w-full justify-center text-sm">
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
