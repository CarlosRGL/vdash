import { AlertTriangle, Calendar, Clock } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ExpiringContract {
  site_name: string;
  site_id: number;
  contract_end_date: string;
  contract_end_date_formatted: string;
  days_remaining: number;
  is_urgent: boolean;
}

interface ExpiringContractsProps {
  expiringContracts: ExpiringContract[];
}

export default function ExpiringContracts({ expiringContracts }: ExpiringContractsProps) {
  const urgentContracts = expiringContracts.filter((contract) => contract.is_urgent);
  const totalExpiring = expiringContracts.length;

  if (totalExpiring === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Contract Renewals
          </CardTitle>
          <CardDescription>Contracts expiring in the next 30 days</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="text-muted-foreground mb-2 text-2xl">🎉</div>
            <p className="text-muted-foreground text-sm">No contracts expiring soon</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Contract Renewals
          {urgentContracts.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {urgentContracts.length} urgent
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          {totalExpiring} contract{totalExpiring === 1 ? '' : 's'} expiring in the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-64">
          <div className="space-y-3 px-4">
            {expiringContracts.slice(0, 8).map((contract) => (
              <div
                key={contract.site_id}
                className={cn(
                  'flex items-center justify-between rounded-lg border p-3 transition-colors',
                  contract.is_urgent ? 'border-destructive/20 bg-destructive/5' : 'border-border bg-muted/30',
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    {contract.is_urgent && <AlertTriangle className="text-destructive h-4 w-4 flex-shrink-0" />}
                    <p className="truncate text-sm font-medium">{contract.site_name}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3" />
                    <span>{contract.contract_end_date_formatted}</span>
                  </div>
                </div>
                <div className="ml-2 text-right">
                  <Badge variant={contract.is_urgent ? 'destructive' : 'secondary'} className="text-xs">
                    {contract.days_remaining === 0 ? 'Today' : `${contract.days_remaining} day${contract.days_remaining === 1 ? '' : 's'}`}
                  </Badge>
                </div>
              </div>
            ))}
            {expiringContracts.length > 8 && (
              <div className="border-t pt-2 text-center">
                <p className="text-muted-foreground text-xs">
                  +{expiringContracts.length - 8} more contract{expiringContracts.length - 8 === 1 ? '' : 's'}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
