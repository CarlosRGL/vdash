<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteContract;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index(): Response
    {
        $siteTypeStats = Site::selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->orderByDesc('count')
            ->get()
            ->map(function ($item, $index) {
                return [
                    'type' => $item->type,
                    'count' => $item->count,
                    'fill' => 'var(--chart-' . ($index + 1) . ')',
                ];
            });

        // Get contracts expiring within the next 30 days
        $expiringContracts = SiteContract::with('site')
            ->whereNotNull('contract_end_date')
            ->whereBetween('contract_end_date', [
                Carbon::now(),
                Carbon::now()->addDays(180),
            ])
            ->orderBy('contract_end_date')
            ->get()
            ->map(function ($contract) {
                $daysRemaining = Carbon::now()->diffInDays($contract->contract_end_date, false);

                return [
                    'site_name' => $contract->site->name,
                    'site_id' => $contract->site_id,
                    'contract_end_date' => $contract->contract_end_date->format('Y-m-d'),
                    'contract_end_date_formatted' => $contract->contract_end_date->format('M j, Y'),
                    'days_remaining' => max(0, (int) $daysRemaining),
                    'is_urgent' => $daysRemaining <= 7,
                ];
            });

        // Get sites with highest storage usage
        $storageUsage = SiteContract::with('site')
            ->whereNotNull('contract_storage_usage')
            ->whereNotNull('contract_storage_limit')
            ->get()
            ->map(function ($contract) {
                // Parse storage values (e.g., "13GB" -> 13)
                $usage = (float) preg_replace('/[^0-9.]/', '', $contract->contract_storage_usage);
                $limit = (float) preg_replace('/[^0-9.]/', '', $contract->contract_storage_limit);

                if ($limit <= 0) {
                    return null;
                }

                $percentage = round(($usage / $limit) * 100, 1);

                return [
                    'site_name' => $contract->site->name,
                    'site_id' => $contract->site_id,
                    'storage_usage' => $contract->contract_storage_usage,
                    'storage_limit' => $contract->contract_storage_limit,
                    'usage_gb' => $usage,
                    'limit_gb' => $limit,
                    'usage_percentage' => $percentage,
                    'is_critical' => $percentage >= 90,
                    'is_warning' => $percentage >= 75 && $percentage < 90,
                ];
            })
            ->filter()
            ->sortByDesc('usage_percentage')
            ->take(10)
            ->values();

        return Inertia::render('dashboard', [
            'siteTypeStats' => $siteTypeStats,
            'expiringContracts' => $expiringContracts,
            'storageUsage' => $storageUsage,
        ]);
    }
}
