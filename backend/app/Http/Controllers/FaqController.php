<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Http\Requests\FaqRequest;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        Gate::authorize('viewAny', Faq::class);

        return Faq::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(FaqRequest $request)
    {
        Gate::authorize('create', Faq::class);

        Faq::create($request->validated());

        return response()->noContent(Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(Faq $faq)
    {
        Gate::authorize('view', $faq);

        return response()->json($faq);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(FaqRequest $request, Faq $faq)
    {
        Gate::authorize('update', $faq);

        $faq->update($request->validated());

        return response()->noContent();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Faq $faq)
    {
        Gate::authorize('delete', $faq);

        $faq->delete();

        return response()->noContent();
    }
}
