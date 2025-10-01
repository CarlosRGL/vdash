<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of all users with pagination.
     */
    public function index(Request $request): Response
    {
        $perPage = $request->input('perPage', 10);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $sortField = $request->input('sortField', 'id');
        $sortDirection = $request->input('sortDirection', 'asc');

        $query = User::with('roles');

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $users = $query->paginate($perPage);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'sortField' => $sortField,
                'sortDirection' => $sortDirection,
                'perPage' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        $roles = Role::all();

        return Inertia::render('users/create', [
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')
                ->toMediaCollection('avatar');
        }

        if ($request->has('roles')) {
            $roles = $this->resolveRoles($request->input('roles', []));

            $user->syncRoles($roles);
        }

        return to_route('users.index')->with('toast', [
            'type' => 'success',
            'message' => 'User created successfully',
            'description' => "The user {$request->name} has been added to the system.",
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user): Response
    {
        $user->load('roles');
        $roles = Role::all();

        return Inertia::render('users/edit', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'password' => $request->filled('password') ? ['confirmed', Rules\Password::defaults()] : '',
            'roles' => 'nullable|array',
            'roles.*' => 'integer|exists:roles,id',
            'avatar' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
        ]);

        $userData = [
            'name' => $request->name,
            'email' => $request->email,
        ];

        // Only update password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $user->addMediaFromRequest('avatar')
                ->toMediaCollection('avatar');
        }

        if ($request->has('roles')) {
            $roles = $this->resolveRoles($request->input('roles', []));

            $user->syncRoles($roles);
        }

        return to_route('users.index')->with('toast', [
            'type' => 'success',
            'message' => 'User updated successfully',
            'description' => "The user {$request->name} has been updated.",
        ]);
    }

    /**
     * Resolve the role identifiers into Role models.
     *
     * @param  array<int|string, int|string>  $roleIdentifiers
     * @return \Illuminate\Support\Collection<int, Role>
     */
    private function resolveRoles(array $roleIdentifiers): Collection
    {
        $identifiers = collect($roleIdentifiers)
            ->filter(fn ($identifier) => $identifier !== null && $identifier !== '')
            ->values();

        if ($identifiers->isEmpty()) {
            return collect();
        }

        $ids = $identifiers
            ->filter(fn ($identifier) => is_numeric($identifier))
            ->map(fn ($identifier) => (int) $identifier)
            ->values();

        $names = $identifiers
            ->reject(fn ($identifier) => is_numeric($identifier))
            ->map(fn ($identifier) => (string) $identifier)
            ->values();

        return Role::query()
            ->when($ids->isNotEmpty() && $names->isNotEmpty(), function ($query) use ($ids, $names) {
                $query->where(function ($innerQuery) use ($ids, $names) {
                    $innerQuery->whereIn('id', $ids)
                        ->orWhereIn('name', $names);
                });
            })
            ->when($ids->isNotEmpty() && $names->isEmpty(), fn ($query) => $query->whereIn('id', $ids))
            ->when($names->isNotEmpty() && $ids->isEmpty(), fn ($query) => $query->whereIn('name', $names))
            ->get();
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): RedirectResponse
    {
        if (request()->user()?->is($user)) {
            return to_route('users.edit', $user)->with('toast', [
                'type' => 'error',
                'message' => 'Unable to delete user',
                'description' => 'You cannot delete your own account from this screen.',
            ]);
        }

        $userName = $user->name;

        $user->delete();

        return to_route('users.index')->with('toast', [
            'type' => 'success',
            'message' => 'User deleted successfully',
            'description' => "The user {$userName} has been removed from the system.",
        ]);
    }
}
