@extends('layouts.app')

@section('content')
    @if (Auth::user()->email_verified_at == null)
        <script>location.replace('/email/verify')</script>
    @endif
    <div id="users"></div>
    {{--@if (Auth::user()->email_verified_at == null)--}}
        {{--<script>location.replace('/email/verify')</script>--}}
    {{--@endif--}}

    {{--@if(Auth::user()->isNotTheUser($user))--}}
        {{--@if(Auth::user()->isFollowing($user))--}}
            {{--<a href="{{ route('users.unfollow', $user) }}">Unfollow</a>--}}
        {{--@else--}}
            {{--@if($user->email_verified_at == null)--}}
                {{--You can't follow this user right now because he / she is not verified<br>--}}
                {{--You will be able to follow this user when he / she is verified.--}}
            {{--@else--}}
                {{--<a href="{{ route('users.follow', $user) }}">Follow</a>--}}
            {{--@endif--}}
        {{--@endif--}}
    {{--@endif--}}

    {{--<h2>Following</h2>--}}
    {{--@foreach($following as $user)--}}
        {{--<p><a href="{{ route('users', $user) }}">{{ $user->username }}</a></p>--}}
    {{--@endforeach--}}

    {{--<h2>Followers</h2>--}}
    {{--@foreach($followers as $user)--}}
        {{--<p><a href="{{ route('users', $user) }}">{{ $user->username }}</a></p>--}}
    {{--@endforeach--}}
@endsection
