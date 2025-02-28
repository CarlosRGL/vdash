<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\SiteCredential;
use App\Models\SiteMetric;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users
        $users = User::all();

        if ($users->isEmpty()) {
            // Create users if none exist
            $users = User::factory(5)->create();
        }

        // Create 20 sites with credentials and metrics
        Site::factory(20)
            ->recycle($users) // Assign sites to existing users
            ->has(SiteCredential::factory(), 'credential')
            ->has(SiteMetric::factory()->count(rand(1, 5)), 'metrics')
            ->create();

        // Create some specific site types
        // WordPress sites
        Site::factory(5)
            ->wordpress()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->has(SiteMetric::factory()->count(rand(1, 3)), 'metrics')
            ->create();

        // Laravel sites
        Site::factory(5)
            ->laravel()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->has(SiteMetric::factory()->count(rand(1, 3)), 'metrics')
            ->create();

        // Sites in maintenance
        Site::factory(3)
            ->maintenance()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->has(SiteMetric::factory()->count(rand(1, 3)), 'metrics')
            ->create();

        // Inactive sites
        Site::factory(2)
            ->inactive()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->has(SiteMetric::factory()->count(rand(1, 3)), 'metrics')
            ->create();
    }
}
