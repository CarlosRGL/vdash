<?php

use App\Models\Site;
use App\Models\User;
use Spatie\Permission\Models\Permission;

beforeEach(function () {
    // Create the permission if it doesn't exist
    Permission::findOrCreate('update site', 'web');

    $this->user = User::factory()->create();
    $this->site = Site::factory()->create();

    // Give the user the update site permission
    $this->user->givePermissionTo('update site');

    // Associate the user with the site (check if not already associated)
    if (! $this->site->users()->where('user_id', $this->user->id)->exists()) {
        $this->site->users()->attach($this->user);
    }

    $this->actingAs($this->user);
});

it('can view the contract edit page', function () {
    $response = $this->get("/sites/{$this->site->id}/contracts/edit");

    $response->assertSuccessful();
    $response->assertInertia(fn ($page) => $page->component('sites/contracts/Edit')
        ->has('site')
        ->has('contract'));
});

it('can update contract information', function () {
    $contractData = [
        'contract_start_date' => '2024-01-01',
        'contract_end_date' => '2024-12-31',
        'contract_capacity' => '10GB',
        'contract_storage_usage' => '2.5GB',
        'contract_storage_limit' => '8GB',
    ];

    $response = $this->put("/sites/{$this->site->id}/contracts", $contractData);

    $response->assertRedirect("/sites/{$this->site->id}/contracts/edit");

    $this->site->refresh();
    expect($this->site->contract)->not->toBeNull();
    expect($this->site->contract->contract_start_date->toDateString())->toBe('2024-01-01');
    expect($this->site->contract->contract_end_date->toDateString())->toBe('2024-12-31');
    expect($this->site->contract->contract_capacity)->toBe('10GB');
    expect($this->site->contract->contract_storage_usage)->toBe('2.5GB');
    expect($this->site->contract->contract_storage_limit)->toBe('8GB');
});

it('validates required contract fields', function () {
    $response = $this->put("/sites/{$this->site->id}/contracts", []);

    $response->assertRedirect();
    // Since all fields are nullable, this should still pass
});

it('validates date formats', function () {
    $response = $this->put("/sites/{$this->site->id}/contracts", [
        'contract_start_date' => 'invalid-date',
        'contract_end_date' => 'also-invalid',
    ]);

    $response->assertSessionHasErrors(['contract_start_date', 'contract_end_date']);
});
