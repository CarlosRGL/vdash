<?php

namespace App\Http\Controllers;

use App\Models\Site;
use App\Models\SiteCredential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class SiteCredentialController extends Controller
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

        $site->load('credential');

        return Inertia::render('sites/credentials/Show', [
            'site' => $site,
            'credentials' => $site->credential ?? new SiteCredential(),
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

        $site->load('credential');

        return Inertia::render('sites/credentials/Edit', [
            'site' => $site,
            'credentials' => $site->credential ?? new SiteCredential(),
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
            'ftp_host' => 'nullable|string|max:255',
            'ftp_username' => 'nullable|string|max:255',
            'ftp_password' => 'nullable|string',
            'db_host' => 'nullable|string|max:255',
            'db_name' => 'nullable|string|max:255',
            'db_username' => 'nullable|string|max:255',
            'db_password' => 'nullable|string',
            'login_url' => 'nullable|string|max:255',
            'login_username' => 'nullable|string|max:255',
            'login_password' => 'nullable|string',
            'api_keys' => 'nullable|string',
        ]);

        if ($site->credential) {
            $site->credential->update($validated);
        } else {
            $site->credential()->create($validated);
        }

        return to_route('sites.credentials.edit', [
            'site' => $site,
            'credentials' => $site->credential ?? new SiteCredential(),
            'flash' => [
                'toast' => [
                    'type' => 'success',
                    'message' => 'Site credentials updated successfully',
                    'description' => "The credentials for site {$site->name} have been updated.",
                ],
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
