<?php

namespace App\Http\Controllers;

use App\Models\TicketComment;
use App\Http\Requests\TicketCommentRequest;
use App\Models\Ticket;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class TicketCommentController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(TicketCommentRequest $request, Ticket $ticket)
    {
        Gate::authorize('create', [TicketComment::class, $ticket]);

        $comment = TicketComment::create($request->validated() + [
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id()
        ]);

        return response()->json($comment, Response::HTTP_CREATED);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TicketCommentRequest $request, TicketComment $ticketComment)
    {
        Gate::authorize('update', $ticketComment);

        $ticketComment->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketComment $ticketComment)
    {
        Gate::authorize('delete', $ticketComment);

        $ticketComment->delete();

        return response()->noContent();
    }
}
