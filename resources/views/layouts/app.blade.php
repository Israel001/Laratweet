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
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="dns-prefetch" type="text/css">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
    <link rel="shortcut icon" href="{{ asset('images/eagle-favicon.png') }}" type="image/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css" />

    {{-- Additional Properties --}}
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="Laratweet. It's what's happening.">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-57x57.png') }}" sizes="57x57">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-60x60.png') }}" sizes="60x60">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-72x72.png') }}" sizes="72x72">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-76x76.png') }}" sizes="76x76">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-114x114.png') }}" sizes="114x114">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-120x120.png') }}" sizes="120x120">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-144x144.png') }}" sizes="144x144">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-152x152.png') }}" sizes="152x152">
    <link rel="apple-touch-icon" href="{{ asset('images/icons/apple-icon-180x180.png') }}" sizes="180x180">
    <meta name="msapplication-TileImage" content="{{ asset('images/icons/app-icon-144x144.png') }}">
    <meta name="msapplication-TileColor" content="#fff">
    <meta name="theme-color" content="#2a79f2">

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
        <nav class="navbar navbar-expand-md navbar-light navbar-laravel sticky-top" style="margin-top: -1rem; box-shadow: 0 2px 2px -2px gray;">
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

                <div class="collapse navbar-collapse" id="navbarSupportedContent" style="margin-left: 12%;">
                    <!-- Left Side Of Navbar -->
                    <img src="{{ asset('images/eagle-favicon.png') }}" alt="Twitter logo" class="welcome__img">

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                        @else
                            <form action="{{ route('search') }}" method="post" class="search" autocomplete="off">
                                @csrf
                                <input type="text" name="search" placeholder='Search Laratweet' class="search__input" required>
                                <button class="search__button" type="submit">
                                    <ion-icon name="search"></ion-icon>
                                </button>
                            </form>
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                                    <a href="{{ route('users', Auth::user()->username) }}" class="dropdown-item">
                                        {{ __('Profile') }}
                                    </a>
                                    <a href="{{ route('viewSettings') }}" class="dropdown-item">
                                        {{ __('Settings') }}
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

        @if (!Auth::user() || Auth::user()->email_verified_at == null)
        @else
            <div class="chat">
                <img src="https://img.icons8.com/color/48/000000/speech-bubble-with-dots.png" class="chat--icon">
                <span class="chat--close">&times;</span>
            </div>

            <div class="who-to-follow chat--list">
                <div class="heading chat--heading">
                    <h3>Conversations</h3>
                </div>
                <div class="body-parent chatting-parent">
                    @if ($user_following || $user_followers)
                        @foreach($user_following as $user)
                            <div class="body chat-parent" onclick="loadChattingBox({{$user->id}})">
                                <img src={{ $user->profile_picture ? $user->profile_picture : asset('images/avatar-default.png') }} alt="Profile Image">
                                <div class="chat-user-name-box">
                                    <span class="chat-user-name">
                                        <strong>{{ $user->name }}</strong><br>
                                    </span>
                                </div>
                            </div>
                        @endforeach
                        <hr>
                        @foreach ($user_followers as $user)
                            <div class="body chat-parent" onclick="loadChattingBox({{$user->id}})">
                                <img src={{ $user->profile_picture ? $user->profile_picture : asset('images/avatar-default.png') }} alt="Profile Image">
                                <div class="chat-user-name-box">
                                    <span class="chat-user-name">
                                        <strong>{{ $user->name }}</strong><br>
                                    </span>
                                </div>
                            </div>
                        @endforeach
                    @endif
                </div>
                <hr>
                <div class="footer chat--footer">
                    <form class="chat-search">
                        <input type="text" placeholder="Search" class="chat-search-text">
                    </form>
                </div>
            </div>

            <div class="who-to-follow chat--list">
                <div class="heading chat--heading chatting--heading">
                    <img class="chat--heading-img" src={{ asset('images/avatar-default.png') }} alt="Profile Image">
                    <div class="chat-user-name-box">
                        <span class="chat-user-name" id="chat-user-name"> </span><br>
                    </div>
                    <span class="close--chatting">&times;</span>
                </div>
                <div class="body-parent chatting-parent chatting-body-parent">
                </div>
                <hr>
                <div class="footer chat--footer chatting--footer">
                    <form class="chat-msg" id="chat-form" method="post">
                        @csrf
                        <input type="hidden" id="hidden">
                        <textarea placeholder="Type a message..." maxlength="280" class="chat-msg-text" id="chat-msg"></textarea>
                        <button type="submit" class="send-button">
                            <ion-icon name="send" class="send"></ion-icon>
                        </button>
                    </form>
                </div>
            </div>
        @endif
    </div>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
    <script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/dropzone/5.5.1/min/dropzone.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="{{ asset('js/jquery.easing.1.3.js') }}"></script>
    <script src="{{ asset('js/jquery.easing.compatibility.js') }}"></script>
    <script src="{{ asset('js/promise.js') }}"></script>
    <script src="{{ asset('js/fetch.js') }}"></script>
    <script src="{{ asset('js/idb.js') }}"></script>
    <script src="{{ asset('js/utility.js') }}"></script>
    <script src="{{ asset('/js/script.js') }}"></script>
    <script>
        caches.keys()
            .then(keyList => {
                return Promise.all(keyList.map(key => {
                    caches.open(key)
                        .then(cache => {
                            cache.delete('/login');
                            cache.delete('/logout');
                            cache.delete('/broadcasting/auth');
                        });
                }))
            });

        $('body').css('background-color', '#fff');
        $('body').append('<div id="main"> <span class="spinner"></span> </div>');
        $(window).on('load', () => {
            setTimeout(removeLoader, 2000);
        });

        function removeLoader() {
            $('#main').fadeOut(500, () => {
                $('#main').remove();
                $('body').css('background-color', '#e6ecf0');
                $('#app').css('display', 'block');
            })
        }

        <?php if (Auth::user()): ?>

            $('.chat--icon').on('click', () => {
                $('.chat--icon').css('display', 'none');
                $('.chat--close').css('display', 'block');
                $('.chat--list').first().slideDown();
            });

            $('.chat--close').on('click', () => {
                $('.chat--icon').css('display', 'block');
                $('.chat--close').css('display', 'none');
                $('.chat--list').first().slideUp('fast');
            });

            $('.close--chatting').on('click', () => {
                $('.chat--list').last().css('display', 'none');
                $('.chat--icon').css('display', 'block');
                $('.chat--close').css('display', 'none');
                $('.chat').css('display', 'block');
                $('.chatting-body-parent').empty();
            });

            function loadChattingBox(id) {
                $('#hidden').val(`${id}`);
                axios.post(`/chat/${id}`)
                    .then(response => {
                        console.log('from chatting box', response);
                        if (response.data.user.profile_picture !== null) {
                            $('.chat--heading-img').attr('src', response.data.user.profile_picture);
                        } else {
                            let defaultImg = "<?php echo asset('images/avatar-default.png'); ?>";
                            $('.chat--heading-img').attr('src', defaultImg);
                        }
                        $('#chat-user-name').text(response.data.user.name);
                        $('#chat-user-name').css('font-weight', 'bold');
                    });
                getChatContent(id);
                $('.chat--list').last().css('display', 'block');
                $('.chat--list').first().css('display', 'none');
                $('.chat').css('display', 'none');
            }

            $('#chat-form').submit(el => {
                el.preventDefault();
                let id = $('#hidden').val();
                sendChatMsg(id);
            });

            $('#chat-form').on('keypress', e => {
                if (e.which == 13) {
                    e.preventDefault();
                    let id = $('#hidden').val();
                    sendChatMsg(id);
                }
            });

            function sendChatMsg(id) {
                let user_id = {{ Auth::user()->id }};
                if ($('#chat-msg').val() !== '') {
                    $.ajaxSetup({
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        }
                    });
                    let chat = $('#chat-msg').val();
                    $.ajax({
                        url: `/chat/sendChat/${id}`,
                        method: 'post',
                        data: {
                            follower_id: id,
                            chat: chat
                        },
                        success: function(response) {
                            console.log('from sending chat', response);
                            getChatsArr(id)
                                .then(chat => {
                                    let user_id = {{ Auth::user()->id }};
                                    if (chat[chat.length - 1].user_id == user_id) {
                                        if (chat[chat.length - 1] !== chat[0]) {
                                            if (chat[chat.length - 1].user_id == chat[(chat.length - 1) - 1].user_id) {
                                                $('.sender-msg').last().append(
                                                    `<div><span>${chat[chat.length - 1].chat}</span></div>`
                                                )
                                            } else {
                                                $('.chatting-body-parent').append(
                                                    `<div class="sender">
                                                        <div class="sender-msg">
                                                            <div><span>${chat[chat.length - 1].chat}</span></div>
                                                        </div>
                                                    </div>`
                                                );
                                            }
                                        } else {
                                            $('.chatting-body-parent').append(
                                                `<div class="sender">
                                                <div class="sender-msg">
                                                    <div><span>${chat[chat.length - 1].chat}</span></div>
                                                </div>
                                            </div>`
                                            );
                                        }
                                    }
                                });
                        }
                    });
                }
                $('#chat-msg').val("");
            }

            function getChatsArr(id) {
                return axios.post(`/chat/getChat/${id}`)
                    .then(response => {
                        return response.data.chats
                    });
            }

            function getChatContent(id) {
                axios.post(`/chat/getChat/${id}`)
                    .then(response => {
                        console.log('from getting chat', response);
                        let chat = response.data.chats;
                        let user_id = {{ Auth::user()->id }};
                        for (let i = 0; i < chat.length; i++) {
                            if (chat[i].user_id == user_id) {
                                if (i > 0) {
                                    if (chat[i].user_id == chat[i - 1].user_id) {
                                        $('.sender-msg').last().append(
                                            `<div><span>${chat[i].chat}</span></div>`
                                        )
                                    } else {
                                        $('.chatting-body-parent').append(
                                            `<div class="sender">
                                                <div class="sender-msg">
                                                    <div><span>${chat[i].chat}</span></div>
                                                </div>
                                            </div>`
                                        );
                                    }
                                } else {
                                    $('.chatting-body-parent').append(
                                        `<div class="sender">
                                            <div class="sender-msg">
                                                <div><span>${chat[i].chat}</span></div>
                                            </div>
                                        </div>`
                                    );
                                }
                            }

                            if (chat[i].follower_id == user_id) {
                                if (i > 0) {
                                    if (chat[i].follower_id == chat[i - 1].follower_id) {
                                        $('.receiver-msg').last().append(
                                            `<div><span>${chat[i].chat}</span></div>`
                                        )
                                    } else {
                                        $('.chatting-body-parent').append(
                                            `<div class="receiver">
                                                <img src=${ $('.chat--heading-img').attr('src') } alt="User Image">
                                                <div class="receiver-msg">
                                                    <div><span>${chat[i].chat}</span></div>
                                                </div>
                                            </div>`
                                        );
                                    }
                                } else {
                                    $('.chatting-body-parent').append(
                                        `<div class="receiver">
                                            <img src=${ $('.chat--heading-img').attr('src') } alt="User Image">
                                            <div class="receiver-msg">
                                                <div><span>${chat[i].chat}</span></div>
                                            </div>
                                        </div>`
                                    );
                                }
                            }
                        }
                    });
            }
        <?php endif ?>
    </script>
    @yield('scripts')
</body>
</html>
