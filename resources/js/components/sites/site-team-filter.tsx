import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Check, CirclePlus, X } from 'lucide-react';
import { useState } from 'react';

export const SITE_TEAMS = [
  { value: 'quai13', label: 'Quai13' },
  { value: 'vernalis', label: 'Vernalis' },
];

interface SiteTeamFilterProps {
  selectedTeams: string[];
  onTeamsChange: (teams: string[]) => void;
  className?: string;
}

export function SiteTeamFilter({ selectedTeams, onTeamsChange, className }: SiteTeamFilterProps) {
  const [open, setOpen] = useState(false);

  const handleTeamToggle = (team: string) => {
    const newTeams = selectedTeams.includes(team) ? selectedTeams.filter((t) => t !== team) : [...selectedTeams, team];

    onTeamsChange(newTeams);
  };

  const clearAllTeams = () => {
    onTeamsChange([]);
  };

  const hasActiveFilters = selectedTeams.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn('h-8 border-dashed', className)}>
          <CirclePlus />
          Team
          {hasActiveFilters && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedTeams.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedTeams.length > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedTeams.length} selected
                  </Badge>
                ) : (
                  selectedTeams.slice(0, 2).map((team) => (
                    <Badge variant="secondary" key={team} className="rounded-sm px-1 font-normal">
                      {SITE_TEAMS.find((t) => t.value === team)?.label}
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
            <CommandInput placeholder="Search teams..." />
            <CommandList>
              <CommandEmpty>No teams found.</CommandEmpty>
              <CommandGroup>
                {SITE_TEAMS.map((team) => (
                  <CommandItem key={team.value} value={team.value} onSelect={() => handleTeamToggle(team.value)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox checked={selectedTeams.includes(team.value)} onChange={() => {}} />
                      <span>{team.label}</span>
                    </div>
                    {selectedTeams.includes(team.value) && <Check className="ml-auto h-4 w-4" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>

          {hasActiveFilters && (
            <>
              <Separator className="my-4" />
              <Button variant="ghost" onClick={clearAllTeams} className="h-8 w-full justify-center text-sm">
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
