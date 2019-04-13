<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Post extends Model
{
    //
    protected $fillable = ['image', 'body'];

    protected $appends = ['time', 'liked'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function getTime() {
        return $this->created_at->diffForHumans();
    }

    public function getTimeAttribute() {
        return $this->getTime();
    }

    public function userLikedThisPost() {
        $user = Auth::user();
        return (bool) DB::table('likes')->where([
            ['user_id', '=', $user->id],
            ['post_id', '=', $this->id],
        ])->count();
    }

    public function getLikedAttribute() {
        return $this->userLikedThisPost();
    }

    public function retweets() {
        return $this->hasMany(Retweet::class);
    }
}
