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
    /**
     * Display a paginated list of tickets with filters and attachment URLs.
     */
    public function index(Request $request)
    {
        // Start the query and eager load the 'attachment' relationship to make it efficient
        $query = Ticket::with('attachment')->latest();

        // Apply filters from the request
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->string('priority'));
        }
        if ($request->filled('department')) {
            $query->where('department', $request->string('department'));
        }

        // Get the items-per-page limit from the request, default to 20
        $perPage = $request->query('limit', 20);

        // Execute the query to get the paginated results
        $tickets = $query->paginate($perPage);

        // Transform the collection to add the full, public attachment URL
        $tickets->getCollection()->transform(function ($ticket) {
            // Check if the eager-loaded attachment relationship exists for this ticket
            if ($ticket->attachment) {
                // If it exists, create the full URL from its 'path' and add it as a new 'attachment_url' property
                $ticket->attachment_url = Storage::url($ticket->attachment->path);
            } else {
                // Otherwise, set the property to null
                $ticket->attachment_url = null;
            }
            return $ticket;
        });

        return response()->json($tickets);
    }

    /**
     * Get ticket statistics.
     */
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

    /**
     * Store a new ticket and its attachments.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'department' => ['required', 'string', 'max:100'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'description' => ['nullable', 'string'],
            'attachments.*' => ['file', 'max:10240'], // 10MB max per file
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

    /**
     * Mark a ticket as resolved.
     */
    public function resolve(Ticket $ticket)
    {
        $ticket->update([
            'status' => 'resolved',
            'resolved_at' => Carbon::now(),
        ]);

        return response()->json($ticket);
    }

    /**
     * Update the status of a ticket.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,in_progress,resolved,closed',
        ]);

        $ticket->status = $validated['status'];
        $ticket->save();

        return response()->json([
            'success' => true,
            'data' => $ticket,
        ]);
    }

    /**
     * Delete a ticket and all its associated attachments.
     */
    public function destroy(Ticket $ticket)
    {
        // Delete associated attachments from storage and database
        foreach ($ticket->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->path);
            $attachment->delete();
        }

        // Delete the ticket itself
        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket and its attachments deleted successfully.',
        ]);
    }
}
