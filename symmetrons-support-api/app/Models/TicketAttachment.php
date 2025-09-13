<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TicketAttachment extends Model
{
    protected $fillable = [
        'ticket_id',
        'original_name',
        'path',
        'size_bytes',
        'mime_type',
    ];

    public function attachment(): HasOne // 👈 Add this entire function
    {
        return $this->hasOne(TicketAttachment::class);
    }
}
