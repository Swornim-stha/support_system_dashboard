<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketAttachment;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rules\Enum;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::query()->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->string('priority'));
        }
        if ($request->filled('department')) {
            $query->where('department', $request->string('department'));
        }

        return $query->paginate(20);
    }

    public function stats()
    {
        $today = Carbon::today();

        return [
            'total' => Ticket::count(),
            'open' => Ticket::whereIn('status', ['open', 'in_progress'])->count(),
            'resolved_today' => Ticket::whereDate('resolved_at', $today)->count(),
            'urgent' => Ticket::where('priority', 'urgent')->count(),
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:100'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'description' => ['nullable', 'string'],
            'attachments.*' => ['file', 'max:10240'],
        ]);

        $ticket = Ticket::create([
            'subject' => $validated['subject'],
            'department' => $validated['department'],
            'priority' => $validated['priority'],
            'status' => 'open',
            'description' => $validated['description'] ?? null,
        ]);

        /** @var UploadedFile[]|null $files */
        $files = $request->file('attachments');
        if ($files) {
            foreach ($files as $file) {
                $path = $file->store('attachments', 'public');
                TicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'original_name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'size_bytes' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        return response()->json($ticket->load('attachments'), 201);
    }

    public function resolve(Ticket $ticket)
    {
        $ticket->update([
            'status' => 'resolved',
            'resolved_at' => Carbon::now(),
        ]);

        return response()->json($ticket);
    }
}
