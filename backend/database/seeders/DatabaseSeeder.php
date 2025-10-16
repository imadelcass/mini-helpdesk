<?php

namespace Database\Seeders;

use App\Enums\RolesEnum;
use App\Models\Faq;
use App\Models\FaqCategory;
use App\Models\Ticket;
use App\Models\TicketCategory;
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
        // Create users
        $admin = User::factory(1)->create([
            'role' => RolesEnum::ADMIN->value,
            'email' => 'admin@yourdomain.com',
            'password' => Hash::make('00000000'),
        ]);

        User::factory(1)->create([
            'role' => RolesEnum::AGENT->value,
            'email' => 'agent@yourdomain.com',
            'password' => Hash::make('00000000')
        ]);

        User::factory(1)->create([
            'role' => RolesEnum::USER->value,
            'email' => 'user@yourdomain.com',
            'password' => Hash::make('00000000')
        ]);

        // Create faq categories
        $faqCategories = FaqCategory::factory(10)->create();

        // Create faqs
        foreach ($faqCategories as $faqCategory) {
            Faq::factory(5)->create([
                'faq_category_id' => $faqCategory->id
            ]);
        }

        // Create ticket categories
        $ticketCategories = TicketCategory::factory(10)->create();

        // Create tickets
        foreach ($ticketCategories as $ticketCategory) {
            Ticket::factory(5)->create([
                'ticket_category_id' => $ticketCategory->id,
            ]);
        }
    }
}
