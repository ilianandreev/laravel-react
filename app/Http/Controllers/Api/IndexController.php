<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{

    public function initDatabase()
    {
        DB::select('call init_db');

        return response()->json(['message' => 'success']);
    }
}
