<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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
        $adminRole = Role::firstOrCreate(['name' => 'Admin'], ['guard_name' => 'web']);
        $clientRole = Role::firstOrCreate(['name' => 'Client'], ['guard_name' => 'web']);

        // Create permissions
        // Site permissions
        $viewAnySites = Permission::firstOrCreate(['name' => 'view any sites'], ['guard_name' => 'web']);
        $viewSite = Permission::firstOrCreate(['name' => 'view site'], ['guard_name' => 'web']);
        $createSite = Permission::firstOrCreate(['name' => 'create site'], ['guard_name' => 'web']);
        $updateSite = Permission::firstOrCreate(['name' => 'update site'], ['guard_name' => 'web']);
        $deleteSite = Permission::firstOrCreate(['name' => 'delete site'], ['guard_name' => 'web']);
        $restoreSite = Permission::firstOrCreate(['name' => 'restore site'], ['guard_name' => 'web']);
        $forceDeleteSite = Permission::firstOrCreate(['name' => 'force delete site'], ['guard_name' => 'web']);

        // User permissions
        $viewAnyUsers = Permission::firstOrCreate(['name' => 'view any users'], ['guard_name' => 'web']);
        $viewUser = Permission::firstOrCreate(['name' => 'view user'], ['guard_name' => 'web']);
        $createUser = Permission::firstOrCreate(['name' => 'create user'], ['guard_name' => 'web']);
        $updateUser = Permission::firstOrCreate(['name' => 'update user'], ['guard_name' => 'web']);
        $deleteUser = Permission::firstOrCreate(['name' => 'delete user'], ['guard_name' => 'web']);

        // Assign permissions to roles
        $adminRole->givePermissionTo([
            $viewAnySites, $viewSite, $createSite, $updateSite, $deleteSite, $restoreSite, $forceDeleteSite,
            $viewAnyUsers, $viewUser, $createUser, $updateUser, $deleteUser,
        ]);

        $clientRole->givePermissionTo([
            $viewSite, $createSite, $updateSite, $deleteSite, $restoreSite,
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
