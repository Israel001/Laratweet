<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group(['middleware'=>'auth'], function(){
    Route::get('/home', 'TimelineController@index');
    Route::get('/notifications', 'NotificationsController@index');
    Route::post('/posts', 'PostController@create');
    Route::get('/posts', 'PostController@index');
    Route::get('/users/{user}', 'UserController@index')->name('users');
    Route::get('/users/{user}/follow', 'UserController@follow');
    Route::get('/users/{user}/unfollow', 'UserController@unfollow');
    Route::get('/users/{user}/following', 'UserController@index');
    Route::get('/users/{user}/followers', 'UserController@index');
    Route::get('/users/{user}/likes', 'UserController@index');
    Route::get('/likes/{post}', 'PostController@likes');
    Route::get('/retweet/{post}', 'PostController@retweet');
    Route::get('/retweet/likes/{retweet}', 'PostController@likeRetweet');
    Route::post('/add_profile_photo', 'UserController@addProfilePhoto');
    Route::post('/add_cover_photo', 'UserController@addCoverPhoto');
    Route::get('/user/{user}', 'UserController@getUserInfo');
    Route::get('/user/{user}/following', 'UserController@getFollowing');
    Route::get('/user/{user}/followers', 'UserController@getFollowers');
    Route::get('/user/{user}/likes', 'UserController@getLikes');
    Route::post('/edit_user_info', 'UserController@editUserInfo');
    Route::post('/search', 'TimelineController@search')->name('search');
    Route::get('/search', 'TimelineController@search');
    Route::post('/chat/{user}', 'ChatController@chat');
    Route::post('/chat/getChat/{user}', 'ChatController@getChat');
    Route::post('/chat/sendChat/{user}', 'ChatController@sendChat')->name('sendChat');
    Route::get('/settings', 'UserController@viewSettings')->name('viewSettings');
    Route::get('/settings/getInfo', 'UserController@settingInfo');
});

Route::get('/', function () {
    return view('welcome.welcome');
});

Route::get('offline', function () {
    return view('errors.offline');
});

Auth::routes(['verify' => true]);
