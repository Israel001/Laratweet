<?php

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

use Illuminate\Support\Facades\Auth;

Broadcast::channel('App.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('new-post', function ($user) {
    return Auth::check();
});

Broadcast::channel('new-chat', function ($user) {
    return Auth::check();
});

Broadcast::channel('Chat.{user_id}.{follower_id}', function ($user, $user_id, $follower_id) {
    return $user->id == $follower_id;
});

Broadcast::channel('Online', function ($user) {
    return $user;
});
