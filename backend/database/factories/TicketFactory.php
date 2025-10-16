<?php

namespace Database\Factories;

use App\Enums\TicketPriorityEnum;
use App\Enums\TicketStatusEnum;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ticket>
 */
class TicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'status' => fake()->randomElement([
                TicketStatusEnum::OPEN,
                TicketStatusEnum::CLOSED,
                TicketStatusEnum::RESOLVED,
            ]),
            'priority' => fake()->randomElement([
                TicketPriorityEnum::LOW,
                TicketPriorityEnum::MEDIUM,
                TicketPriorityEnum::HIGH,
            ]),
            'user_id' => fake()->randomElement(User::all())->id,
            'ticket_category_id' => TicketCategory::factory(),
        ];
    }
}
