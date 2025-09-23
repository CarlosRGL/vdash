<?php

namespace App\Jobs;

use App\Models\Site;
use App\Services\SiteSyncService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SyncSiteDataJob implements ShouldQueue
{
    use Queueable;

    public Site $site;

    /**
     * Create a new job instance.
     */
    public function __construct(Site $site)
    {
        $this->site = $site;
    }

    /**
     * Execute the job.
     */
    public function handle(SiteSyncService $syncService): void
    {
        if (! $this->site->sync_enabled) {
            Log::info("Skipping sync for site {$this->site->id}: sync not enabled");

            return;
        }

        Log::info("Starting scheduled sync for site {$this->site->id}");

        $success = $syncService->syncSiteData($this->site);

        if ($success) {
            Log::info("Scheduled sync completed successfully for site {$this->site->id}");
        } else {
            Log::warning("Scheduled sync failed for site {$this->site->id}");
        }
    }
}
