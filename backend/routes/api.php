<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\TicketCommentController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;

// Authentication routes for login and registration
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Group routes that require authentication
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes for logout and user profile
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // FAQ management routes
    Route::apiResource('faqs', FaqController::class);

    // Ticket management routes
    Route::apiResource('tickets', TicketController::class);

    // Ticket comment management routes
    Route::apiResource('ticket-comments', TicketCommentController::class);
});