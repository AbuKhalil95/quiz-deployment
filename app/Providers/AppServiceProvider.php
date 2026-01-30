<?php

namespace App\Providers;

use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // In production, force HTTPS so no URLs are ever generated as http://
        // (TrustProxies in bootstrap/app.php makes the Request report HTTPS;
        // this forces the URL generator too. Set APP_URL=https://... in .env.)
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
            $appUrl = config('app.url');
            if ($appUrl && str_starts_with($appUrl, 'https://')) {
                URL::forceRootUrl($appUrl);
            }
        }
    }
}
