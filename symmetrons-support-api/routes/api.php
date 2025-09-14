<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TicketController;
use App\Models\TicketAttachment;

Route::get('/tickets', [TicketController::class, 'index']);
Route::get('/tickets/stats', [TicketController::class, 'stats']);
Route::post('/tickets', [TicketController::class, 'store']);
Route::post('/tickets/{ticket}/resolve', [TicketController::class, 'resolve']);
Route::put('/tickets/{ticket}', [TicketController::class, 'update']);
Route::delete('/tickets/{ticket}', [TicketController::class, 'destroy']);
Route::get('/attachments', function () {
    return TicketAttachment::all();
});
