<?php

namespace App\Http\Controllers;

use App\Post;
use App\Retweet;
use App\User;
use Cloudinary\Uploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request) {
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
        return view('users.index', compact('user_following', 'user_followers'));
    }

    /**
     * @param Request $request
     * @param User $user
     * @param Retweet $retweet
     * @param Post $post
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserInfo(Request $request, User $user, Retweet $retweet, Post $post) {
        $users = Auth::user();
        $posts = $post->where('user_id', $user->id)->with('user')->orderBy(DB::raw('RAND()'))->get();
        $retweets = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->where('retweets.retweet_user_id', '=', $user->id)
            ->orderBy(DB::raw('RAND()'))
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        $trends = $user
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $user->id)
            ->where('users.email_verified_at', '!=', null)
            ->groupBy('users.id', 'users.name', 'users.username', 'users.created_at')
            ->orderBy(DB::raw('COUNT(follows.user_id)'), 'desc')
            ->select('users.id', 'users.name', 'users.username', 'users.created_at')
            ->distinct()
            ->limit(10)
            ->get();
        $who_to_follows = $users
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $users->id)
            ->where('follows.user_id', '!=', $users->id)
            ->where('users.email_verified_at', '!=', null)
            ->orderBy(DB::raw('RAND()'))
            ->select('users.*')
            ->distinct()
            ->limit(3)
            ->get();
        $who_to_follow = [];
        foreach ($who_to_follows as $userss) {
            if ($request->user()->canFollow($userss)) {
                array_push($who_to_follow, $userss);
            }
        }
        $following_count = DB::table('follows')->where('user_id', $user->id)->count();
        $followers_count = DB::table('follows')->where('follower_id', $user->id)->count();
        $likes_count = DB::table('likes')->where('user_id', $user->id)->count();
        $verified = $user->hasVerifiedEmail();
        $can_follow = $request->user()->canFollow($user);
        return response()->json([
            'can_follow' => $can_follow,
            'profile_visited' => $user,
            'following_count' => $following_count,
            'followers_count' => $followers_count,
            'likes_count' => $likes_count,
            'user' => $users,
            'posts' => $posts,
            'retweets' => $retweets,
            'who_to_follow' => $who_to_follow,
            'trends' => $trends,
            'verified' => $verified
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function editUserInfo(Request $request) {
        $user = User::findOrFail(Auth::user()->id);
        $bio = isset($request->bio) ? $this->test_data($request->bio) : $user->short_description;
        $location = isset($request->location) ? $this->test_data($request->location) : $user->location;
        $website = isset($request->website) ? $this->test_data($request->website) : $user->website;
        $dob = isset($request->dob) ? $this->test_data($request->dob) : $user->dob;
        $user->update([
            'short_description' => $bio,
            'location' => $location,
            'website' => $website,
            'dob' => $dob
        ]);
        return response()->json([ 'user' => $user ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function follow(Request $request, User $user, Post $post) {
        $users = Auth::user();
        if ($request->user()->canFollow($user)) {
            $request->user()->following()->attach($user->id);
        }
        $userPosts = $post->where('user_id', $user->id)->with('user')->get();
        $who_to_follows = $users
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $users->id)
            ->where('users.id', '!=', $user->id)
            ->where('follows.user_id', '!=', $users->id)
            ->where('users.email_verified_at', '!=', null)
            ->orderBy(DB::raw('RAND()'))
            ->select('users.*')
            ->distinct()
            ->limit(3)
            ->get();
        $who_to_follow = [];
        foreach ($who_to_follows as $userss) {
            if ($request->user()->canFollow($userss)) {
                array_push($who_to_follow, $userss);
            }
        }
        $following = DB::table('follows')->where('user_id', $request->user()->id)->count();
        $user['can_follow'] = false;
        return response()->json([
            'post' => $userPosts,
            'who_to_follow' => $who_to_follow,
            'following' => $following,
            'user' => $user
        ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\RedirectResponse
     */
    public function unfollow(Request $request, User $user) {
        $users = Auth::user();
        if ($request->user()->canUnfollow($user)) {
            $request->user()->following()->detach($user->id);
        }
        $who_to_follows = $users
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $users->id)
            ->where('users.id', '!=', $user->id)
            ->where('follows.user_id', '!=', $users->id)
            ->where('users.email_verified_at', '!=', null)
            ->orderBy(DB::raw('RAND()'))
            ->select('users.*')
            ->distinct()
            ->limit(3)
            ->get();
        $who_to_follow = [];
        foreach ($who_to_follows as $userss) {
            if ($request->user()->canFollow($userss)) {
                array_push($who_to_follow, $userss);
            }
        }
        $following = DB::table('follows')->where('user_id', $request->user()->id)->count();
        return response()->json([
            'who_to_follow' => $who_to_follow,
            'following' => $following
        ]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addProfilePhoto(Request $request) {
        if ($file = $request->get('file')) {
            $name = md5(uniqid()) . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
            $upload = Uploader::upload($file, array('public_id' => $name));
            $user = User::findOrFail(Auth::user()->id);
            $user->update([
                'profile_picture' => $upload['secure_url']
            ]);
        }
        return response()->json(['user' => $user]);
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addCoverPhoto(Request $request) {
        if ($file = $request->get('file')) {
            $name = md5(uniqid()) . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
            $upload = Uploader::upload($file, array('public_id' => $name));
            $user = User::findOrFail(Auth::user()->id);
            $user->update([
                'cover_photo' => $upload['secure_url']
            ]);
        }
        return response()->json(['user' => $user]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowing(Request $request, User $user) {
        $following = $user->following;
        $user_following = [];
        foreach($following as $users) {
            $users['can_follow'] = false;
            if ($users->email_verified_at !== null) {
                array_push($user_following, $users);
            }
        }
        return response()->json([ 'following' => $user_following ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFollowers(Request $request, User $user) {
        $followers = $user->followers;
        $user_followers = [];
        foreach ($followers as $users) {
            $users['can_follow'] = $request->user()->canFollow($users) ? true : false;
            if ($users->email_verified_at !== null) {
                array_push($user_followers, $users);
            }
        }
        return response()->json([ 'followers' => $user_followers ]);
    }

    /**
     * @param Request $request
     * @param User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function getLikes(User $user, Post $post, Retweet $retweet) {
        $post_likes = $post
            ->join('likes', 'posts.id', '=', 'likes.post_id')
            ->join('users', 'users.id', '=', 'posts.user_id')
            ->where('likes.user_id', '=', $user->id)
            ->orderBy(DB::raw('RAND()'))
            ->select(
                DB::raw('posts.id AS post_id'),
                'posts.body',
                'posts.image',
                'posts.created_at',
                'posts.updated_at',
                'posts.likes',
                'users.*'
            )
            ->get();
        $retweet_likes = $retweet
            ->join('likes', 'retweets.retweet_id', '=', 'likes.retweet_id')
            ->join('posts', 'posts.id', '=', 'retweets.post_id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->where('likes.user_id', '=', $user->id)
            ->orderBy(DB::raw('RAND()'))
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        return response()->json(['post_likes' => $post_likes, 'retweet_likes' => $retweet_likes]);
    }

    /**
     * @param $data
     * @return string
     */
    public function test_data($data) {
        $data = htmlspecialchars(trim($data));
        return $data;
    }

    public function viewSettings(Request $request) {
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
        return view('settings.settings', compact('user_following', 'user_followers'));
    }

    public function settingInfo() {
        $user = Auth::user();
        return response()->json(['user' => $user]);
    }
}
