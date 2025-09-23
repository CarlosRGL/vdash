<?php

use App\Models\Site;
use App\Models\User;
use App\Services\SiteSyncService;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->site = Site::factory()->create([
        'sync_enabled' => true,
        'api_token' => 'test-token',
        'url' => 'https://example.com',
    ]);

    // Mock Gate to allow all actions for testing
    Gate::define('update', fn () => true);
});

test('sync can be triggered for enabled site', function () {
    $this->actingAs($this->user);

    $response = $this->post(route('sites.sync', $this->site));

    $response->assertRedirect();
});

test('sync fails for disabled site', function () {
    $this->site->update(['sync_enabled' => false]);
    $this->actingAs($this->user);

    $response = $this->post(route('sites.sync', $this->site));

    $response->assertRedirect()
        ->assertSessionHas('toast.type', 'error');
});

test('site sync service can update site data', function () {
    Http::fake([
        'example.com/wp-json/teamtreize/v1/system-info/test-token' => Http::response([
            'php' => [
                'version' => '8.4.12',
                'memory_limit' => '1024M',
                'max_execution_time' => '300',
            ],
            'mysql' => [
                'version' => '10.10.7',
                'server_info' => '10.10.7-MariaDB',
            ],
            'wordpress' => [
                'version' => '6.8.2',
                'is_multisite' => false,
            ],
            'contract' => [
                'start_date' => '2025-05-01',
                'end_date' => '2026-05-01',
                'capacity' => '5',
                'storage' => [
                    'usage_gb' => 2.58,
                ],
            ],
        ], 200),
    ]);

    $syncService = new SiteSyncService();
    $result = $syncService->syncSiteData($this->site);

    expect($result)->toBeTrue();

    $this->site->refresh();
    expect($this->site->wordpress_version)->toBe('6.8.2');
    expect($this->site->is_multisite)->toBeFalse();
});
