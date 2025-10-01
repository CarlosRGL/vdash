<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreResourceRequest;
use App\Http\Requests\UpdateResourceRequest;
use App\Models\Resource;
use App\Models\ResourceCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Resource::with(['categories', 'media'])
            ->withCount('favoritedBy');

        // Filter by search term
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('resource_categories.id', $request->input('category'));
            });
        }

        // Filter by favorites
        if ($request->boolean('favorites')) {
            $query->whereHas('favoritedBy', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        $resources = $query->latest()->paginate(12)->through(function ($resource) {
            return [
                'id' => $resource->id,
                'title' => $resource->title,
                'image' => $resource->image,
                'url' => $resource->url,
                'login' => $resource->login,
                'password' => $resource->password,
                'api_key' => $resource->api_key,
                'description' => $resource->description,
                'categories' => $resource->categories,
                'media' => $resource->getMedia('attachments')->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                    'size' => $media->size,
                ]),
                'favorited_count' => $resource->favorited_by_count,
                'is_favorited' => $resource->isFavoritedBy(auth()->user()),
                'created_at' => $resource->created_at,
            ];
        });

        return Inertia::render('resources/Index', [
            'resources' => $resources,
            'categories' => ResourceCategory::all(),
            'filters' => $request->only(['search', 'category', 'favorites']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('resources/Create', [
            'categories' => ResourceCategory::all(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreResourceRequest $request): RedirectResponse
    {
        $resource = Resource::create($request->validated());

        // Sync categories
        if ($request->has('categories')) {
            $resource->categories()->sync($request->input('categories'));
        }

        // Handle media files
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $resource->addMedia($file)->toMediaCollection('attachments');
            }
        }

        return redirect()->route('resources.index')
            ->with('success', 'Resource created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Resource $resource): Response
    {
        $resource->load(['categories', 'media', 'favoritedBy']);

        return Inertia::render('Resources/Show', [
            'resource' => [
                'id' => $resource->id,
                'title' => $resource->title,
                'image' => $resource->image,
                'url' => $resource->url,
                'login' => $resource->login,
                'password' => $resource->password,
                'api_key' => $resource->api_key,
                'description' => $resource->description,
                'categories' => $resource->categories,
                'media' => $resource->getMedia('attachments')->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                ]),
                'favorited_count' => $resource->favoritedBy->count(),
                'is_favorited' => $resource->isFavoritedBy(auth()->user()),
                'created_at' => $resource->created_at,
                'updated_at' => $resource->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Resource $resource): Response
    {
        $resource->load(['categories', 'media']);

        return Inertia::render('resources/Edit', [
            'resource' => [
                'id' => $resource->id,
                'title' => $resource->title,
                'image' => $resource->image,
                'url' => $resource->url,
                'login' => $resource->login,
                'password' => $resource->password,
                'api_key' => $resource->api_key,
                'description' => $resource->description,
                'categories' => $resource->categories->pluck('id'),
                'media' => $resource->getMedia('attachments')->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                ]),
            ],
            'categories' => ResourceCategory::all(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $resource->update($request->validated());

        // Sync categories
        if ($request->has('categories')) {
            $resource->categories()->sync($request->input('categories'));
        }

        // Handle new media files
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $resource->addMedia($file)->toMediaCollection('attachments');
            }
        }

        return redirect()->route('resources.index')
            ->with('success', 'Resource updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Resource $resource): RedirectResponse
    {
        $resource->delete();

        return redirect()->route('resources.index')
            ->with('success', 'Resource deleted successfully.');
    }

    /**
     * Toggle favorite status for a resource.
     */
    public function toggleFavorite(Resource $resource): RedirectResponse
    {
        $user = auth()->user();

        if ($resource->isFavoritedBy($user)) {
            $resource->favoritedBy()->detach($user->id);
            $message = 'Resource removed from favorites.';
        } else {
            $resource->favoritedBy()->attach($user->id);
            $message = 'Resource added to favorites.';
        }

        return back()->with('success', $message);
    }
}
