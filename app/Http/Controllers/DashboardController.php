<?php

namespace App\Http\Controllers;

use App\Models\Site;
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

        return Inertia::render('dashboard', [
            'siteTypeStats' => $siteTypeStats,
        ]);
    }
}
