<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\SettingsController;

Route::post('/test', function () {
    return response()->json(['message' => 'API working']);
});

// Feedback (public submit; list/approve/delete can be protected later)
Route::post('/feedback', [FeedbackController::class, 'store']);
Route::get('/feedback', [FeedbackController::class, 'index']);
Route::get('/feedback/approved', [FeedbackController::class, 'approved']);
Route::get('/feedback/stats', [FeedbackController::class, 'stats']);
Route::patch('/feedback/{id}/status', [FeedbackController::class, 'updateStatus']);
Route::delete('/feedback/{id}', [FeedbackController::class, 'destroy']);

// Settings (admin + public endpoint for frontend)
Route::get('/settings', [SettingsController::class, 'index']);
Route::get('/settings/public', [SettingsController::class, 'public']);
Route::put('/settings', [SettingsController::class, 'update']);
