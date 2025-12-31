<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <link rel="icon" type="image/png" href="/img/quiz-3d-icon-png-download-12914559.webp">
    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
    <script>
        // Initialize theme before React loads to prevent flash
        (function() {
            const stored = localStorage.getItem('theme');
            const root = document.documentElement;
            if (stored === 'dark') {
                root.classList.add('dark');
            } else if (stored === 'light') {
                root.classList.add('light');
            } else {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
            }
        })();
    </script>
    @inertia
</body>
</html>



