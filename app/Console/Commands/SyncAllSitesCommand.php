<?php

namespace App\Console\Commands;

use App\Jobs\SyncSiteDataJob;
use App\Models\Site;
use Illuminate\Console\Command;

class SyncAllSitesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sites:sync-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync data for all sites that have sync enabled';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $sitesWithSyncEnabled = Site::where('sync_enabled', true)->get();

        if ($sitesWithSyncEnabled->isEmpty()) {
            $this->info('No sites have sync enabled.');

            return Command::SUCCESS;
        }

        $this->info("Found {$sitesWithSyncEnabled->count()} sites with sync enabled.");

        foreach ($sitesWithSyncEnabled as $site) {
            $this->line("Dispatching sync job for site: {$site->name} (ID: {$site->id})");
            SyncSiteDataJob::dispatch($site);
        }

        $this->info('All sync jobs have been dispatched to the queue.');

        return Command::SUCCESS;
    }
}
