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
        User::factory(10)->create();

        // Create a specific user for testing
        User::factory()->create([
            'name' => 'carlosrgl',
            'email' => 'contact@carlosrgl.com',
            'password' => Hash::make('car13'),
        ]);

        // Seed roles and permissions
        $this->call([
            RolePermissionSeeder::class,
            SiteSeeder::class,
        ]);
    }
}
