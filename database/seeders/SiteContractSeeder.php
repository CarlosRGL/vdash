<?php

namespace Database\Seeders;

use App\Models\Site;
use App\Models\SiteContract;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SiteContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all sites that don't already have contracts
        $sitesWithoutContracts = Site::whereDoesntHave('contract')->get();

        $this->command->info("Found {$sitesWithoutContracts->count()} sites without contracts.");

        // Create contracts for approximately 70% of sites (some sites might not have contracts)
        $sitesToCreateContractsFor = $sitesWithoutContracts->random(
            min($sitesWithoutContracts->count(), (int) ($sitesWithoutContracts->count() * 0.7))
        );

        $this->command->info("Creating contracts for {$sitesToCreateContractsFor->count()} sites...");

        $sitesToCreateContractsFor->each(function (Site $site) {
            SiteContract::factory()->create([
                'site_id' => $site->id,
            ]);

            $this->command->info("Created contract for site: {$site->name}");
        });

        $this->command->info('Site contracts seeded successfully!');
    }
}
