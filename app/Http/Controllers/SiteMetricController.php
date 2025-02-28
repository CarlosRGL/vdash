<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SiteMetricController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Site $site)
    {
        if (Gate::denies('view', $site)) {
            abort(403);
        }

        $site->load(['metrics' => function ($query) {
            $query->latest()->take(10);
        }]);

        return Inertia::render('Sites/Metrics/Index', [
            'site' => $site,
            'metrics' => $site->metrics,
        ]);
    }

    /**
     * Refresh metrics for the specified site.
     */
    public function refresh(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        // In a real application, this would fetch data from the site
        // For now, we'll create a dummy metric record
        $metric = new SiteMetric([
            'php_version' => '8.2.0',
            'memory_limit' => '256M',
            'max_execution_time' => '30',
            'post_max_size' => '8M',
            'upload_max_filesize' => '2M',
            'max_input_vars' => '1000',
            'server_ip' => '127.0.0.1',
            'lighthouse_score' => rand(50, 100),
            'last_check' => now(),
        ]);

        $site->metrics()->save($metric);

        return Redirect::route('sites.metrics.index', $site)
            ->with('success', __('Site metrics refreshed successfully.'));
    }
}
