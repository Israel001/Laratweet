<?php

namespace App\Http\Controllers;

use App\Http\Requests\ChatCreateRequest;
use App\Post;
use App\Retweet;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TimelineController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request){
        $following = $request->user()->following;
        $followers = $request->user()->followers;
        $user_following = [];
        $user_followers = [];
        foreach($following as $user) {
            if ($user->email_verified_at !== null) {
                array_push($user_following, $user);
            }
        }
        foreach($followers as $user) {
            if ($user->email_verified_at !== null) {
                array_push($user_followers, $user);
            }
        }
        return view('home.home', compact('user_following', 'user_followers'));
    }

    /**
     * @param Post $post
     * @param Retweet $retweet
     * @param User $user
     * @param Request $request
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function search(Post $post, Retweet $retweet, User $user, Request $request) {
        $input = $request->all();
        $search_data = $input['search'] ? $this->test_data($input['search']) : '';
        $post_result = $post
            ->with('user')
            ->where('body', 'like', '%' . $search_data . '%')
            ->orderBy(DB::raw('RAND()'))
            ->get();
        $retweet_result = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->where('posts.body', 'like', '%' . $search_data . '%')
            ->orderBy(DB::raw('RAND()'))
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        $users = $user
            ->where('name', 'like', '%' . $search_data . '%')
            ->where('username', 'like', '%' . $search_data . '%')
            ->orderBy(DB::raw('RAND()'))
            ->get();
        $user_result = [];
        foreach ($users as $person) {
            $person['can_follow'] = $request->user()->canFollow($person) ? true : false;
            array_push($user_result, $person);
        }
        $who_to_follows = $user
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $request->user()->id)
            ->where('follows.user_id', '!=', $request->user()->id)
            ->where('users.email_verified_at', '!=', null)
            ->orderBy(DB::raw('RAND()'))
            ->select('users.*')
            ->distinct()
            ->limit(3)
            ->get();
        $who_to_follow = [];
        foreach ($who_to_follows as $users) {
            if ($request->user()->canFollow($users)) {
                array_push($who_to_follow, $users);
            }
        }
        $trends = $user
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $request->user()->id)
            ->where('users.email_verified_at', '!=', null)
            ->groupBy('users.id', 'users.name', 'users.username', 'users.created_at')
            ->orderBy(DB::raw('COUNT(follows.user_id)'), 'desc')
            ->select('users.id', 'users.name', 'users.username', 'users.created_at')
            ->distinct()
            ->limit(10)
            ->get();
        $following = $request->user()->following;
        $followers = $request->user()->followers;
        $user_following = [];
        $user_followers = [];
        foreach($following as $user) {
            if ($user->email_verified_at !== null) {
                array_push($user_following, $user);
            }
        }
        foreach($followers as $user) {
            if ($user->email_verified_at !== null) {
                array_push($user_followers, $user);
            }
        }
        return view('search.search',
            compact('search_data', 'post_result', 'retweet_result', 'user_result', 'who_to_follow', 'trends', 'user_following', 'user_followers'));
    }

    /**
     * @param $data
     * @return string
     */
    public function test_data($data) {
        $data = htmlspecialchars(trim($data));
        return $data;
    }
}
