<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\User;
use App\Services\SiteSyncService;
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
        $query = Site::with(['users', 'credential', 'contract', 'serverInfo'])
            ->when(! Gate::allows('viewAny', Site::class), function ($query) {
                return $query->whereHas('users', function ($q) {
                    $q->where('user_id', Auth::id());
                });
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

        // Apply type filter
        if ($request->has('type') && is_array($request->input('type')) && count($request->input('type')) > 0) {
            $types = $request->input('type');
            $query->whereIn('type', $types);
        }

        // Apply team filter
        if ($request->has('team') && is_array($request->input('team')) && count($request->input('team')) > 0) {
            $teams = $request->input('team');
            $query->whereIn('team', $teams);
        }

        // Apply sync enabled filter
        if (
            $request->has('sync_enabled') &&
            is_array($request->input('sync_enabled')) &&
            count($request->input('sync_enabled')) > 0
        ) {
            $syncEnabled = $request->input('sync_enabled');
            $query->where(function ($q) use ($syncEnabled) {
                foreach ($syncEnabled as $enabled) {
                    $q->orWhere('sync_enabled', filter_var($enabled, FILTER_VALIDATE_BOOLEAN));
                }
            });
        }

        // Apply sorting
        $sortField = $request->input('sortField', 'name');
        $sortDirection = $request->input('sortDirection', 'asc');
        $allowedSortFields = [
            'name', 'url', 'type', 'team', 'created_at',
            'php_version', 'last_check', 'contract_start_date', 'contract_end_date',
        ];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Apply pagination
        $perPage = $request->input('perPage', 25);
        $sites = $query->paginate($perPage)->withQueryString();

        return Inertia::render('sites/index', [
            'sites' => $sites,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', []),
                'team' => $request->input('team', []),
                'sync_enabled' => $request->input('sync_enabled', []),
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
        $availableUsers = User::select('id', 'name', 'email')->get();

        return Inertia::render('sites/Create', [
            'availableUsers' => $availableUsers,
        ]);
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
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $site = Site::create($validated);

        // Assign users to the site
        $userIds = $validated['user_ids'] ?? [Auth::id()];
        $site->users()->sync($userIds);

        return Inertia::render('sites/Edit', [
            'site' => $site,
            'flash' => [
                'toast' => [
                    'type' => 'success',
                    'message' => 'Site created successfully',
                    'description' => "The site {$request->name} has been added to the system.",
                ],
            ],
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

        $site->load([
            'users',
            'credential',
            'contract',
            'serverInfo',
        ]);

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

        $site->load('users');
        $availableUsers = User::select('id', 'name', 'email')->get();

        return Inertia::render('sites/Edit', [
            'site' => $site,
            'availableUsers' => $availableUsers,
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
            'user_ids' => 'nullable|array',
            'user_ids.*' => 'exists:users,id',
            'sync_enabled' => 'boolean',
            'api_token' => 'required_if:sync_enabled,true|string|max:255',
        ]);

        $site->update($validated);

        // Update user assignments if provided
        if (isset($validated['user_ids'])) {
            $site->users()->sync($validated['user_ids']);
        }

        return Redirect::route('sites.show', $site)
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
        $sitename = $site->name;
        $site->delete();
        // delete also the credentials and contract if exist
        if ($site->credential) {
            $site->credential->delete();
        }
        if ($site->contract) {
            $site->contract->delete();
        }

        // flush the session to avoid issues with Inertia
        session()->flash('toast', [
            'type' => 'success',
            'message' => 'Site deleted successfully',
            'description' => "The site {$sitename} and all its related data have been deleted.",
        ]);

        return to_route('sites.index', [
            'flash' => [
                'toast' => [
                    'type' => 'success',
                    'message' => 'API & Sync settings updated successfully',
                    'description' => "The API & Sync settings for {$site->name} have been updated.",
                ],
            ],
        ]);
    }

    /**
     * Assign users to a site.
     */
    public function assignUsers(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $validated = $request->validate([
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        $site->users()->sync($validated['user_ids']);

        return Redirect::back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'Users assigned successfully',
                'description' => 'The selected users have been assigned to the site.',
            ]);
    }

    /**
     * Remove a user from a site.
     */
    public function removeUser(Request $request, Site $site, User $user)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $site->users()->detach($user->id);

        return Redirect::back()
            ->with('toast', [
                'type' => 'success',
                'message' => 'User removed successfully',
                'description' => "User {$user->name} has been removed from the site.",
            ]);
    }

    /**
     * Sync site data from WordPress API.
     */
    public function sync(Request $request, Site $site, SiteSyncService $syncService)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        if (! $site->sync_enabled) {
            return Redirect::back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Sync not enabled',
                    'description' => 'Please enable sync for this site before attempting to sync data.',
                ]);
        }

        $success = $syncService->syncSiteData($site);

        if ($success) {
            return Redirect::back()
                ->with('toast', [
                    'type' => 'success',
                    'message' => 'Site data synced successfully',
                    'description' => 'The site information has been updated from the WordPress API.',
                ]);
        } else {
            return Redirect::back()
                ->with('toast', [
                    'type' => 'error',
                    'message' => 'Sync failed',
                    'description' => 'Failed to sync site data. Please check the API token and try again.',
                ]);
        }
    }

    /**
     * Show the form for editing API & Sync settings.
     */
    public function editApiSync(Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        return Inertia::render('sites/api-sync/Edit', [
            'site' => $site,
        ]);
    }

    /**
     * Update API & Sync settings.
     */
    public function updateApiSync(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $validated = $request->validate([
            'sync_enabled' => 'boolean',
            'api_token' => 'string|max:255',
        ]);

        $site->update($validated);

        return Inertia::render('sites/api-sync/Edit', [
            'site' => $site,
            'flash' => [
                'toast' => [
                    'type' => 'success',
                    'message' => 'API & Sync settings updated successfully',
                    'description' => "The API & Sync settings for {$site->name} have been updated.",
                ],
            ],
        ]);
    }
}
