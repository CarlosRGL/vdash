<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreToolRequest;
use App\Http\Requests\UpdateToolRequest;
use App\Models\Tool;
use App\Models\ToolCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ToolController extends Controller
{
    /**
     * Display a listing of the tool.
     */
    public function index(Request $request): Response
    {
        $query = Tool::with(['categories', 'media'])
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
                $q->where('tool_categories.id', $request->input('category'));
            });
        }

        // Filter by favorites
        if ($request->boolean('favorites')) {
            $query->whereHas('favoritedBy', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        $tools = $query->latest()->paginate(12)->through(function ($tool) {
            return [
                'id' => $tool->id,
                'title' => $tool->title,
                'image' => $tool->image,
                'url' => $tool->url,
                'login' => $tool->login,
                'password' => $tool->password,
                'api_key' => $tool->api_key,
                'description' => $tool->description,
                'categories' => $tool->categories,
                'media' => $tool->getMedia('attachments')->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                    'size' => $media->size,
                ]),
                'favorited_count' => $tool->favorited_by_count,
                'is_favorited' => $tool->isFavoritedBy(auth()->user()),
                'created_at' => $tool->created_at,
            ];
        });

        return Inertia::render('tools/Index', [
            'tools' => $tools,
            'categories' => ToolCategory::all(),
            'filters' => $request->only(['search', 'category', 'favorites']),
        ]);
    }

    /**
     * Show the form for creating a new tool.
     */
    public function create(): Response
    {
        return Inertia::render('tools/Create', [
            'categories' => ToolCategory::all(),
        ]);
    }

    /**
     * Store a newly created tool in storage.
     */
    public function store(StoreToolRequest $request): RedirectResponse
    {
        $tool = Tool::create($request->validated());

        // Sync categories
        if ($request->has('categories')) {
            $tool->categories()->sync($request->input('categories'));
        }

        // Handle media files
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $tool->addMedia($file)->toMediaCollection('attachments');
            }
        }

        return redirect()->route('tools.index')
            ->with('success', 'Tool created successfully.');
    }

    /**
     * Display the specified tool.
     */
    public function show(Tool $tool): Response
    {
        $tool->load(['categories', 'media', 'favoritedBy']);

        return Inertia::render('Tools/Show', [
            'tool' => [
                'id' => $tool->id,
                'title' => $tool->title,
                'image' => $tool->image,
                'url' => $tool->url,
                'login' => $tool->login,
                'password' => $tool->password,
                'api_key' => $tool->api_key,
                'description' => $tool->description,
                'categories' => $tool->categories,
                'media' => $tool->getMedia('attachments')->map(fn ($media) => [
                    'id' => $media->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                ]),
                'favorited_count' => $tool->favoritedBy->count(),
                'is_favorited' => $tool->isFavoritedBy(auth()->user()),
                'created_at' => $tool->created_at,
                'updated_at' => $tool->updated_at,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified tool.
     */
    public function edit(Tool $tool): Response
    {
        $tool->load(['categories', 'media']);

        return Inertia::render('tools/Edit', [
            'tool' => [
                'id' => $tool->id,
                'title' => $tool->title,
                'image' => $tool->image,
                'url' => $tool->url,
                'login' => $tool->login,
                'password' => $tool->password,
                'api_key' => $tool->api_key,
                'description' => $tool->description,
                'categories' => $tool->categories->pluck('id'),
                'media' => $tool->getMedia('attachments')->map(fn ($media) => [
                    'id' => $tool->id,
                    'name' => $media->name,
                    'url' => $media->getUrl(),
                ]),
            ],
            'categories' => ToolCategory::all(),
        ]);
    }

    /**
     * Update the specified tool in storage.
     */
    public function update(UpdateToolRequest $request, Tool $tool): RedirectResponse
    {
        $tool->update($request->validated());

        // Sync categories
        if ($request->has('categories')) {
            $tool->categories()->sync($request->input('categories'));
        }

        // Handle new media files
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $tool->addMedia($file)->toMediaCollection('attachments');
            }
        }

        return redirect()->route('tools.index')
            ->with('success', 'Tool updated successfully.');
    }

    /**
     * Remove the specified tool from storage.
     */
    public function destroy(Tool $tool): RedirectResponse
    {
        $tool->delete();

        return redirect()->route('tools.index')
            ->with('success', 'Tool deleted successfully.');
    }

    /**
     * Toggle favorite status for a tool.
     */
    public function toggleFavorite(Tool $tool): RedirectResponse
    {
        $user = auth()->user();

        if ($tool->isFavoritedBy($user)) {
            $tool->favoritedBy()->detach($user->id);
            $message = 'Tool removed from favorites.';
        } else {
            $tool->favoritedBy()->attach($user->id);
            $message = 'Tool added to favorites.';
        }

        return back()->with('success', $message);
    }
}
