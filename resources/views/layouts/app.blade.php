<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Laratweet</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="shortcut icon" href="{{ asset('images/eagle-favicon.png') }}" type="image/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.css">

    {{-- Additional Properties --}}
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Laratweet. It's what's happening.">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-57x57.png') }}" sizes="57x57">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-60x60.png') }}" sizes="60x60">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-72x72.png') }}" sizes="72x72">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-76x76.png') }}" sizes="76x76">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-114x114.png') }}" sizes="114x114">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-120x120.png') }}" sizes="120x120">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-144x144.png') }}" sizes="144x144">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-152x152.png') }}" sizes="152x152">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/app-icon-180x180.png') }}" sizes="180x180">
    <meta name="msapplication-TileImage" content="{{ asset('images/icons/app-icon-144x144.png') }}">
    <meta name="msapplication-TileColor" content="#fff">
    <meta name="theme-color" content="#2a79f2">

    <script>
        window.Laravel = <?php echo json_encode([
            'csrfToken' => csrf_token(),
            'user' => [
                'id' => Auth::check() ? Auth::user()->id : null,
                'following' => Auth::check() ? Auth::user()->following()->pluck('users.id') : null
            ],
        ]);
        ?>
    </script>
</head>
<body style="background-color: #e6ecf0;">
    <div id="app">
        @if (\BrowserDetect::browserFamily() !== 'Chrome' && $browser = \BrowserDetect::browserFamily())
            <div class="alert alert-danger" role="alert">
                Note: We've detected that you're using {{ $browser }} browser to access this website.
                Google Chrome browser is recommended in order to enjoy the full optimisability of this website.
                Sorry for the inconvenience. Thanks for your understanding.
            </div>
        @endif
        <nav class="navbar navbar-expand-md navbar-light navbar-laravel sticky-top">
            <div class="container">
                @guest
                    <a class="navbar-brand" href="{{ url('/') }}">
                        Home
                    </a>
                @else
                    <a href="{{ url('/home') }}" class="navbar-brand">
                        Home
                    </a>
                    <a href="{{ url('/notifications') }}" class="navbar-brand">
                        Notifications
                    </a>
                @endguest
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                            {{--<li class="nav-item">--}}
                                {{--<a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a>--}}
                            {{--</li>--}}
                            {{--@if (Route::has('register'))--}}
                                {{--<li class="nav-item">--}}
                                    {{--<a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a>--}}
                                {{--</li>--}}
                            {{--@endif--}}
                        @else
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a href="{{ route('users', Auth::user()->username) }}" class="dropdown-item">
                                        {{ __('Profile') }}
                                    </a>
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>
    @yield('scripts')
    <script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.js"></script>
    <script src="{{ asset('/js/script.js') }}"></script>
</body>
</html>
