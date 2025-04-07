<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Log extends Model
{
    protected $fillable = ['user_id', 'loggable_type', 'loggable_id', 'action', 'data'];

    // Quan hệ đến model thực hiện action
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Quan hệ đa hình với model được log
    public function loggable(): MorphTo
    {
        return $this->morphTo();
    }
}
