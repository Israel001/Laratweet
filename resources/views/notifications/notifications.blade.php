@extends('layouts.app')

@section('content')
    @if (Auth::user()->email_verified_at == null)
        <script>location.replace('/email/verify')</script>
    @endif
    <div id="notifications"></div>
@endsection
