<?php

use App\Models\Site;

test('site can have a last_sync timestamp', function () {
    $site = Site::factory()->create([
        'last_sync' => now(),
    ]);

    expect($site->last_sync)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
});

test('site last_sync can be null', function () {
    $site = Site::factory()->create([
        'last_sync' => null,
    ]);

    expect($site->last_sync)->toBeNull();
});

test('site last_sync is properly cast to datetime', function () {
    $now = now();
    $site = Site::factory()->create([
        'last_sync' => $now,
    ]);

    expect($site->last_sync)
        ->toBeInstanceOf(\Illuminate\Support\Carbon::class)
        ->format('Y-m-d H:i:s')->toBe($now->format('Y-m-d H:i:s'));
});

test('site last_sync can be updated', function () {
    $site = Site::factory()->create([
        'last_sync' => null,
    ]);

    $syncTime = now();
    $site->update(['last_sync' => $syncTime]);

    expect($site->fresh()->last_sync)
        ->toBeInstanceOf(\Illuminate\Support\Carbon::class)
        ->format('Y-m-d H:i:s')->toBe($syncTime->format('Y-m-d H:i:s'));
});
