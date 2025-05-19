<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteMetric;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
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

        return Inertia::render('sites/metrics/Index', [
            'site' => $site,
            'metrics' => $site->metrics,
        ]);
    }

    /**
     * Store metrics from WordPress API response.
     */
    public function storeFromApi(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $validated = $request->validate([
            'php' => 'required|array',
            'php.version' => 'required|string',
            'php.memory_limit' => 'required|string',
            'php.max_execution_time' => 'required|string',
            'php.post_max_size' => 'required|string',
            'php.upload_max_filesize' => 'required|string',
            'php.max_input_vars' => 'required|string',
            'php.extensions' => 'required|array',
            'mysql' => 'required|array',
            'mysql.version' => 'required|string',
            'mysql.server_info' => 'required|string',
            'wordpress' => 'required|array',
            'wordpress.version' => 'required|string',
            'wordpress.site_url' => 'required|string',
            'wordpress.home_url' => 'required|string',
            'wordpress.is_multisite' => 'required|boolean',
            'wordpress.max_upload_size' => 'required|string',
            'wordpress.permalink_structure' => 'required|string',
            'wordpress.active_theme' => 'required|string',
            'wordpress.active_theme_version' => 'required|string',
            'wordpress.active_plugins' => 'required|array',
            'server' => 'required|array',
            'server.software' => 'required|string',
            'server.os' => 'required|string',
            'server.server_ip' => 'required|string',
            'server.server_hostname' => 'required|string',
        ]);

        $metric = new SiteMetric([
            'php_version' => $validated['php']['version'],
            'memory_limit' => $validated['php']['memory_limit'],
            'max_execution_time' => $validated['php']['max_execution_time'],
            'post_max_size' => $validated['php']['post_max_size'],
            'upload_max_filesize' => $validated['php']['upload_max_filesize'],
            'max_input_vars' => $validated['php']['max_input_vars'],
            'php_extensions' => $validated['php']['extensions'],
            'server_ip' => $validated['server']['server_ip'],
            'server_software' => $validated['server']['software'],
            'server_os' => $validated['server']['os'],
            'server_hostname' => $validated['server']['server_hostname'],
            'mysql_version' => $validated['mysql']['version'],
            'mysql_server_info' => $validated['mysql']['server_info'],
            'wordpress_version' => $validated['wordpress']['version'],
            'wordpress_site_url' => $validated['wordpress']['site_url'],
            'wordpress_home_url' => $validated['wordpress']['home_url'],
            'wordpress_is_multisite' => $validated['wordpress']['is_multisite'],
            'wordpress_max_upload_size' => $validated['wordpress']['max_upload_size'],
            'wordpress_permalink_structure' => $validated['wordpress']['permalink_structure'],
            'wordpress_active_theme' => $validated['wordpress']['active_theme'],
            'wordpress_active_theme_version' => $validated['wordpress']['active_theme_version'],
            'wordpress_active_plugins' => $validated['wordpress']['active_plugins'],
            'last_check' => now(),
        ]);

        $site->metrics()->save($metric);

        // Update site contract information if provided
        if ($request->has('contract')) {
            $contractData = $request->validate([
                'contract' => 'required|array',
                'contract.start_date' => 'required|date',
                'contract.end_date' => 'required|date',
                'contract.capacity' => 'required|string',
                'contract.storage.usage_bytes' => 'required|numeric',
                'contract.storage.usage_gb' => 'required|numeric',
                'contract.storage.percentage' => 'required|numeric',
                'contract.storage.alert' => 'required|boolean',
                'contract.status' => 'required|string',
                'contract.remaining_days' => 'required|integer',
                'contract.progress_percentage' => 'required|numeric',
            ]);

            $site->credential()->updateOrCreate(
                ['site_id' => $site->id],
                [
                    'contract_start_date' => $contractData['contract']['start_date'],
                    'contract_end_date' => $contractData['contract']['end_date'],
                    'contract_capacity' => $contractData['contract']['capacity'],
                    'contract_storage_usage' => $contractData['contract']['storage']['usage_bytes'],
                    'contract_storage_limit' => $contractData['contract']['storage']['usage_gb'] . ' GB',
                ]
            );
        }

        return Redirect::route('sites.metrics.index', $site)
            ->with('success', __('Site metrics updated successfully from WordPress API.'));
    }

    /**
     * Refresh metrics for the specified site by fetching data from WordPress API.
     */
    public function refresh(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        try {
            // Construct the API endpoint URL
            $apiUrl = rtrim($site->url, '/') . '/wp-json/teamtreize/v1/system-info/' . config('services.wordpress.api_key');

            // Fetch data from WordPress API
            $response = Http::get($apiUrl);

            if (!$response->successful()) {
                return Redirect::route('sites.metrics.index', $site)
                    ->with('error', __('Failed to fetch metrics from WordPress site. Status code: ' . $response->status()));
            }

            // Get the API response data
            $data = $response->json();

            // Store the metrics using the existing storeFromApi logic
            return $this->storeFromApi(Request::create('', 'POST', $data), $site);
        } catch (\Exception $e) {
            return Redirect::route('sites.metrics.index', $site)
                ->with('error', __('Failed to fetch metrics from WordPress site: ' . $e->getMessage()));
        }
    }
}
