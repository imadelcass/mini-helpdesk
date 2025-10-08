<?php

namespace App\Http\Requests;

use App\Enums\TicketPriorityEnum;
use App\Enums\TicketStatusEnum;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'priority' => ['required', 'integer', Rule::enum(TicketPriorityEnum::class)],
            'status' => ['required', 'integer', Rule::enum(TicketStatusEnum::class)],
            'user_id' => ['required', 'integer', Rule::exists(User::class)],
            'ticket_category_id' => ['required', 'integer', Rule::exists(TicketCategory::class)],
        ];
    }
}
