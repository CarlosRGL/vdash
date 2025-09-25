<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SiteContractController;
use App\Http\Controllers\SiteController;
use App\Http\Controllers\SiteCredentialController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Users routes
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');

    // Sites routes
    Route::resource('sites', SiteController::class);
    Route::get('sites/{site}/destroy', [SiteController::class, 'destroy'])->name('sites.destroy');
    // Site sync routes
    Route::post('sites/{site}/sync', [SiteController::class, 'sync'])
        ->name('sites.sync');

    // Site user assignment routes
    Route::post('sites/{site}/users', [SiteController::class, 'assignUsers'])
        ->name('sites.users.assign');
    Route::delete('sites/{site}/users/{user}', [SiteController::class, 'removeUser'])
        ->name('sites.users.remove');

    // Site credentials routes
    Route::get('sites/{site}/credentials', [SiteCredentialController::class, 'show'])
        ->name('sites.credentials.show');
    Route::get('sites/{site}/credentials/edit', [SiteCredentialController::class, 'edit'])
        ->name('sites.credentials.edit');
    Route::put('sites/{site}/credentials', [SiteCredentialController::class, 'update'])
        ->name('sites.credentials.update');

    // Site contracts routes
    Route::get('sites/{site}/contracts', [SiteContractController::class, 'show'])
        ->name('sites.contracts.show');
    Route::get('sites/{site}/contracts/edit', [SiteContractController::class, 'edit'])
        ->name('sites.contracts.edit');
    Route::put('sites/{site}/contracts', [SiteContractController::class, 'update'])
        ->name('sites.contracts.update');
    Route::delete('sites/{site}/contracts', [SiteContractController::class, 'destroy'])
        ->name('sites.contracts.destroy');

    // Site API & Sync routes
    Route::get('sites/{site}/api-sync', [SiteController::class, 'editApiSync'])
        ->name('sites.api-sync.edit');
    Route::put('sites/{site}/api-sync', [SiteController::class, 'updateApiSync'])
        ->name('sites.api-sync.update');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
