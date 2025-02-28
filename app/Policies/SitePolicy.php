<?php

namespace App\Policies;

use App\Models\Site;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SitePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Only admins can view all sites
        return $user->hasRole('Admin') || $user->hasPermissionTo('view any sites');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Site $site): bool
    {
        // Users can view their own sites or admins can view any site
        return $user->id === $site->user_id || $user->hasRole('Admin') || $user->hasPermissionTo('view site');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // All authenticated users can create sites if they have permission
        return $user->hasPermissionTo('create site');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Site $site): bool
    {
        // Users can update their own sites or admins can update any site
        return ($user->id === $site->user_id && $user->hasPermissionTo('update site')) ||
               $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Site $site): bool
    {
        // Users can delete their own sites or admins can delete any site
        return ($user->id === $site->user_id && $user->hasPermissionTo('delete site')) ||
               $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Site $site): bool
    {
        // Users can restore their own sites or admins can restore any site
        return ($user->id === $site->user_id && $user->hasPermissionTo('restore site')) ||
               $user->hasRole('Admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Site $site): bool
    {
        // Only admins can permanently delete sites
        return $user->hasRole('Admin') || $user->hasPermissionTo('force delete site');
    }
}
