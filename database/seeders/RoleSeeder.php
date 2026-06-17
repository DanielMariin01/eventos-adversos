<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Crea los roles si no existen
        Role::firstOrCreate(['name' => 'reportante', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'calidad',    'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'jefe',       'guard_name' => 'web']);

        $this->command->info('✅ Roles creados: reportante, calidad, jefe');
    }
}