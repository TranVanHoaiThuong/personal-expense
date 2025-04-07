<?php
namespace App\Traits;

use App\Models\Log;

trait Loggable
{
    public static function bootLoggable()
    {
        static::created(function ($model) {
            $model->logAction('created', $model);
        });

        static::updated(function ($model) {
            $model->logAction('updated', $model->getChanges());
        });

        static::deleted(function ($model) {
            $model->logAction('deleted', $model);
        });
    }

    public function logAction($action, $data = null)
    {
        Log::create([
            'user_id' => auth()->id(),
            'loggable_type' => get_class($this),
            'loggable_id' => $this->id,
            'action' => $action,
            'data' => $data ? json_encode($data) : null,
        ]);
    }
}
