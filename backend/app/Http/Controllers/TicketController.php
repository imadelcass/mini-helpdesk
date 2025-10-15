<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Http\Requests\TicketRequest;
use App\Http\Resources\TicketResource;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tickets = Ticket::query();

        if (auth()->user()->isUser()) {
            $tickets->where('user_id', auth()->id());
        }

        return TicketResource::collection(
            QueryBuilder::for($tickets)
                ->select(['id', 'title', 'description', 'priority', 'status', 'user_id', 'ticket_category_id', 'created_at', 'updated_at'])
                ->with(['category:id,name', 'comments:id,ticket_id,content,created_at'])
                ->allowedFilters([
                    'title',
                    'description',
                    'priority',
                    'status',
                    AllowedFilter::callback('category', function ($query, $category) {
                        $query->whereHas('category', function ($query) use ($category) {
                            $query->where('name', 'like', "%{$category}%");
                        });
                    }),
                    AllowedFilter::callback('global', function ($query, $user) {
                        $query
                            ->where('title', 'like', "%{$user}%")
                            ->orWhere('description', 'like', "%{$user}%")
                            ->orWhere('priority', 'like', "%{$user}%")
                            ->orWhere('status', 'like', "%{$user}%");
                    }),
                ])
                ->allowedSorts(['title', 'description', 'priority', 'status', 'created_at'])
                ->defaultSort('-created_at')
                ->paginate(...__paginate($request))
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TicketRequest $request)
    {
        Gate::authorize('create', Ticket::class);

        Ticket::create($request->validated() + ['user_id' => auth()->id()]);

        return response()->noContent(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        Gate::authorize('view', $ticket);

        return response()->json($ticket->load(['category:id,name', 'comments:id,ticket_id,content,created_at']));
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

    /**
     * Display a listing of FAQ categories.
     */
    public function categories()
    {
        return response()->json(TicketCategory::select(['id', 'name'])->get());
    }
}
