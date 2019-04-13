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
    Route::get('/users/{user}/follow', 'UserController@follow')->name('users.follow');
    Route::get('/users/{user}/unfollow', 'UserController@unfollow')->name('users.unfollow');
    Route::get('/likes/{post}', 'PostController@likes');
    Route::get('/retweet/{post}', 'PostController@retweet');
    Route::get('/retweet/likes/{retweet}', 'PostController@likeRetweet');
    Route::post('/add_profile_photo', 'UserController@addProfilePhoto');
});

Route::get('/', function () {
    return view('welcome.welcome');
});

Auth::routes(['verify' => true]);
