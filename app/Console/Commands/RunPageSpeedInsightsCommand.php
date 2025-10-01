<?php

namespace App\Console\Commands;

use App\Jobs\RunPageSpeedInsightJob;
use App\Models\Site;
use Illuminate\Console\Command;

class RunPageSpeedInsightsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sites:pagespeed-insights
                            {--site= : Specific site ID to test}
                            {--strategy=mobile : Strategy to use (mobile or desktop)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Run PageSpeed Insights tests for all sites or a specific site';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $siteId = $this->option('site');
        $strategy = $this->option('strategy');

        if (! in_array($strategy, ['mobile', 'desktop'])) {
            $this->error('Strategy must be either "mobile" or "desktop"');

            return self::FAILURE;
        }

        if ($siteId) {
            $site = Site::find($siteId);

            if (! $site) {
                $this->error("Site with ID {$siteId} not found");

                return self::FAILURE;
            }

            $this->info("Queuing PageSpeed Insights test for site: {$site->name} ({$strategy})");
            RunPageSpeedInsightJob::dispatch($site, $strategy);

            return self::SUCCESS;
        }

        $sites = Site::all();

        if ($sites->isEmpty()) {
            $this->warn('No sites found to test');

            return self::SUCCESS;
        }

        $this->info("Queuing PageSpeed Insights tests for {$sites->count()} sites ({$strategy})");

        foreach ($sites as $site) {
            RunPageSpeedInsightJob::dispatch($site, $strategy);
        }

        $this->info('All PageSpeed Insights tests have been queued');

        return self::SUCCESS;
    }
}
