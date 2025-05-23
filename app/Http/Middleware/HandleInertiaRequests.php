<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');
        $user = $request->user();
        $wallet = $user ? $user->wallet : null;
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $user,
                'permissions' => $user ? $user->getAllPermissions()->pluck('name') : [],
            ],
            'ziggy' => fn (): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'sidebarOpen' => $request->cookie('sidebar_state') === 'true',
            'isadmin' => $user ? $user->hasRole('admin') : false,
            'wallet' => $wallet ? $wallet : null,
            'translations' => $this->getTranslations($request->cookie('language') ?? 'en'),
        ];
    }
    private function getTranslations(string $language): array
    {
        $cacheKey = "translations:{$language}";
        
        try {
            return Cache::remember($cacheKey, now()->addDay(), function () use ($language) {
                return $this->loadTranslations($language);
            });
        } catch (\Exception $e) {
            \Log::warning('Failed to use default cache driver for translations, falling back to database cache', [
                'error' => $e->getMessage()
            ]);
            
            return Cache::store('database')->remember($cacheKey, now()->addDay(), function () use ($language) {
                return $this->loadTranslations($language);
            });
        }
    }

    private function loadTranslations(string $language): array
    {
        $path = resource_path("lang/$language");
        $translations = [];

        // Load base translations
        foreach (File::files($path) as $file) {
            $filename = pathinfo($file, PATHINFO_FILENAME);
            $translations[$filename] = require $file->getPathname();
        }

        // Load nested translations
        // if (File::isDirectory("$path/pages")) {
        //     $translations['pages'] = [];
        //     foreach (File::files("$path/pages") as $file) {
        //         $filename = pathinfo($file, PATHINFO_FILENAME);
        //         $translations['pages'][$filename] = require $file->getPathname();
        //     }
        // }

        return $translations;
    }
}
