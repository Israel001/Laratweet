@guest
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport"
              content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Josefin+Sans:300,400,400i|Nunito:300,300i">
        <link rel="stylesheet" href="{{ asset('css/style.min.css') }}">
        <link rel="shortcut icon" href="{{ asset('images/eagle-favicon.png') }}" type="image/png">
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
        <title>Laratweet. It's what's happening.</title>
    </head>
        <body>
            @if (\BrowserDetect::browserFamily() !== 'Chrome' && $browser = \BrowserDetect::browserFamily())
                <div class="browser-check">
                    Note: We've detected that you're using {{ $browser }} browser to access this website.
                    Google Chrome browser is recommended in order to enjoy the full optimisability of this website.
                    Sorry for the inconvenience. Thanks for your understanding.
                </div>
            @endif
            <div class="container">
                <div class="left">
                    <div class="features">
                        <ul>
                            <li class="features__item">
                                <svg class="features__icon">
                                    <use href="{{ asset('images/symbol-defs.svg#icon-search') }}"></use>
                                </svg>
                                <span>Follow your interests.</span>
                            </li>
                            <li class="features__item">
                                <svg class="features__icon">
                                    <use href="{{ asset('images/symbol-defs.svg#icon-users') }}"></use>
                                </svg>
                                <span>Hear what people are talking about.</span>
                            </li>
                            <li class="features__item">
                                <svg class="features__icon">
                                    <use href="{{ asset('images/symbol-defs.svg#icon-bubble2') }}"></use>
                                </svg>
                                <span>Join the conversation.</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="right">
                    <div class="welcome">
                        <img src="{{ asset('images/eagle-favicon.png') }}" alt="Twitter logo" class="welcome__img">
                        <span class="welcome__text">See what's happening in the world right now</span>
                        <div class="welcome__form">
                            <span class="welcome__form--header">Join Us today</span>
                            <a href="#popup">
                                <button class="welcome__form--button sign" style="outline: none;">Sign up</button>
                            </a>
                            <a href="{{ url('/login') }}">
                                <button class="welcome__form--button log" style="outline: none;">Log in</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <div class="footer__links">
                    <a href="">About</a>
                    <a href="">Help Center</a>
                    <a href="">Blog</a>
                    <a href="">Status</a>
                    <a href="">Jobs</a>
                    <a href="">Terms</a>
                    <a href="">Privacy Policy</a>
                    <a href="">Cookies</a>
                    <a href="">Ads Info</a>
                    <a href="">Brand</a>
                    <a href="">Apps</a>
                    <a href="">Advertise</a>
                    <a href="">Marketing</a>
                    <a href="">Businesses</a>
                    <a href="">Developers</a>
                    <a href="">Directory</a>
                    <a href="">Settings</a>
                    <a href="">&copy; <span id="date"></span> Laratweet</a>
                </div>
            </div>

            <div class="signup popup" id="popup">
                <a href="" class="popup__close">X</a>
                <div class="popup__content">
                    <span class="popup__heading">JOIN US TODAY</span>
                    <form id="signup" method="POST" action="{{ route('register') }}" class="form" autocomplete="off">
                        @csrf
                        <div class="form__group">
                            <input type="text" class="form__inputs name" id="name" placeholder="Full Name" name="name" required autofocus>
                            <span class="invalid-feedback name-error" role="alert"></span>
                            <label for="name" class="form__label name-error-hide">Full Name (e.g. "John Doe")</label>
                        </div>
                        <div class="form__group">
                            <input type="email" class="form__inputs email" name="email" placeholder="Email Address" required>
                            <span class="invalid-feedback email-error" role="alert"></span>
                            <label for="email" class="form__label email-error-hide">Email Address (e.g. "john@example.com")</label>
                        </div>
                        <div class="form__group">
                            <input type="text" class="form__inputs username" id="username" name="username" placeholder="Username" required>
                            <span class="invalid-feedback username-error" role="alert"></span>
                            <label for="username" class="form__label username-error-hide">Username (minimum of four characters)</label>
                        </div>
                        <div class="form__group">
                            <input type="password" class="form__inputs password" id="password" placeholder="Password" name="password" required>
                            <span class="invalid-feedback password-error" role="alert"></span>
                            <label for="password" class="form__label password-error-hide">Password (minimum of eight characters)</label>
                        </div>
                        <div class="form__group">
                            <input type="password" class="form__inputs password-confirm" id="password-confirm" name="password_confirmation" placeholder="Confirm Password" required>
                            <span class="invalid-feedback password-confirm-error" role="alert"></span>
                            <label for="password-confirm" class="form__label password-confirm-error-hide">Confirm Password (must match the previous password)</label>
                        </div>
                        <div class="form__group fix1">
                            <button type="submit" class="form__buttons">Register</button>
                        </div>
                    </form>
                </div>
            </div>

            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
            <script src="{{ asset('js/scripts.js') }}"></script>
            <script src="{{ asset('js/script.js') }}"></script>
        </body>
    </html>
@else
    <script> location.replace("http://laratweet.local:8080/home"); </script>
@endguest
