<?php

use App\Http\Controllers\Expenses\CategoryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::group(['prefix' => 'expenses'], function () {
        Route::prefix('categories')->group(function () {
            Route::get('/', function () {
                return Inertia::render('expense/category/index');
            })->name('expenses.categories.index');
            Route::get('tabledata', [CategoryController::class, 'getTableData'])->name('expenses.categories.tabledata');
            Route::post('/store', [CategoryController::class, 'store'])->name('expenses.categories.store');
            Route::delete('/delete/{id}', [CategoryController::class, 'destroy'])->name('expenses.categories.destroy');
        });
    });
});