<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Ticket extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject',
        'department',
        'priority',
        'status',
        'description',
        'resolved_at',
    ];

    /**
     * Get the first attachment associated with the ticket.
     * This is used for the list view in the admin panel.
     */
    public function attachment(): HasOne
    {
        return $this->hasOne(TicketAttachment::class);
    }

    /**
     * Get all attachments associated with the ticket.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }
}
