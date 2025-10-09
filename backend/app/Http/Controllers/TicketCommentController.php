<?php

namespace App\Http\Controllers;

use App\Models\TicketComment;
use App\Http\Requests\StoreTicketCommentRequest;
use App\Http\Requests\UpdateTicketCommentRequest;

class TicketCommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketCommentRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketComment $ticketComment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketCommentRequest $request, TicketComment $ticketComment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketComment $ticketComment)
    {
        //
    }
}
