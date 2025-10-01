<?php

use App\Models\ResourceCategory;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

it('can create a new category', function () {
    $categoryData = [
        'name' => 'Test Category',
        'description' => 'A test category description',
        'color' => '#ff5733',
    ];

    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), $categoryData);

    $response->assertCreated()
        ->assertJson([
            'category' => [
                'name' => 'Test Category',
                'slug' => 'test-category',
                'description' => 'A test category description',
                'color' => '#ff5733',
            ],
        ]);

    $this->assertDatabaseHas('resource_categories', [
        'name' => 'Test Category',
        'slug' => 'test-category',
        'description' => 'A test category description',
        'color' => '#ff5733',
    ]);
});

it('requires name to create a category', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'description' => 'A test category',
            'color' => '#ff5733',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('requires color to create a category', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'name' => 'Test Category',
            'description' => 'A test category',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['color']);
});

it('validates color format', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'name' => 'Test Category',
            'description' => 'A test category',
            'color' => 'invalid-color',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['color']);
});

it('ensures category name is unique', function () {
    ResourceCategory::factory()->create(['name' => 'Existing Category']);

    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'name' => 'Existing Category',
            'description' => 'A test category',
            'color' => '#ff5733',
        ]);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['name']);
});

it('auto-generates slug from name', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'name' => 'Test Category Name',
            'color' => '#ff5733',
        ]);

    $response->assertCreated()
        ->assertJson([
            'category' => [
                'name' => 'Test Category Name',
                'slug' => 'test-category-name',
            ],
        ]);
});

it('allows category creation without description', function () {
    $response = $this->actingAs($this->user)
        ->postJson(route('categories.store'), [
            'name' => 'Test Category',
            'color' => '#ff5733',
        ]);

    $response->assertCreated()
        ->assertJson([
            'category' => [
                'name' => 'Test Category',
                'description' => null,
                'color' => '#ff5733',
            ],
        ]);
});

it('requires authentication to create a category', function () {
    $response = $this->postJson(route('categories.store'), [
        'name' => 'Test Category',
        'color' => '#ff5733',
    ]);

    $response->assertUnauthorized();
});
