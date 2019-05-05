@extends('layouts.app')

@section('content')
    @if (Auth::user()->email_verified_at == null)
        <script>location.replace('/email/verify')</script>
    @endif

    <div class="container-fluid search-page" id="container-fluid">
        <h1>{{$search_data}}</h1>
    </div>
    <div class="container-fluid search-page" id="navigation-container-fluid">
        <ul class="navigation">
            <li class="selected posts" onclick="changeSelected('posts')">Posts</li>
            <li class="people" onclick="changeSelected('people')">People</li>
        </ul>
    </div>
    <div class="container search-page">
        <div class="row">
            <div class="col-md-3">
                <div class="who-to-follow">
                    <div class="heading">
                        <h3>Who to follow</h3>
                    </div>
                    <div class="body-parent">
                        @if($who_to_follow)
                            @foreach($who_to_follow as $user)
                                <div class="body">
                                    <img src='{{$user->profile_picture ? "{$user->profile_picture}" : "images/avatar-default.png"}}' alt="Profile Image">
                                    <div>
                                        <span> <b>{{$user->name}}</b> </span><br>
                                        <a href='{{"/users/{$user->username}/follow"}}' class="tweet transparent">Follow</a>
                                    </div>
                                </div>
                            @endforeach
                        @else
                            <div class="heading">
                                <div class="alert alert-danger">
                                    <strong>
                                        Sorry, we could not suggest who to follow for you based on insufficient data.
                                        You can click the link below to find people you know manually.
                                    </strong>
                                </div>
                            </div>
                        @endif
                    </div>
                    <hr>
                    <div class="footer">
                        <a href="">Find people you know</a>
                    </div>
                </div>
                <div class="trends">
                    <h3>Trending users</h3>
                    <div class="trends__list">
                        @if ($trends)
                            @foreach($trends as $user)
                                <div>
                                    <a href='{{"/users/{$user->username}"}}'>
                                        <strong>{{$user->name}}</strong>
                                    </a><br>
                                    <span>{{$user->tweets}} Tweet(s)</span>
                                </div>
                            @endforeach
                        @endif
                    </div>
                </div>
            </div>

            @if($user_result)
                @foreach($user_result as $user)
                    <div class="col-md-3 hidden" id="people_div">
                        <div class="card follow">
                            <div class="card-header follow-cover-photo">
                                @if($user->cover_photo)
                                    <img src='{{"{$user->cover_photo}"}}' alt="Cover Photo" class="follow-cover-image">
                                @endif
                            </div>
                            <div class="follow-profile-photo">
                                <img src='{{$user->profile_picture ? "{$user->profile_picture}" : "images/avatar-default.png"}}' alt="Profile Photo" class="follow-profile-image">
                            </div>
                            <div class="card-body follow-content">
                                <div class="follow-button float-right">
                                    @if ($user->can_follow)
                                        <a onclick="follow(`{{$user->username}}`)" class="tweet transparent follow-{{$user->username}}">Follow</a>
                                        <a onclick="unfollow(`{{$user->username}}`)" class="tweet transparent unfollow-{{$user->username}} hidden">Unfollow</a>
                                    @elseif ($user->id === Auth::user()->id)
                                        <a onclick="follow(`{{$user->username}}`)" class="tweet transparent follow-{{$user->username}} hidden">Follow</a>
                                        <a onclick="unfollow(`{{$user->username}}`)" class="tweet transparent unfollow-{{$user->username}} hidden">Unfollow</a>
                                    @else
                                        <a onclick="follow(`{{$user->username}}`)" class="tweet transparent follow-{{$user->username}} hidden">Follow</a>
                                        <a onclick="unfollow(`{{$user->username}}`)" class="tweet transparent unfollow-{{$user->username}}">Unfollow</a>
                                    @endif
                                </div>
                                <div class="follow-user-name">
                                    <a href='{{"/users/{$user->username}"}}'>
                                        <span>
                                            <strong>{{substr($user->name, 0, strpos($user->name, ' '))}}</strong>
                                        </span>
                                    </a><br>
                                    <a href='{{"/users/{$user->username}"}}'>
                                        <span>{{'@'.$user->username}}</span>
                                    </a>
                                </div>
                                <div class="follow-user-description">{{Str::limit($user->short_description, 100)}}</div>
                            </div>
                        </div>
                    </div>
                @endforeach
            @else
                <div class="col-md-6 hidden" id="people_div">
                    <div class="card">
                        <div class="card-body" style="text-align: center; font-size: 1.5rem;">
                            <strong>NO RESULT FOUND 😢</strong>
                        </div>
                    </div>
                </div>
            @endif

            @if (count($retweet_result) < 1 && count($post_result) < 1)
                <div class="col-md-6" id="posts_div">
                    <div class="card">
                        <div class="card-body" style="text-align: center; font-size: 1.5rem;">
                            <strong>NO RESULT FOUND 😢</strong>
                        </div>
                    </div>
                </div>
            @else
                <div class="col-md-6" id="posts_div">
                    <div class="card">
                        <div class="card-body">
                            @if($retweet_result)
                                @foreach($retweet_result as $tweet)
                                    <div class="tweets">
                                        <div class="tweets--img">
                                            <img src='{{$tweet->owner_profile_picture ? "{$tweet->owner_profile_picture}" : "images/avatar_default.png"}}' alt="User Image"
                                                class='{{$tweet->owner_profile_picture ? 'image' : ''}}'>
                                        </div>
                                        <div class="tweets--content">
                                            <div class="tweets--heading">
                                                <a href='{{"/users/{$tweet->owner_username}"}}'>
                                                    <strong>{{$tweet->owner_name}}</strong>
                                                </a>
                                                <span class="tweets--username">{{'@'.$tweet->owner_username}}</span>
                                                <span class="dot">.</span>
                                                <span class="tweets--time">
                                                    <strong>{{$tweet->retweet_time}}</strong>
                                                </span>
                                                <span class="retweet_status">Retweeted</span>
                                            </div>
                                            <div class="retweet__body">
                                                <div class="tweets">
                                                    <div class="tweets--img">
                                                        <img src='{{$tweet->profile_picture ? "{$tweet->profile_picture}" : "images/avatar-default.png"}}' alt="User Image"
                                                             class='{{$tweet->profile_picture ? 'image' : ''}}'>
                                                    </div>
                                                    <div class="tweets--content">
                                                        <div class="tweets--heading">
                                                            <a href='{{"/users/{$tweet->username}"}}'>
                                                                <strong>{{$tweet->name}}</strong>
                                                            </a>
                                                            <span class="tweets--username">{{'@'.$tweet->username}}</span>
                                                            <span class="dot">.</span>
                                                            <span class="tweets--time">
                                                                <strong>{{$tweet->post_time}}</strong>
                                                            </span>
                                                        </div>
                                                        <p>{{$tweet->body}}</p>
                                                        <div>
                                                            <div class="retweet__img">
                                                                @if($tweet->image)
                                                                    <div class="retweet__img">
                                                                        <img src='{{json_decode($tweet->image)[0]}}' alt="Retweet image" class="retweet-image" onclick="openModal({{$tweet->id, count(json_decode($tweet->image))}})">
                                                                        @if (count(json_decode($tweet->image)) > 1)
                                                                            <div class="img-transparent-box" onclick="openModal({{$tweet->id, count(json_decode($tweet->image))}})">
                                                                                <span>{{ '+'.count(json_decode($tweet->image)) }}</span>
                                                                            </div>
                                                                            <div id='{{"myModal-{$tweet->id}"}}' class="my-modal">
                                                                                <span class="my-close my-cursor" onclick="closeModal({{$tweet->id}})">&times;</span>
                                                                                <div class="my-modal-content">
                                                                                    @for($i = 0; $i < count(json_decode($tweet->image)); $i++)
                                                                                        <div class="mySlides">
                                                                                            <div class="my-numbertext">
                                                                                                {{$i + 1}} / {{count(json_decode($tweet->image))}}
                                                                                            </div>
                                                                                            <img src='{{json_decode($tweet->image)[$i]}}' alt="Retweet image" style="width: 100%;">
                                                                                        </div>
                                                                                    @endfor
                                                                                    <a class="my-prev" onclick="prevSlides({{count(json_decode($tweet->image))}})">&#10094;</a>
                                                                                    <a class="my-next" onclick="nextSlides({{count(json_decode($tweet->image))}})">&#10095;</a>
                                                                                    <div class="my-caption-container">
                                                                                        <p id="my-caption"></p>
                                                                                    </div>
                                                                                    @for($i = 0; $i < count(json_decode($tweet->image)); $i++)
                                                                                        <div class="my-column">
                                                                                            <img src='{{json_decode($tweet->image)[$i]}}' alt="Retweet image"
                                                                                                 class="my-demo my-cursor" style="width: 100%;" onclick="currentSlide({{$i + 1, count(json_decode($tweet->image))}})">
                                                                                        </div>
                                                                                    @endfor
                                                                                </div>
                                                                            </div>
                                                                        @endif
                                                                    </div>
                                                                @endif
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tweets--footer">
                                                <div>
                                                    <a onclick="retweetLike({{$tweet->retweet_id}})">
                                                        <img src="https://img.icons8.com/color/24/000000/hearts.png"
                                                             class="ion-icon heart unlike-{{$tweet->retweet_id}} {{$tweet->liked === true ? '' : 'hidden'}}" />
                                                        <span class="tooltiptext">Unlike</span>

                                                        <img src="https://img.icons8.com/ios/24/000000/hearts.png"
                                                             class="ion-icon heart like-{{$tweet->retweet_id}} {{$tweet->liked === true ? 'hidden' : ''}}" />
                                                        <span class="tooltiptext">Like</span>
                                                    </a>
                                                    <span class="likes-count-{{$tweet->retweet_id}}">{{$tweet->retweet_likes}}</span>
                                                </div>
                                                <div>
                                                    @if (Auth::user()->id !== $tweet->owner)
                                                        <a onclick="retweet({{$tweet->id}})">
                                                            <ion-icon class="ion-icon retweet" name="repeat"></ion-icon>
                                                            <span class="tooltiptext">Retweet</span>
                                                        </a>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            @endif

                            @if($post_result)
                                @foreach($post_result as $tweet)
                                    <div class="tweets">
                                        <div class="tweets--img">
                                            <img src='{{$tweet->user->profile_picture ? "{$tweet->user->profile_picture}" : "images/avatar-default.png"}}' alt="User Image"
                                                class="{{$tweet->user->profile_picture ? 'image' : ''}}">
                                        </div>
                                        <div class="tweets--content">
                                            <div class="tweets--heading">
                                                <a href='{{"/users/{$tweet->user->username}"}}'>
                                                    <strong>{{$tweet->user->name}}</strong>
                                                </a>
                                                <span class="tweets--username">{{'@'.$tweet->user->username}}</span>
                                                <span class="dot">.</span>
                                                <span class="tweets--time">
                                                    <strong>{{$tweet->time}}</strong>
                                                </span>
                                            </div>
                                            <p>{{$tweet->body}}</p>
                                            <div class="tweets__img">
                                                @if($tweet->image)
                                                    <div>
                                                        <img src='{{json_decode($tweet->image)[0]}}' alt="Retweet image" class="retweet-image" onclick="openModal({{$tweet->id, count(json_decode($tweet->image))}})">
                                                        @if (count(json_decode($tweet->image)) > 1)
                                                            <div class="img-transparent-box" onclick="openModal({{$tweet->id, count(json_decode($tweet->image))}})">
                                                                <span>{{ '+'.count(json_decode($tweet->image)) }}</span>
                                                            </div>
                                                            <div id='{{"myModal-{$tweet->id}"}}' class="my-modal">
                                                                <span class="my-close my-cursor" onclick="closeModal({{$tweet->id}})">&times;</span>
                                                                <div class="my-modal-content">
                                                                    @for($i = 0; $i < count(json_decode($tweet->image)); $i++)
                                                                        <div class="mySlides">
                                                                            <div class="my-numbertext">
                                                                                {{$i + 1}} / {{count(json_decode($tweet->image))}}
                                                                            </div>
                                                                            <img src='{{json_decode($tweet->image)[$i]}}' alt="Retweet image" style="width: 100%;">
                                                                        </div>
                                                                    @endfor
                                                                    <a class="my-prev" onclick="prevSlides({{count(json_decode($tweet->image))}})">&#10094;</a>
                                                                    <a class="my-next" onclick="nextSlides({{count(json_decode($tweet->image))}})">&#10095;</a>
                                                                    <div class="my-caption-container">
                                                                        <p id="my-caption"></p>
                                                                    </div>
                                                                    @for($i = 0; $i < count(json_decode($tweet->image)); $i++)
                                                                        <div class="my-column">
                                                                            <img src='{{json_decode($tweet->image)[$i]}}' alt="Retweet image"
                                                                                 class="my-demo my-cursor" style="width: 100%;" onclick="currentSlide({{$i + 1, count(json_decode($tweet->image))}})">
                                                                        </div>
                                                                    @endfor
                                                                </div>
                                                            </div>
                                                        @endif
                                                    </div>
                                                @endif
                                            </div>
                                            <div class="tweets--footer">
                                                <div>
                                                    <a onclick="like({{$tweet->id}})">
                                                        <img src="https://img.icons8.com/color/24/000000/hearts.png"
                                                             class="ion-icon heart unlike-{{$tweet->id}} {{$tweet->liked === true ? '' : 'hidden'}}" />
                                                        <span class="tooltiptext">Unlike</span>

                                                        <img src="https://img.icons8.com/ios/24/000000/hearts.png"
                                                             class="ion-icon heart like-{{$tweet->id}} {{$tweet->liked === true ? 'hidden' : ''}}" />
                                                        <span class="tooltiptext">Like</span>
                                                    </a>
                                                    <span class="likes-count-{{$tweet->id}}">{{$tweet->likes}}</span>
                                                </div>
                                                <div>
                                                    @if (Auth::user()->id !== $tweet->user->id)
                                                        <a onclick="retweet({{$tweet->id}})">
                                                            <ion-icon class="ion-icon retweet" name="repeat"></ion-icon>
                                                            <span class="tooltiptext">Retweet</span>
                                                        </a>
                                                    @endif
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                @endforeach
                            @endif
                        </div>
                        <div class="card-footer">
                            <ion-icon name="arrow-dropup-circle" class="back-to-top" title="Back to Top" onClick={scrollToTop(1000)}></ion-icon>
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        let slideIndex = 1;

        function openModal(post, length) {
            if (document.getElementById('myModal-'+post)) {
                document.getElementById('myModal-'+post).style.display = 'block';
                currentSlide(1, length);
            }
        }

        function closeModal(post) {
            if (document.getElementById('myModal-'+post))
                document.getElementById('myModal-'+post).style.display = 'none';
        }

        function prevSlides(post) { showSlides(slideIndex - 1, post); }
        function nextSlides(post) { showSlides(slideIndex + 1, post); }
        function currentSlide(n, post) { showSlides(n, post); }

        function showSlides(n, post) {
            let i;
            slideIndex = n;
            let slides = document.getElementsByClassName('mySlides');
            let dots = document.getElementsByClassName('my-demo');
            let captionText = document.getElementsByClassName('my-caption');
            if (n > post) slideIndex = 1;
            if (n < 1) slideIndex = post;
            for (i = 0; i < post; i++) {
                slides[i].style.display = 'none';
            }
            for (i = 0; i < post; i++) {
                dots[i].className = dots[i].className.replace(' active', '');
            }
            if (slides[slideIndex - 1]) {
                slides[slideIndex - 1].style.display = 'block';
                dots[slideIndex - 1].className += ' active';
                captionText.innerHTML = dots[slideIndex - 1].alt;
            }
        }

        function scrollToTop(scrollDuration) {
            let cosParameter = window.scrollY / 2,
                scrollCount = 0,
                oldTimestamp = performance.now();
            function step(newTimestamp) {
                scrollCount += Math.PI / (scrollDuration / (newTimestamp - oldTimestamp));
                if (scrollCount >= Math.PI) window.scrollTo(0, 0);
                if (window.scrollY === 0) return;
                window.scrollTo(0, Math.round(cosParameter + cosParameter * Math.cos(scrollCount)));
                oldTimestamp = newTimestamp;
                window.requestAnimationFrame(step);
            }
            window.requestAnimationFrame(step);
        }

        function changeSelected(el) {
            let posts = document.getElementsByClassName('posts');
            let people = document.getElementsByClassName('people');
            let posts_div = document.getElementById('posts_div');
            let people_div = document.getElementById('people_div');
            if (el == 'posts') {
                people[0].classList.remove('selected');
                posts[0].classList.add('selected');
                people_div.classList.add('hidden');
                posts_div.classList.remove('hidden');
            } else if (el == 'people') {
                posts[0].classList.remove('selected');
                people[0].classList.add('selected');
                posts_div.classList.add('hidden');
                people_div.classList.remove('hidden');
            }
        }

        function like(post) {
            $.ajax({ url: `/likes/${post}` });
            manipulateDOMForLike(post);
        }

        function follow(user) {
            $.ajax({ url: `/users/${user}/follow` });
            manipulateDOMForFollow(user);
        }

        function unfollow(user) {
            $.ajax({ url: `/users/${user}/unfollow` });
            manipulateDOMForFollow(user);
        }

        function retweetLike(post) {
            $.ajax({ url: `retweet/likes/${post}` });
            manipulateDOMForLike(post);
        }

        function retweet(post) {
            $.ajax({ url: `retweet/${post}` });
            toastr.options.closeButton = true;
            toastr.options.showMethod = 'slideDown';
            toastr.options.hideMethod = 'slideUp';
            toastr.options.closeMethod = 'slideUp';
            toastr.options.closeMethod = 'fadeOut';
            toastr.options.closeDuration = 300;
            toastr.options.showEasing = 'easeOutBounce';
            toastr.options.hideEasing = 'easeInBack';
            toastr.options.closeEasing = 'easeInBack';
            toastr.options.closeEasing = 'swing';
            toastr.options.newestOnTop = false;
            toastr.options.timeOut = 120;
            toastr.options.extendedTimeOut = 240;
            toastr.options.progressBar = true;
            toastr.info('The post have been retweeted successfully but unfortunately we cannot update this page. Please visit the homepage or your profile to see the newly retweeted post.', 'Laratweet');
        }

        function manipulateDOMForLike(post) {
            if (document.getElementsByClassName(`unlike-${post}`)[0].classList.contains('hidden')) {
                document.getElementsByClassName(`unlike-${post}`)[0].classList.remove('hidden');
                document.getElementsByClassName(`like-${post}`)[0].classList.add('hidden');
                document.getElementsByClassName(`likes-count-${post}`)[0].textContent++;
            } else if (document.getElementsByClassName(`like-${post}`)[0].classList.contains('hidden')) {
                document.getElementsByClassName(`like-${post}`)[0].classList.remove('hidden');
                document.getElementsByClassName(`unlike-${post}`)[0].classList.add('hidden');
                document.getElementsByClassName(`likes-count-${post}`)[0].textContent -= 1;
            }
        }

        function manipulateDOMForFollow(post) {
            if (document.getElementsByClassName(`unfollow-${post}`)[0].classList.contains('hidden')) {
                document.getElementsByClassName(`unfollow-${post}`)[0].classList.remove('hidden');
                document.getElementsByClassName(`follow-${post}`)[0].classList.add('hidden');
            } else if (document.getElementsByClassName(`follow-${post}`)[0].classList.contains('hidden')) {
                document.getElementsByClassName(`follow-${post}`)[0].classList.remove('hidden');
                document.getElementsByClassName(`unfollow-${post}`)[0].classList.add('hidden');
            }
        }
    </script>
@endsection
