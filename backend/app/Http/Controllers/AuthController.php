<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {

        if (!auth()->attempt($request->validated())) {
            return response()->json(['message' => __('auth.failed')], Response::HTTP_UNAUTHORIZED);
        }

        $token = auth()->user()->createToken('auth')->plainTextToken;

        return response()->json(['token' => $token]);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();

        return response()->noContent();
    }

    public function register(RegisterRequest $request)
    {
        DB::beginTransaction();

        User::create($request->validated());

        DB::commit();

        return response()->noContent(Response::HTTP_CREATED);
    }

    public function me()
    {
        return response()->json(auth()->user());
    }
}
