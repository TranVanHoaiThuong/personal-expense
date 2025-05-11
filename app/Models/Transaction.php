<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'category_id', 'amount', 'type', 'note', 'transaction_date'];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function category() {
        return $this->belongsTo(ExpenseCategory::class, 'category_id', 'id');
    }
}
