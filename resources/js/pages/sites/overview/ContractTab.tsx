import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Site } from '@/types';
import { Link } from '@inertiajs/react';
import { Calendar, HardDrive } from 'lucide-react';

interface ContractTabProps {
  site: Site;
  formatDate: (dateString: string) => string;
  getStoragePercentage: () => number;
}

export function ContractTab({ site, formatDate, getStoragePercentage }: ContractTabProps) {
  if (!site.contract) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">No contract information found</h3>
          <p className="mb-4 text-center text-gray-600 dark:text-gray-400">Contract details have not been added for this site yet.</p>
          <Button asChild>
            <Link href={`/sites/${site.id}/contract/create`}>Add Contract Info</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Contract Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {site.contract.contract_start_date && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date:</span>
              <p className="text-base font-semibold">{formatDate(site.contract.contract_start_date)}</p>
            </div>
          )}
          {site.contract.contract_end_date && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">End Date:</span>
              <p className="text-base font-semibold">{formatDate(site.contract.contract_end_date)}</p>
            </div>
          )}
          {site.contract.contract_capacity && (
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacity:</span>
              <p className="text-base font-semibold">{site.contract.contract_capacity}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {site.contract.contract_storage_usage !== null && site.contract.contract_storage_limit !== null && (
            <>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Used:</span>
                  <p className="text-base font-semibold">{site.contract.contract_storage_usage} GB</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Limit:</span>
                  <p className="text-base font-semibold">{site.contract.contract_storage_limit} GB</p>
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Usage</span>
                  <span>{getStoragePercentage().toFixed(1)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-2 rounded-full ${
                      getStoragePercentage() > 90 ? 'bg-red-500' : getStoragePercentage() > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(getStoragePercentage(), 100)}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
