<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CmsController extends Controller
{
    public function index()
    {
        $coupons = $this->fetchCoupons();
        return view('cms.index', compact('coupons'));
    }

    public function updateCoupon(Request $request, $couponId)
    {
        $response = Http::withToken(session('admin_token'))
            ->put("{{base_url}}/api/v1/admin/coupons/{$couponId}", [
                'quota' => $request->input('quota'),
                'points' => $request->input('points'),
                'status' => $request->input('status'),
                'valid_from' => $request->input('valid_from'),
                'valid_to' => $request->input('valid_to'),
                'description' => $request->input('description'),
            ]);

        if ($response->successful()) {
            return redirect()->back()->with('success', 'Coupon updated successfully');
        }

        return redirect()->back()->with('error', 'Failed to update coupon');
    }

    protected function fetchCoupons()
    {
        $response = Http::get("{{base_url}}/api/v1/coupons?language=en");
        return $response->json()['coupons'] ?? [];
    }
}