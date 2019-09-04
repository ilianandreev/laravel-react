<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// specific routes first
Route::get('users/top-by-time', 'Api\UserController@topUsersByTime');
Route::apiResource('users', 'Api\UserController');
Route::post('init-database', 'Api\IndexController@initDatabase');