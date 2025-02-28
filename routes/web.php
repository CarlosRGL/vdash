<?php

use App\Http\Controllers\SiteController;
use App\Http\Controllers\SiteCredentialController;
use App\Http\Controllers\SiteMetricController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Users routes
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');

    // Sites routes
    Route::resource('sites', SiteController::class);

    // Site credentials routes
    Route::get('sites/{site}/credentials', [SiteCredentialController::class, 'show'])->name('sites.credentials.show');
    Route::get('sites/{site}/credentials/edit', [SiteCredentialController::class, 'edit'])->name('sites.credentials.edit');
    Route::put('sites/{site}/credentials', [SiteCredentialController::class, 'update'])->name('sites.credentials.update');

    // Site metrics routes
    Route::get('sites/{site}/metrics', [SiteMetricController::class, 'index'])->name('sites.metrics.index');
    Route::post('sites/{site}/metrics/refresh', [SiteMetricController::class, 'refresh'])->name('sites.metrics.refresh');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
