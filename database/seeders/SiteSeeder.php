<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\SiteCredential;
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

        // Create 10 sites with credentials
        Site::factory(10)
            ->recycle($users) // Assign sites to existing users
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // Create some specific site types
        // WordPress sites
        Site::factory(3)
            ->wordpress()
            ->quai13() // Assign to Quai13 team
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // Laravel sites
        Site::factory(3)
            ->laravel()
            ->vernalis() // Assign to Vernalis team
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // Drupal sites
        Site::factory(3)
            ->drupal()
            ->quai13()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // SPIP sites
        Site::factory(3)
            ->spip()
            ->vernalis()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // Typo3 sites
        Site::factory(3)
            ->typo3()
            ->quai13()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();

        // Symfony sites
        Site::factory(3)
            ->symfony()
            ->vernalis()
            ->recycle($users)
            ->has(SiteCredential::factory(), 'credential')
            ->create();
    }
}
