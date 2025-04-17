<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExpenseCategory extends Model
{
    protected $fillable = ['name', 'description', 'icon', 'user_id'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
