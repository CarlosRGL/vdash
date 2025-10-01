<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get('/settings/profile');

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch('/settings/profile', [
            'name' => 'Test User',
            'email' => $user->email,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->delete('/settings/profile', [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/');

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from('/settings/profile')
        ->delete('/settings/profile', [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect('/settings/profile');

    expect($user->fresh())->not->toBeNull();
});

test('user can upload an avatar', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg');

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
            '_method' => 'patch',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();

    expect($user->getFirstMedia('avatar'))->not->toBeNull();
    expect($user->avatar)->not->toBeEmpty();
});

test('user can update their avatar', function () {
    $user = User::factory()->create();
    $oldFile = UploadedFile::fake()->image('old-avatar.jpg');

    // Upload initial avatar
    $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $oldFile,
            '_method' => 'patch',
        ]);

    $user->refresh();
    $oldMedia = $user->getFirstMedia('avatar');

    // Upload new avatar
    $newFile = UploadedFile::fake()->image('new-avatar.jpg');

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $newFile,
            '_method' => 'patch',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();
    $newMedia = $user->getFirstMedia('avatar');

    expect($newMedia->id)->not->toBe($oldMedia->id);
    expect($user->getMedia('avatar')->count())->toBe(1);
});

test('avatar must be an image', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->create('document.pdf', 100);

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
            '_method' => 'patch',
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('avatar must not exceed 2MB', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('large-avatar.jpg')->size(3000);

    $response = $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
            '_method' => 'patch',
        ]);

    $response->assertSessionHasErrors('avatar');
});

test('user can delete their avatar', function () {
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('avatar.jpg');

    // Upload avatar first
    $this
        ->actingAs($user)
        ->post('/settings/profile', [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
            '_method' => 'patch',
        ]);

    $user->refresh();
    expect($user->getFirstMedia('avatar'))->not->toBeNull();

    // Delete avatar
    $response = $this
        ->actingAs($user)
        ->delete('/settings/profile/avatar');

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/settings/profile');

    $user->refresh();
    expect($user->getFirstMedia('avatar'))->toBeNull();
});
