<?php

use App\Http\Controllers\WalletController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    // Setup wallet
    Route::post('wallet', [WalletController::class, 'store'])->name('wallet.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/expenses.php';
