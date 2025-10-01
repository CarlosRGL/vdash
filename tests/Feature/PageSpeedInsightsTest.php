<?php

use App\Jobs\RunPageSpeedInsightJob;
use App\Models\Site;
use App\Models\SitePageSpeedInsight;
use App\Services\PageSpeedInsightsService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;

use function Pest\Laravel\artisan;

test('pagespeed insights can be created for a site', function () {
    $site = Site::factory()->create();

    $insight = SitePageSpeedInsight::factory()->create([
        'site_id' => $site->id,
        'strategy' => 'mobile',
        'performance_score' => 0.95,
    ]);

    expect($insight->site->id)->toBe($site->id);
    expect($insight->strategy)->toBe('mobile');
    expect($insight->performance_score)->toBe('0.95');
});

test('site has many pagespeed insights relationship', function () {
    $site = Site::factory()->create();

    SitePageSpeedInsight::factory()->count(3)->create([
        'site_id' => $site->id,
    ]);

    expect($site->pageSpeedInsights()->count())->toBe(3);
});

test('pagespeed insights job can be dispatched', function () {
    Queue::fake();

    $site = Site::factory()->create();

    RunPageSpeedInsightJob::dispatch($site, 'mobile');

    Queue::assertPushed(RunPageSpeedInsightJob::class);
});

test('pagespeed insights command queues jobs for all sites', function () {
    Queue::fake();

    Site::factory()->count(3)->create();

    artisan('sites:pagespeed-insights')
        ->expectsOutput('Queuing PageSpeed Insights tests for 3 sites (mobile)')
        ->assertSuccessful();

    Queue::assertPushed(RunPageSpeedInsightJob::class, 3);
});

test('pagespeed insights command can target specific site', function () {
    Queue::fake();

    $site = Site::factory()->create(['name' => 'Test Site']);

    artisan('sites:pagespeed-insights', ['--site' => $site->id])
        ->expectsOutput('Queuing PageSpeed Insights test for site: Test Site (mobile)')
        ->assertSuccessful();

    Queue::assertPushed(RunPageSpeedInsightJob::class, 1);
});

test('pagespeed insights command validates strategy option', function () {
    artisan('sites:pagespeed-insights', ['--strategy' => 'invalid'])
        ->expectsOutput('Strategy must be either "mobile" or "desktop"')
        ->assertFailed();
});

test('pagespeed insights service stores results correctly', function () {
    config(['services.google_pagespeed.api_key' => 'test-api-key']);

    $site = Site::factory()->create(['url' => 'https://example.com']);

    $mockResponse = [
        'lighthouseResult' => [
            'categories' => [
                'performance' => ['score' => 0.96],
                'accessibility' => ['score' => 0.88],
                'best-practices' => ['score' => 0.92],
                'seo' => ['score' => 0.90],
            ],
            'audits' => [
                'first-contentful-paint' => ['numericValue' => 1500],
                'speed-index' => ['numericValue' => 2300],
                'largest-contentful-paint' => ['numericValue' => 2500],
                'interactive' => ['numericValue' => 3500],
                'total-blocking-time' => ['numericValue' => 150],
                'cumulative-layout-shift' => ['numericValue' => 100],
            ],
        ],
    ];

    Http::fake([
        'https://www.googleapis.com/pagespeedonline/v5/runPagespeed*' => Http::response($mockResponse, 200),
    ]);

    $service = new PageSpeedInsightsService;
    $result = $service->runTest($site, 'mobile');

    expect($result)->not->toBeNull();
    expect($result->site_id)->toBe($site->id);
    expect($result->strategy)->toBe('mobile');
    expect($result->performance_score)->toBe('0.96');
    expect($result->accessibility_score)->toBe('0.88');
    expect($result->first_contentful_paint)->toBe(1500);
});

test('pagespeed insights service handles api errors gracefully', function () {
    config(['services.google_pagespeed.api_key' => 'test-api-key']);

    $site = Site::factory()->create(['url' => 'https://example.com']);

    Http::fake([
        'https://www.googleapis.com/pagespeedonline/v5/runPagespeed*' => Http::response(['error' => 'API Error'], 500),
    ]);

    $service = new PageSpeedInsightsService;
    $result = $service->runTest($site, 'mobile');

    expect($result)->toBeNull();
});
