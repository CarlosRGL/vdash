<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\User;
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
            ->when(!Gate::allows('viewAny', Site::class), function ($query) {
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

        // Apply sorting
        $sortField = $request->input('sortField', 'name');
        $sortDirection = $request->input('sortDirection', 'asc');
        $allowedSortFields = ['name', 'url', 'type', 'team', 'created_at', 'php_version', 'last_check', 'contract_start_date', 'contract_end_date'];

        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('name', 'asc');
        }

        // Apply pagination
        $perPage = $request->input('perPage', 10);
        $sites = $query->paginate($perPage)->withQueryString();



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

        $site->load(['users', 'credential' => function ($query) {
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
        ]);

        $site->update($validated);

        // Update user assignments if provided
        if (isset($validated['user_ids'])) {
            $site->users()->sync($validated['user_ids']);
        }

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
}
