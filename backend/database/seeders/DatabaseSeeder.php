<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users
        User::factory(1)->create(['role' => RolesEnum::USER->value]);
        User::factory(1)->create(['role' => RolesEnum::AGENT->value]);
        User::factory(1)->create(['role' => RolesEnum::ADMIN->value]);
    }
}
