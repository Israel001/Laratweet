<?php

namespace App\Http\Controllers;

use App\Events\PostCreated;
use App\Post;
use App\Retweet;
use Cloudinary\Uploader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostController extends Controller
{
    /**
     * @param Request $request
     * @param Post $post
     * @param Retweet $retweet
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, Post $post, Retweet $retweet) {
        $user = Auth::user();
        $following = DB::table('follows')->where('user_id', $user->id)->count();
        $followers = DB::table('follows')->where('follower_id', $user->id)->count();
        $likes = DB::table('likes')->where('user_id', $user->id)->count();
        $allPosts = $post->whereIn('user_id', $request->user()->following()->pluck('users.id')->push($request->user()->id))->with('user');
        $posts = $allPosts->orderBy(DB::raw('RAND()'))->get();
        $retweets = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->whereIn('retweets.retweet_user_id', $request->user()->following()->pluck('users.id')->push($request->user()->id))
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
        $who_to_follows = $user
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $user->id)
            ->where('follows.user_id', '!=', $user->id)
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
        return response()->json([
            'posts' => $posts,
            'retweets' => $retweets,
            'user' => $user,
            'following' => $following,
            'followers' => $followers,
            'likes' => $likes,
            'who_to_follow' => $who_to_follow,
            'trends' => $trends
        ]);
    }

    /**
     * @param Request $request
     * @param Post $post
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, Post $post) {
        $data = [];
        $video_data = [];
        if ($request->get('file')) {
            foreach ($request->get('file') as $file) {
                $name = md5(uniqid()) . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
                $upload = Uploader::upload($file, array('public_id' => $name));
                array_push($data, $upload['secure_url']);
            }
        }
        if ($request->get('video')) {
            foreach ($request->get('video') as $file) {
                $name = md5(uniqid() . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1]))[1];
                $upload = Uploader::upload($file, array('public_id' => $name, 'resource_type' => 'video'));
                array_push($video_data, $upload['secure_url']);
            }
        }
        $image = !empty($data) ? json_encode($data) : null;
        $video = !empty($video_data) ? json_encode($video_data) : null;
        if (isset($request->body)) {
            $body = $this->test_data($request->body);
        } else if (isset($request->text)) {
            $body = $this->test_data($request->text);
        } else {
            $body = '';
        }
        // create post
        $createdPost = $request->user()->posts()->create([
            'body' => $body,
            'image' => $image,
            'video' => $video
        ]);
        // broadcast
        broadcast(new PostCreated($createdPost, $request->user()));
        // return the response
        return response()->json($post->with('user')->find($createdPost->id));
    }

    /**
     * @param Retweet $retweet
     * @return \Illuminate\Http\RedirectResponse
     */
    public function likeRetweet(Retweet $retweet) {
        $user_id = Auth::user()->id;
        $retweet_id = $retweet->retweet_id;
        $likesCount = DB::table('retweets')->where('retweet_id', $retweet_id)->value('retweet_likes');
        if ($this->userLikedTheRetweet($user_id, $retweet_id)) {
            DB::table('likes')->where([
                ['user_id', '=', $user_id],
                ['retweet_id', '=', $retweet_id]
            ])->delete();
            $updatedLikesCount = $likesCount - 1;
            DB::table('retweets')->where('retweet_id', $retweet_id)->update([
                'retweet_likes' => $updatedLikesCount
            ]);
            $likedRetweet = $retweet
                ->join('posts', 'retweets.post_id', '=', 'posts.id')
                ->join('users', 'posts.user_id', '=', 'users.id')
                ->where('retweets.retweet_id', $retweet_id)
                ->select('retweets.*', 'users.*', 'posts.*')
                ->get();
            return response()->json(['retweet' => $likedRetweet]);
        }
        DB::table('likes')->insert([
            'user_id' => $user_id,
            'retweet_id' => $retweet_id
        ]);
        $updatedLikesCount = $likesCount + 1;
        DB::table('retweets')->where('retweet_id', $retweet_id)->update([
            'retweet_likes' => $updatedLikesCount
        ]);
        $likedRetweet = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->where('retweets.retweet_id', $retweet_id)
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        return response()->json(['retweet' => $likedRetweet]);
    }

    /**
     * @param Post $post
     * @return \Illuminate\Http\RedirectResponse
     */
    public function likes(Post $post) {
        $user_id = Auth::user()->id;
        $post_id = $post->id;
        $likesCount = DB::table('posts')->where('id', $post_id)->value('likes');
        if ($this->userLikedThePost($user_id, $post_id)) {
            DB::table('likes')->where([
                ['user_id', '=', $user_id],
                ['post_id', '=', $post_id],
            ])->delete();
            $updatedLikesCount = $likesCount - 1;
            DB::table('posts')->where('id', $post_id)->update([
                'likes' => $updatedLikesCount
            ]);
            $LikedPost = $post->find($post->id);
            User::find($LikedPost->user->id)->notify(new NotifyUsers());
            $likedPost = $post->where('id', $post->id)->with('user')->get();
            return response()->json(['post' => $likedPost]);
        }
        DB::table('likes')->insert([
            'user_id' => $user_id,
            'post_id' => $post_id
        ]);
        $updatedLikesCount = $likesCount + 1;
        DB::table('posts')->where('id', $post_id)->update([
            'likes' => $updatedLikesCount
        ]);
        $likedPost = $post->where('id', $post->id)->with('user')->get();
        return response()->json(['post' => $likedPost]);
    }

    /**
     * @param $user_id
     * @param $retweet_id
     * @return bool
     */
    public function userLikedTheRetweet($user_id, $retweet_id) {
        $result = DB::table('likes')->where([
            ['user_id', '=', $user_id],
            ['retweet_id', '=', $retweet_id],
        ])->get();
        return count($result) > 0 ? true : false;
    }

    /**
     * @param $user_id
     * @param $post_id
     * @return bool
     */
    public function userLikedThePost($user_id, $post_id) {
        $result = DB::table('likes')->where([
            ['user_id', '=', $user_id],
            ['post_id', '=', $post_id],
        ])->get();
        return count($result) > 0 ? true : false;
    }

    /**
     * @param Post $post
     * @return \Illuminate\Http\RedirectResponse
     */
    public function retweet(Request $request, Post $post, Retweet $retweet) {
        $user_id = Auth::user()->id;
        $post_id = $post->id;
        $createdRetweet = $retweet->create([
            'retweet_user_id' => $user_id,
            'post_id' => $post_id
        ]);
        $retweets = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->whereIn('retweets.retweet_user_id', $request->user()->following()->pluck('users.id')->push($request->user()->id))
            ->where('retweets.retweet_id', '=', $createdRetweet->retweet_id)
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        return response()->json([ 'retweet' => $retweets ]);
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
