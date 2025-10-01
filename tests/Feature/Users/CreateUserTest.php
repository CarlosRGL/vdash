<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    app(PermissionRegistrar::class)->forgetCachedPermissions();
});

test('a user can be created with role identifiers', function (): void {
    $admin = User::factory()->create();
    $role = Role::create(['name' => 'Admin']);

    $response = $this->actingAs($admin)->post(route('users.store'), [
        'name' => 'New User',
        'email' => 'new-user@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => [$role->id],
    ]);

    $response->assertRedirect(route('users.index'));
    $response->assertSessionHas('toast.type', 'success');

    $createdUser = User::where('email', 'new-user@example.com')->first();

    expect($createdUser)->not->toBeNull();
    expect($createdUser->hasRole('Admin'))->toBeTrue();
});

test('creating a user with a non existent role fails validation', function (): void {
    $admin = User::factory()->create();

    $response = $this->actingAs($admin)->from(route('users.create'))->post(route('users.store'), [
        'name' => 'Invalid Role User',
        'email' => 'invalid-role@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
        'roles' => [999],
    ]);

    $response->assertRedirect(route('users.create'));
    $response->assertSessionHasErrors(['roles.0']);
});
