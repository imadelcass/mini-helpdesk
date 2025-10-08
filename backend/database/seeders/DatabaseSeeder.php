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

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users
        $user = User::factory(1)->create(['role' => RolesEnum::USER->value]);
        User::factory(1)->create(['role' => RolesEnum::AGENT->value]);
        User::factory(1)->create(['role' => RolesEnum::ADMIN->value]);

        // Create faq categories
        $faqCategories = FaqCategory::factory(5)->create();

        // Create faqs
        foreach ($faqCategories as $faqCategory) {
            Faq::factory(5)->create(['faq_category_id' => $faqCategory->id]);
        }

        // Create ticket categories
        $ticketCategories = TicketCategory::factory(5)->create();

        // Create tickets
        foreach ($ticketCategories as $ticketCategory) {
            Ticket::factory(5)->create(['ticket_category_id' => $ticketCategory->id, 'user_id' => $user->id]);
        }
    }
}
