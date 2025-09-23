import DashboardChart from '@/components/dashboard-chart';
import ExpiringContracts from '@/components/expiring-contracts';
import StorageUsage from '@/components/storage-usage';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface SiteTypeStat {
  type: string;
  count: number;
  fill: string;
}

interface ExpiringContract {
  site_name: string;
  site_id: number;
  contract_end_date: string;
  contract_end_date_formatted: string;
  days_remaining: number;
  is_urgent: boolean;
}

interface StorageUsageData {
  site_name: string;
  site_id: number;
  storage_usage: string;
  storage_limit: string;
  usage_gb: number;
  limit_gb: number;
  usage_percentage: number;
  is_critical: boolean;
  is_warning: boolean;
}

interface DashboardProps {
  siteTypeStats: SiteTypeStat[];
  expiringContracts: ExpiringContract[];
  storageUsage: StorageUsageData[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ siteTypeStats, expiringContracts, storageUsage }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
          <DashboardChart siteTypeStats={siteTypeStats} />

          <ExpiringContracts expiringContracts={expiringContracts} />

          <StorageUsage storageUsage={storageUsage} />
        </div>
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min">
          <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
        </div>
      </div>
    </AppLayout>
  );
}
