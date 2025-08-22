<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    protected $fillable = [
        'subject',
        'department',
        'priority',
        'status',
        'description',
        'resolved_at',
    ];

    public function attachments(): HasMany
    {
        return $this->hasMany(TicketAttachment::class);
    }
}
