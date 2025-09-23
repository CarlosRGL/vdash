import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SiteLayout from '@/layouts/sites/layout';
import { type BreadcrumbItem, type Site, type SiteContract } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarDays, HardDrive } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface EditSiteContractProps {
  site: Site;
  contract: SiteContract;
}

export default function EditSiteContract({ site, contract }: EditSiteContractProps) {
  // Format date string to YYYY-MM-DD for date input
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    console.log(dateString);

    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  // State for date picker values
  const [startDate, setStartDate] = useState<Date | undefined>(contract?.contract_start_date ? new Date(contract.contract_start_date) : undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(contract?.contract_end_date ? new Date(contract.contract_end_date) : undefined);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sites',
      href: '/sites',
    },
    {
      title: site.name,
      href: `/sites/${site.id}`,
    },
    {
      title: 'Contract Information',
      href: `/sites/${site.id}/contracts/edit`,
    },
  ];

  // Initialize form with data from contract
  const { setData, data, processing, errors } = useForm({
    contract_start_date: formatDateForInput(contract?.contract_start_date),
    contract_end_date: formatDateForInput(contract?.contract_end_date),
    contract_capacity: contract?.contract_capacity || '',
    contract_storage_usage: contract?.contract_storage_usage || '',
    contract_storage_limit: contract?.contract_storage_limit || '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Prepare the form data with current date values
    const formData = {
      contract_start_date: startDate ? formatDateForInput(startDate.toISOString()) : '',
      contract_end_date: endDate ? formatDateForInput(endDate.toISOString()) : '',
      contract_capacity: data.contract_capacity,
      contract_storage_usage: data.contract_storage_usage,
      contract_storage_limit: data.contract_storage_limit,
    };

    // Submit the form using router
    router.put(route('sites.contracts.update', site.id), formData);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Contract - ${site.name}`} />

      <SiteLayout siteId={site.id} siteName={site.name}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Duration Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Contract Duration
              </CardTitle>
              <CardDescription>Specify the start and end dates for the hosting contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contract_start_date">Start Date</Label>
                  <DatePicker
                    date={startDate}
                    onSelect={setStartDate}
                    placeholder="Select start date"
                    className={errors.contract_start_date ? 'border-red-500' : ''}
                  />
                  {errors.contract_start_date && <p className="text-sm text-red-600">{errors.contract_start_date}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_end_date">End Date</Label>
                  <DatePicker
                    date={endDate}
                    onSelect={setEndDate}
                    placeholder="Select end date (optional)"
                    className={errors.contract_end_date ? 'border-red-500' : ''}
                  />
                  {errors.contract_end_date && <p className="text-sm text-red-600">{errors.contract_end_date}</p>}
                  <p className="text-muted-foreground text-sm">Leave empty for indefinite contract</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Storage Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Information
              </CardTitle>
              <CardDescription>Track storage capacity, usage, and limits for this hosting contract.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contract_capacity">Contract Capacity</Label>
                <Input
                  id="contract_capacity"
                  type="text"
                  placeholder="e.g., 10GB, 500MB, 1TB"
                  value={data.contract_capacity}
                  onChange={(e) => setData('contract_capacity', e.target.value)}
                  className={errors.contract_capacity ? 'border-red-500' : ''}
                />
                {errors.contract_capacity && <p className="text-sm text-red-600">{errors.contract_capacity}</p>}
                <p className="text-muted-foreground text-sm">Total storage capacity allocated in the contract</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contract_storage_usage">Current Storage Usage</Label>
                  <Input
                    id="contract_storage_usage"
                    type="text"
                    placeholder="e.g., 2.5GB, 150MB"
                    value={data.contract_storage_usage}
                    onChange={(e) => setData('contract_storage_usage', e.target.value)}
                    className={errors.contract_storage_usage ? 'border-red-500' : ''}
                  />
                  {errors.contract_storage_usage && <p className="text-sm text-red-600">{errors.contract_storage_usage}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contract_storage_limit">Storage Limit</Label>
                  <Input
                    id="contract_storage_limit"
                    type="text"
                    placeholder="e.g., 8GB, 450MB"
                    value={data.contract_storage_limit}
                    onChange={(e) => setData('contract_storage_limit', e.target.value)}
                    className={errors.contract_storage_limit ? 'border-red-500' : ''}
                  />
                  {errors.contract_storage_limit && <p className="text-sm text-red-600">{errors.contract_storage_limit}</p>}
                  <p className="text-muted-foreground text-sm">Warning threshold before reaching capacity</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing ? 'Updating...' : 'Update Contract Information'}
            </Button>
          </div>
        </form>
      </SiteLayout>
    </AppLayout>
  );
}
