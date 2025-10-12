<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Http\Requests\FaqRequest;
use App\Http\Resources\FaqResource;
use App\Models\FaqCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Spatie\QueryBuilder\QueryBuilder;

class FaqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Faq::class);

        return FaqResource::collection(
            QueryBuilder::for(Faq::class)
                ->select(['id', 'question', 'answer', 'faq_category_id', 'created_at'])
                ->with(['category:id,name'])
                ->allowedFilters(['question', 'answer', 'category.name'])
                ->defaultSort('-created_at')
                ->paginate(...__paginate($request))
        );
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

    /**
     * Display a listing of FAQ categories.
     */
    public function categories()
    {
        return response()->json(FaqCategory::select(['id', 'name'])->get());
    }
}
