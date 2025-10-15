<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteContract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class SiteContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Site $site)
    {
        if (Gate::denies('view', $site)) {
            abort(403);
        }

        $site->load('contract');

        return Inertia::render('sites/contracts/Show', [
            'site' => $site,
            'contract' => $site->contract ?? new SiteContract(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $site->load('contract');

        return Inertia::render('sites/contracts/Edit', [
            'site' => $site,
            'contract' => $site->contract ?? new SiteContract(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Site $site)
    {
        if (Gate::denies('update', $site)) {
            abort(403);
        }

        $validated = $request->validate([
            'contract_start_date' => 'nullable|date',
            'contract_end_date' => 'nullable|date',
            'contract_capacity' => 'nullable|string|max:255',
            'contract_storage_usage' => 'nullable|string|max:255',
            'contract_storage_limit' => 'nullable|string|max:255',
        ]);

        if ($site->contract) {
            $site->contract->update($validated);
        } else {
            $site->contract()->create($validated);
        }

        return Inertia::Render('sites/contracts/Edit', [
            'site' => $site,
            'contract' => $site->contract ?? new SiteContract(),
            'flash' => [
                'toast' => [
                    'type' => 'success',
                    'message' => 'Site contract updated successfully',
                    'description' => "The contract information for site {$site->name} has been updated.",
                ],
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Site $site)
    {
        if (Gate::denies('delete', $site)) {
            abort(403);
        }

        $site->contract?->delete();

        return Redirect::route('sites.show', $site)
            ->with('success', __('Site contract deleted successfully.'));
    }
}
