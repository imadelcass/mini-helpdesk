<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\TicketRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::query();

        if (auth()->user()->isUser()) {
            $tickets->where('user_id', auth()->id());
        }

        return response()->json($tickets->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TicketRequest $request)
    {
        Gate::authorize('create', Ticket::class);

        Ticket::create($request->validated());

        return response()->noContent(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        Gate::authorize('view', $ticket);

        return response()->json($ticket);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TicketRequest $request, Ticket $ticket)
    {
        Gate::authorize('update', $ticket);

        $ticket->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        Gate::authorize('delete', $ticket);

        $ticket->delete();

        return response()->noContent();
    }
}
