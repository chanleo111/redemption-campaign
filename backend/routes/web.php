<?php
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/profile', function () {
})->middleware('auth');

Route::get('/login',[AuthController::class,'login'])->name('login');
Route::post('/login',[AuthController::class,'validateLogin']);

Route::get('/cms', [CmsController::class, 'index'])->name('cms.index');
Route::put('/cms/update/{couponId}', [CmsController::class, 'updateCoupon'])->name('cms.update');
//Route::post('/register',[AuthController::class,'register']);


Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
