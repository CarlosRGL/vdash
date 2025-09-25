<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create 10 random users
        // User::factory(10)->create();

        // Create a specific user for testing
        User::factory()->create([
            'name' => 'carlosrgl',
            'email' => 'carlos@quai13.com',
            'password' => Hash::make('car13'),
        ]);
        User::factory()->create([
            'name' => 'Ludovic',
            'email' => 'ludovic@quai13.com',
            'password' => Hash::make('ludovic13'),
        ]);

        // Seed roles and permissions
        $this->call([
            RolePermissionSeeder::class,
            SiteSeeder::class,
            SiteContractSeeder::class,
        ]);
    }
}
