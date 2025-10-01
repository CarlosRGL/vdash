<?php

use App\Models\Tool;
use App\Models\ToolCategory;
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

it('displays tools index page', function () {
    $tools = Tool::factory()->count(3)->create();
    $categories = ToolCategory::factory()->count(2)->create();

    get(route('tools.index'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('tools/Index')
            ->has('tools.data', 3)
            ->has('categories', 2)
            ->has('tools.data.0.login')
            ->has('tools.data.0.password')
            ->has('tools.data.0.api_key'));
});

it('can search tools', function () {
    Tool::factory()->create(['title' => 'Laravel Documentation']);
    Tool::factory()->create(['title' => 'React Guide']);

    get(route('tools.index', ['search' => 'Laravel']))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('tools.data', 1)
            ->where('tools.data.0.title', 'Laravel Documentation'));
});

it('can filter tools by category', function () {
    $category = ToolCategory::factory()->create();
    $tool1 = Tool::factory()->create();
    $tool2 = Tool::factory()->create();

    $tool1->categories()->attach($category);

    get(route('tools.index', ['category' => $category->id]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('tools.data', 1)
            ->where('tools.data.0.id', $tool1->id));
});

it('can filter favorite tools', function () {
    $tool1 = Tool::factory()->create();
    $tool2 = Tool::factory()->create();

    $this->user->favoriteTools()->attach($tool1);

    get(route('tools.index', ['favorites' => true]))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->has('tools.data', 1)
            ->where('tools.data.0.id', $tool1->id));
});

it('displays create tool page', function () {
    $categories = ToolCategory::factory()->count(3)->create();

    get(route('tools.create'))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('tools/Create')
            ->has('categories', 3));
});

it('can create a tool', function () {
    $categories = ToolCategory::factory()->count(2)->create();

    $data = [
        'title' => 'Test Tool',
        'description' => 'Test description',
        'url' => 'https://example.com',
        'login' => 'testuser',
        'password' => 'testpass',
        'api_key' => 'test-api-key',
        'categories' => $categories->pluck('id')->toArray(),
    ];

    post(route('tools.store'), $data)
        ->assertRedirect(route('tools.index'));

    assertDatabaseHas('tools', [
        'title' => 'Test Tool',
        'url' => 'https://example.com',
        'login' => 'testuser',
    ]);

    $tool = Tool::where('title', 'Test Tool')->first();
    expect($tool->categories)->toHaveCount(2);
    expect($tool->password)->toBe('testpass');
    expect($tool->api_key)->toBe('test-api-key');
});

it('validates required fields when creating a tool', function () {
    post(route('tools.store'), [])
        ->assertSessionHasErrors(['title']);
});

it('validates url format when creating a tool', function () {
    post(route('tools.store'), [
        'title' => 'Test Tool',
        'url' => 'not-a-valid-url',
    ])
        ->assertSessionHasErrors(['url']);
});

it('can upload media files when creating a tool', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->create('document.pdf', 100);

    post(route('tools.store'), [
        'title' => 'Test Tool',
        'media' => [$file],
    ])
        ->assertRedirect(route('tools.index'));

    $tool = Tool::where('title', 'Test Tool')->first();
    expect($tool->getMedia('attachments'))->toHaveCount(1);
});

it('displays show tool page', function () {
    $tool = Tool::factory()->create();
    $categories = ToolCategory::factory()->count(2)->create();
    $tool->categories()->attach($categories);

    get(route('tools.show', $tool))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('tools/Show')
            ->where('tool.id', $tool->id)
            ->where('tool.title', $tool->title)
            ->has('tool.categories', 2));
});

it('displays edit tool page', function () {
    $tool = Tool::factory()->create();
    $categories = ToolCategory::factory()->count(3)->create();

    get(route('tools.edit', $tool))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('tools/Edit')
            ->where('tool.id', $tool->id)
            ->has('categories', 3));
});

it('can update a tool', function () {
    $tool = Tool::factory()->create(['title' => 'Old Title']);
    $category = ToolCategory::factory()->create();

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'categories' => [$category->id],
    ];

    put(route('tools.update', $tool), $data)
        ->assertRedirect(route('tools.index'));

    assertDatabaseHas('tools', [
        'id' => $tool->id,
        'title' => 'Updated Title',
    ]);

    $tool->refresh();
    expect($tool->categories)->toHaveCount(1);
});

it('can delete a tool', function () {
    $tool = Tool::factory()->create();

    delete(route('tools.destroy', $tool))
        ->assertRedirect(route('tools.index'));

    assertDatabaseMissing('tools', [
        'id' => $tool->id,
        'deleted_at' => null,
    ]);
});

it('can toggle favorite on a tool', function () {
    $tool = Tool::factory()->create();

    // Add to favorites
    post(route('tools.favorite', $tool))
        ->assertRedirect();

    assertDatabaseHas('tool_user_favorites', [
        'user_id' => $this->user->id,
        'tool_id' => $tool->id,
    ]);

    expect($tool->isFavoritedBy($this->user))->toBeTrue();

    // Remove from favorites
    post(route('tools.favorite', $tool))
        ->assertRedirect();

    assertDatabaseMissing('tool_user_favorites', [
        'user_id' => $this->user->id,
        'tool_id' => $tool->id,
    ]);
});

it('tracks favorite count correctly', function () {
    $tool = Tool::factory()->create();
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $tool->favoritedBy()->attach([$user1->id, $user2->id]);

    $tool->loadCount('favoritedBy');
    expect($tool->favorited_by_count)->toBe(2);
});

it('syncs categories correctly when updating', function () {
    $tool = Tool::factory()->create();
    $categories = ToolCategory::factory()->count(3)->create();

    // Attach first two categories
    $tool->categories()->attach($categories->take(2));
    expect($tool->categories)->toHaveCount(2);

    // Update to only have the third category
    put(route('tools.update', $tool), [
        'title' => $tool->title,
        'categories' => [$categories->last()->id],
    ]);

    $tool->refresh();
    expect($tool->categories)->toHaveCount(1);
    expect($tool->categories->first()->id)->toBe($categories->last()->id);
});

it('soft deletes tools', function () {
    $tool = Tool::factory()->create();

    delete(route('tools.destroy', $tool));

    // Tool should still exist in database with deleted_at
    expect(Tool::withTrashed()->find($tool->id))->not->toBeNull();
    expect(Tool::find($tool->id))->toBeNull();
});

it('cascades delete to favorites when tool is deleted', function () {
    $tool = Tool::factory()->create();
    $tool->favoritedBy()->attach($this->user->id);

    assertDatabaseHas('tool_user_favorites', [
        'tool_id' => $tool->id,
        'user_id' => $this->user->id,
    ]);

    $tool->forceDelete(); // Force delete to trigger cascade

    assertDatabaseMissing('tool_user_favorites', [
        'tool_id' => $tool->id,
    ]);
});

it('validates url when fetching metadata', function () {
    $this->postJson(route('tools.fetch-metadata'), [])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['url']);

    $this->postJson(route('tools.fetch-metadata'), ['url' => 'not-a-valid-url'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

it('can fetch metadata from a valid url', function () {
    // This test would require mocking HTTP requests
    // Since we're testing with a real URL, we'll skip for now
    // In production, you'd want to mock the HTTP client
    expect(true)->toBeTrue();
})->skip('Requires HTTP mocking');
