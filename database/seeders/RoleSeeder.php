<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo các role
        $adminRole = Role::create(['name' => 'admin']);
        $manualUserRole = Role::create(['name' => 'manualuser']);

        // Tạo các permission cơ bản
        $permissions = [
            'view expenses',
            'create expenses',
            'edit expenses',
            'delete expenses',
            'manage users',
            'view reports'
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Gán tất cả permission cho admin
        $adminRole->givePermissionTo(Permission::all());

        // Gán một số permission cơ bản cho manualuser
        $manualUserRole->givePermissionTo([
            'view expenses',
            'create expenses',
            'edit expenses',
            'view reports'
        ]);
    }
} 