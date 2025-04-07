<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Chạy RoleSeeder trước
        $this->call([
            RoleSeeder::class,
        ]);

        // User::factory(10)->create();

        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'username' => 'admin',
            'password' => Hash::make('123')
        ]);

        $manualUser = User::factory()->create([
            'name' => 'Manual User',
            'email' => 'manualuser@example.com',
            'username' => 'manualuser',
            'password'=> Hash::make('123')
        ]);

        // Gán role cho users
        $admin->assignRole('admin');
        $manualUser->assignRole('manualuser');
    }
}
