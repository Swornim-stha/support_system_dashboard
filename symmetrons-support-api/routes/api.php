<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;

Route::get('/tickets', [TicketController::class, 'index']);
Route::get('/tickets/stats', [TicketController::class, 'stats']);
Route::post('/tickets', [TicketController::class, 'store']);
Route::post('/tickets/{ticket}/resolve', [TicketController::class, 'resolve']);