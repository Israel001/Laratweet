<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Retweet extends Model
{
    //
    protected $primaryKey = 'retweet_id';

    protected $fillable = ['retweet_user_id', 'post_id'];

    protected $appends =
        ['owner', 'owner_name', 'owner_username', 'owner_profile_picture', 'post_time', 'retweet_time', 'liked'];

    public const CREATED_AT = 'retweet_created_at';

    public const UPDATED_AT = 'retweet_updated_at';

    protected $casts = [
        'retweet_created_at' => 'datetime',
    ];

    public function getOwnerNameAttribute() {
        $user = User::findOrFail($this->getOwner());
        return $user->name;
    }

    public function getOwnerUserNameAttribute() {
        $user = User::findOrFail($this->getOwner());
        return $user->username;
    }

    public function getOwnerProfilePictureAttribute() {
        $user = User::findOrFail($this->getOwner());
        return $user->profile_picture;
    }

    public function getRouteKeyName() {
        return 'retweet_id';
    }

    public function posts() {
        return $this->belongsTo(Post::class, 'id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getOwner() {
        return $this->retweet_user_id;
    }

    public function getOwnerAttribute() {
        return $this->getOwner();
    }

    public function getRetweetTimeAttribute() {
        return $this->retweet_created_at->diffForHumans();
    }

    public function getPostTimeAttribute() {
        return $this->posts->created_at->diffForHumans();
    }

    public function userLikedThisRetweet() {
        $user = Auth::user();
        return (bool) DB::table('likes')->where([
            ['user_id', '=', $user->id],
            ['retweet_id', '=', $this->retweet_id],
        ])->count();
    }

    public function getLikedAttribute() {
        return $this->userLikedThisRetweet();
    }
}
