<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class Controller
{
    public function store(Request $request)
    {
        Log::info('REQUEST DATA:', $request->all());

        return response()->json(['ok' => true]);
    }
}
