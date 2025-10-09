<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;

class TicketCommentPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Ticket $ticket): bool
    {
        return $user->isAdmin() || $user->isAgent() || $user->id === $ticket->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TicketComment $ticketComment): bool
    {
        return $user->id === $ticketComment->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TicketComment $ticketComment): bool
    {
        return $user->id === $ticketComment->user_id;
    }
}
