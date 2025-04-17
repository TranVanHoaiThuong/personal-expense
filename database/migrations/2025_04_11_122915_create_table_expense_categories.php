<?php

use App\Models\ExpenseCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->unsignedBigInteger('user_id')->default(0)->index();
            $table->text('description')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });
        ExpenseCategory::create([
            'name' => 'Ăn uống(Food & Drinks)',
            'user_id' => 0,
            'description' => 'Default category',
            'icon' => 'fast-food.png',
        ]);
        ExpenseCategory::create([
            'name' => 'Đi lại(Transportation)',
            'user_id' => 0,
            'description' => 'Default category',
            'icon' => 'bicycle.png',
        ]);
        ExpenseCategory::create([
            'name' => 'Mua sắm(Shopping)',
            'user_id' => 0,
            'description' => 'Default category',
            'icon' => 'online-shopping.png',
        ]);
        ExpenseCategory::create([
            'name' => 'Lương(Salary)',
            'user_id' => 0,
            'description' => 'Default category',
            'icon' => 'money.png',
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
