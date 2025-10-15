<?php

namespace App\Jobs;

use App\Models\Site;
use App\Services\PageSpeedInsightsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class RunPageSpeedInsightJob implements ShouldQueue
{
    use Queueable;

    public Site $site;

    public string $strategy;

    /**
     * Create a new job instance.
     */
    public function __construct(Site $site, string $strategy = 'mobile')
    {
        $this->site = $site;
        $this->strategy = $strategy;
    }

    /**
     * Execute the job.
     */
    public function handle(PageSpeedInsightsService $service): void
    {
        Log::info("Running PageSpeed Insights test for site {$this->site->id} ({$this->strategy})");

        $result = $service->runTest($this->site, $this->strategy);

        if ($result instanceof \App\Models\SitePageSpeedInsight) {
            Log::info("PageSpeed Insights test completed successfully for site {$this->site->id}");
        } else {
            Log::warning("PageSpeed Insights test failed for site {$this->site->id}");
        }
    }
}
