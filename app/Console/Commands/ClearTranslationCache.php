<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ClearTranslationCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translation:clear';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clear all translations cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $keys = ['translations:en', 'translations:vi'];
            foreach ($keys as $key) {
                Cache::forget($key);
            }
        } catch (\Exception $e) {
            $prefix = config('cache.prefix', '');
            \DB::table('cache')->where('key', 'like', $prefix.'translations:%')->delete();
        }
        $this->info('All translations cache cleared successfully.');
    }
}
