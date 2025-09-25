<?php

use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('authorized users can delete a user', function (): void {
    $admin = User::factory()->create();
    $user = User::factory()->create();

    $response = $this->actingAs($admin)->delete(route('users.destroy', $user));

    $response->assertRedirect(route('users.index'));
    expect(User::find($user->id))->toBeNull();
});

test('users cannot delete themselves from the edit screen', function (): void {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->delete(route('users.destroy', $user));

    $response->assertRedirect(route('users.edit', $user));
    $response->assertSessionHas('toast.type', 'error');
    expect(User::find($user->id))->not()->toBeNull();
});
