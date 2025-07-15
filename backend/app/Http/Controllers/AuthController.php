<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'phone_number' => 'nullable|digits:8',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:6',
            'language' => 'required|in:en,zh',
            'method' => 'required|in:sms,email',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }
        if ($request->method === 'sms' && !$request->phone_number) {
            return response()->json(['status' => 'error', 'message' => 'please input the phone_number'], 422);
        }
        if ($request->method === 'email' && !$request->email) {
            return response()->json(['status' => 'error', 'message' => 'please input the email'], 422);
        }

        $userData = $request->only(['phone_number', 'email', 'language', 'points_balance', 'valid_from', 'valid_to', 'status']);
        $userData['password'] = Hash::make($request->password);

        $user = User::create($userData);

        return response()->json([
            'status' => 'success',
            'user_id' => $user->id,
            'points_balance' => $user->points_balance,
            'language' => $user->language,
        ], 201);
    }
    public function login(){
        return view('auth.login');
    }
    public function validateLogin(Request $request){
        $validator = Validator::make($request->all(), [
            'phone_number' => 'nullable|digits:8',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        return response()->json([
            'status'=> 'success',
            'message'=> 'login success'
        ],200);
    }
}
