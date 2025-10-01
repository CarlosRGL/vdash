<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SiteContractSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // No dummy contracts will be created during seeding
        // Contracts should be created manually through the application
        // or via specific data imports when real contract information is available

        $this->command->info('SiteContractSeeder: Skipping dummy contract creation.');
        $this->command->info('Contracts will be created manually when real contract data is available.');
    }
}
