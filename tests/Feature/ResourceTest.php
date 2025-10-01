<?php

use App\Models\Resource;
use App\Models\ResourceCategory;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\assertDatabaseHas;
use function Pest\Laravel\assertDatabaseMissing;
use function Pest\Laravel\delete;
use function Pest\Laravel\get;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

beforeEach(function () {
    $this->user = User::factory()->create();
    actingAs($this->user);
});

it('displays resources index page', function () {
    $resources = Resource::factory()->count(3)->create();
    $categories = ResourceCategory::factory()->count(2)->create();

    get(route('resources.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Resources/Index')
            ->has('resources.data', 3)
            ->has('categories', 2));
});

it('can search resources', function () {
    Resource::factory()->create(['title' => 'Laravel Documentation']);
    Resource::factory()->create(['title' => 'React Guide']);

    get(route('resources.index', ['search' => 'Laravel']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'Laravel Documentation'));
});

it('can filter resources by category', function () {
    $category = ResourceCategory::factory()->create();
    $resource1 = Resource::factory()->create();
    $resource2 = Resource::factory()->create();

    $resource1->categories()->attach($category);

    get(route('resources.index', ['category' => $category->id]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('resources.data', 1)
            ->where('resources.data.0.id', $resource1->id));
});

it('can filter favorite resources', function () {
    $resource1 = Resource::factory()->create();
    $resource2 = Resource::factory()->create();

    $this->user->favoriteResources()->attach($resource1);

    get(route('resources.index', ['favorites' => true]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('resources.data', 1)
            ->where('resources.data.0.id', $resource1->id));
});

it('displays create resource page', function () {
    $categories = ResourceCategory::factory()->count(3)->create();

    get(route('resources.create'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Resources/Create')
            ->has('categories', 3));
});

it('can create a resource', function () {
    $categories = ResourceCategory::factory()->count(2)->create();

    $data = [
        'title' => 'Test Resource',
        'description' => 'Test description',
        'url' => 'https://example.com',
        'login' => 'testuser',
        'password' => 'testpass',
        'api_key' => 'test-api-key',
        'categories' => $categories->pluck('id')->toArray(),
    ];

    post(route('resources.store'), $data)
        ->assertRedirect(route('resources.index'));

    assertDatabaseHas('resources', [
        'title' => 'Test Resource',
        'url' => 'https://example.com',
        'login' => 'testuser',
    ]);

    $resource = Resource::where('title', 'Test Resource')->first();
    expect($resource->categories)->toHaveCount(2);
    expect($resource->password)->toBe('testpass');
    expect($resource->api_key)->toBe('test-api-key');
});

it('validates required fields when creating a resource', function () {
    post(route('resources.store'), [])
        ->assertSessionHasErrors(['title']);
});

it('validates url format when creating a resource', function () {
    post(route('resources.store'), [
        'title' => 'Test Resource',
        'url' => 'not-a-valid-url',
    ])
        ->assertSessionHasErrors(['url']);
});

it('can upload media files when creating a resource', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('document.pdf', 100);

    post(route('resources.store'), [
        'title' => 'Test Resource',
        'media' => [$file],
    ])
        ->assertRedirect(route('resources.index'));

    $resource = Resource::where('title', 'Test Resource')->first();
    expect($resource->getMedia('attachments'))->toHaveCount(1);
});

it('displays show resource page', function () {
    $resource = Resource::factory()->create();
    $categories = ResourceCategory::factory()->count(2)->create();
    $resource->categories()->attach($categories);

    get(route('resources.show', $resource))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Resources/Show')
            ->where('resource.id', $resource->id)
            ->where('resource.title', $resource->title)
            ->has('resource.categories', 2));
});

it('displays edit resource page', function () {
    $resource = Resource::factory()->create();
    $categories = ResourceCategory::factory()->count(3)->create();

    get(route('resources.edit', $resource))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('Resources/Edit')
            ->where('resource.id', $resource->id)
            ->has('categories', 3));
});

it('can update a resource', function () {
    $resource = Resource::factory()->create(['title' => 'Old Title']);
    $category = ResourceCategory::factory()->create();

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'categories' => [$category->id],
    ];

    put(route('resources.update', $resource), $data)
        ->assertRedirect(route('resources.index'));

    assertDatabaseHas('resources', [
        'id' => $resource->id,
        'title' => 'Updated Title',
    ]);

    $resource->refresh();
    expect($resource->categories)->toHaveCount(1);
});

it('can delete a resource', function () {
    $resource = Resource::factory()->create();

    delete(route('resources.destroy', $resource))
        ->assertRedirect(route('resources.index'));

    assertDatabaseMissing('resources', [
        'id' => $resource->id,
        'deleted_at' => null,
    ]);
});

it('can toggle favorite on a resource', function () {
    $resource = Resource::factory()->create();

    // Add to favorites
    post(route('resources.favorite', $resource))
        ->assertRedirect();

    assertDatabaseHas('resource_user_favorites', [
        'user_id' => $this->user->id,
        'resource_id' => $resource->id,
    ]);

    expect($resource->isFavoritedBy($this->user))->toBeTrue();

    // Remove from favorites
    post(route('resources.favorite', $resource))
        ->assertRedirect();

    assertDatabaseMissing('resource_user_favorites', [
        'user_id' => $this->user->id,
        'resource_id' => $resource->id,
    ]);
});

it('tracks favorite count correctly', function () {
    $resource = Resource::factory()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $resource->favoritedBy()->attach([$user1->id, $user2->id]);

    $resource->loadCount('favoritedBy');
    expect($resource->favorited_by_count)->toBe(2);
});

it('syncs categories correctly when updating', function () {
    $resource = Resource::factory()->create();
    $categories = ResourceCategory::factory()->count(3)->create();

    // Attach first two categories
    $resource->categories()->attach($categories->take(2));
    expect($resource->categories)->toHaveCount(2);

    // Update to only have the third category
    put(route('resources.update', $resource), [
        'title' => $resource->title,
        'categories' => [$categories->last()->id],
    ]);

    $resource->refresh();
    expect($resource->categories)->toHaveCount(1);
    expect($resource->categories->first()->id)->toBe($categories->last()->id);
});

it('soft deletes resources', function () {
    $resource = Resource::factory()->create();

    delete(route('resources.destroy', $resource));

    // Resource should still exist in database with deleted_at
    expect(Resource::withTrashed()->find($resource->id))->not->toBeNull();
    expect(Resource::find($resource->id))->toBeNull();
});

it('cascades delete to favorites when resource is deleted', function () {
    $resource = Resource::factory()->create();
    $resource->favoritedBy()->attach($this->user->id);

    assertDatabaseHas('resource_user_favorites', [
        'resource_id' => $resource->id,
        'user_id' => $this->user->id,
    ]);

    $resource->forceDelete(); // Force delete to trigger cascade

    assertDatabaseMissing('resource_user_favorites', [
        'resource_id' => $resource->id,
    ]);
});
