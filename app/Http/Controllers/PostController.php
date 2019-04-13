<?php

namespace App\Http\Controllers;

use App\Events\PostCreated;
use App\Post;
use App\Retweet;
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
        $allPosts = $post->whereIn('user_id', $request->user()->following()->pluck('users.id')->push($request->user()->id))->with('user');
        $posts = $allPosts->orderBy(DB::raw('RAND()'))->get();
        $retweets = $retweet
            ->join('posts', 'retweets.post_id', '=', 'posts.id')
            ->join('users', 'posts.user_id', '=', 'users.id')
            ->whereIn('retweets.retweet_user_id', $request->user()->following()->pluck('users.id')->push($request->user()->id))
            ->orderBy(DB::raw('RAND()'))
            ->select('retweets.*', 'users.*', 'posts.*')
            ->get();
        $who_to_follow = DB::table('users')
            ->join('follows', 'follows.follower_id', '=', 'users.id')
            ->where('users.id', '!=', $user->id)
            ->where('follows.user_id', '!=', $user->id)
            ->where('users.email_verified_at', '!=', null)
            ->orderBy(DB::raw('RAND()'))
            ->select('users.*')
            ->distinct()
            ->limit(3)
            ->get();
        return response()->json([
            'posts' => $posts,
            'retweets' => $retweets,
            'user' => $user,
            'following' => $following,
            'followers' => $followers,
            'who_to_follow' => $who_to_follow
        ]);
    }

    /**
     * @param Request $request
     * @param Post $post
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, Post $post) {
        $data = [];
        if ($request->get('file')) {
            foreach ($request->get('file') as $file) {
                $name = time() . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
                \Image::make($file)->save(public_path('images/') . $name);
                array_push($data, $name);
            }
        }
        $image = !empty($data) ? json_encode($data) : null;
        // create post
        $createdPost = $request->user()->posts()->create([
            'body' => $request->body,
            'image' => $image
        ]);
        // broadcast
        broadcast(new PostCreated($createdPost, $request->user()))->toOthers();
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
            return redirect()->back();
        }
        DB::table('likes')->insert([
            'user_id' => $user_id,
            'retweet_id' => $retweet_id
        ]);
        $updatedLikesCount = $likesCount + 1;
        DB::table('retweets')->where('retweet_id', $retweet_id)->update([
            'retweet_likes' => $updatedLikesCount
        ]);
        return redirect()->back();
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
            return redirect()->back();
        }
        DB::table('likes')->insert([
            'user_id' => $user_id,
            'post_id' => $post_id
        ]);
        $updatedLikesCount = $likesCount + 1;
        DB::table('posts')->where('id', $post_id)->update([
            'likes' => $updatedLikesCount
        ]);
        return redirect()->back();
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
    public function retweet(Post $post) {
        $user_id = Auth::user()->id;
        $post_id = $post->id;
        Retweet::create([
            'retweet_user_id' => $user_id,
            'post_id' => $post_id
        ]);
        return redirect()->back();
    }
}
