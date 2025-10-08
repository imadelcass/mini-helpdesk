<?php

namespace App\Policies;

use App\Enums\TicketStatusEnum;
use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Ticket $ticket): bool
    {
        // Only the user who created the ticket, admin or agent can view it
        return $user->id === $ticket->user_id || $user->isAdmin() || $user->isAgent();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only users and admins can create tickets
        return $user->isUser() || $user->isAdmin();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Ticket $ticket): bool
    {
        // Users can only update their own open tickets
        if ($user->isUser()) {
            return $ticket->user_id === $user->id && $ticket->status === TicketStatusEnum::OPEN;
        }

        // Agents and Admins can update any ticket
        return $user->isAgent() || $user->isAdmin();
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Ticket $ticket): bool
    {
        // Users can delete their own tickets
        if ($user->isUser()) {
            return $ticket->user_id === $user->id;
        }

        return $user->isAdmin();
    }
}
