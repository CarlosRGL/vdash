<?php

namespace App\Http\Controllers;

use App\Models\Site;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SiteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Site::with(['user', 'metrics' => function ($query) {
            $query->latest('last_check')->limit(1);
        }, 'credential'])
            ->when(!Gate::allows('viewAny', Site::class), function ($query) {
                return $query->where('user_id', Auth::id());
            });

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('url', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortField = $request->input('sortField', 'name');
        $sortDirection = $request->input('sortDirection', 'asc');
        $allowedSortFields = ['name', 'url', 'type', 'team', 'created_at', 'php_version', 'last_check', 'contract_start_date', 'contract_end_date'];

        // Add support for sorting by metrics fields
        if ($sortField === 'php_version' || $sortField === 'last_check') {
            // For metrics-based sorting, we need to use a subquery
            $subQuery = "SELECT {$sortField} FROM site_metrics
                        WHERE site_metrics.site_id = sites.id
                        ORDER BY last_check DESC LIMIT 1";

            $query->orderByRaw("({$subQuery}) " . ($sortDirection === 'asc' ? 'asc' : 'desc'));
        } elseif ($sortField === 'contract_start_date' || $sortField === 'contract_end_date') {
            // For contract-based sorting, we need to join with site_credentials
            $query->leftJoin('site_credentials', 'sites.id', '=', 'site_credentials.site_id')
                  ->orderBy("site_credentials.{$sortField}", $sortDirection === 'asc' ? 'asc' : 'desc')
                  ->select('sites.*'); // Ensure we only select site columns
        } elseif (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('name', 'asc');
        }

        // Apply pagination
        $perPage = $request->input('perPage', 10);
        $sites = $query->paginate($perPage)->withQueryString();

        // Transform the sites to include the latest metrics data
        $sites->through(function ($site) {
            $latestMetric = $site->metrics->first();

            // Add the metrics data directly to the site object
            $site->php_version = $latestMetric ? $latestMetric->php_version : null;
            $site->last_check = $latestMetric ? $latestMetric->last_check : null;

            // Remove the metrics relationship from the response to avoid duplication
            unset($site->metrics);

            return $site;
        });

        return Inertia::render('sites/index', [
            'sites' => $sites,
            'filters' => [
                'search' => $request->input('search', ''),
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
                'perPage' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('sites/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:WordPress,Drupal,SPIP,Typo3,laravel,symfony,other',
            'team' => 'required|in:quai13,vernalis',
        ]);

        $site = new Site($validated);
        $site->user_id = Auth::id();
        $site->save();

        return Redirect::route('sites.index', $site)
            ->with('toast', [
                'type' => 'success',
                'message' => 'Site created successfully',
                'description' => "The site {$request->name} has been added to the system.",
            ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Site $site)
    {
        if (Gate::denies('view', $site)) {
            abort(403);
        }

        $site->load(['credential', 'metrics' => function ($query) {
            $query->latest()->first();
        }]);

        return Inertia::render('sites/Show', [
            'site' => $site,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        return Inertia::render('sites/Edit', [
            'site' => $site,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:WordPress,Drupal,SPIP,Typo3,laravel,symfony,other',
            'team' => 'required|in:quai13,vernalis',
        ]);

        $site->update($validated);

        return Redirect::route('sites.edit', $site)
            ->with('toast', [
                'type' => 'success',
                'message' => 'Site updated successfully',
                'description' => "The site {$request->name} has been updated.",
            ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Site $site)
    {
        if (Gate::denies('delete', $site)) {
            abort(403);
        }

        $site->delete();

        return Redirect::route('sites.index')
            ->with('success', __('Site deleted successfully.'));
    }
}
