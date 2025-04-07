<?php

namespace App\Models;

use App\Traits\Loggable;
use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    use Loggable;
    protected $fillable = ['user_id', 'amount', 'note'];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
