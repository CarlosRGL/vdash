<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $adminRole = Role::create(['name' => 'Admin']);
        $clientRole = Role::create(['name' => 'Client']);

        // Create permissions
        // Site permissions
        $viewAnySites = Permission::create(['name' => 'view any sites']);
        $viewSite = Permission::create(['name' => 'view site']);
        $createSite = Permission::create(['name' => 'create site']);
        $updateSite = Permission::create(['name' => 'update site']);
        $deleteSite = Permission::create(['name' => 'delete site']);
        $restoreSite = Permission::create(['name' => 'restore site']);
        $forceDeleteSite = Permission::create(['name' => 'force delete site']);

        // User permissions
        $viewAnyUsers = Permission::create(['name' => 'view any users']);
        $viewUser = Permission::create(['name' => 'view user']);
        $createUser = Permission::create(['name' => 'create user']);
        $updateUser = Permission::create(['name' => 'update user']);
        $deleteUser = Permission::create(['name' => 'delete user']);

        // Assign permissions to roles
        $adminRole->givePermissionTo([
            $viewAnySites, $viewSite, $createSite, $updateSite, $deleteSite, $restoreSite, $forceDeleteSite,
            $viewAnyUsers, $viewUser, $createUser, $updateUser, $deleteUser
        ]);

        $clientRole->givePermissionTo([
            $viewSite, $createSite, $updateSite, $deleteSite, $restoreSite
        ]);

        // Assign roles to users
        // Assign Admin role to the test user
        $adminUser = User::where('email', 'contact@carlosrgl.com')->first();
        if ($adminUser) {
            $adminUser->assignRole($adminRole);
        }

        // Assign Client role to other users
        User::where('email', '!=', 'contact@carlosrgl.com')->get()->each(function ($user) use ($clientRole) {
            $user->assignRole($clientRole);
        });
    }
}
