<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'username', 'email', 'password', 'profile_picture', 'cover_photo', 'short_description'
    ];

    protected $appends = ['time', 'tweets'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function posts() {
        return $this->hasMany(Post::class);
    }

    /**
     * @return string
     */
    public function getRouteKeyName() {
        return 'username';
    }

    /**
     * @param User $user
     * @return bool
     */
    public function isNotTheUser(User $user) {
        return $this->id !== $user->id;
    }

    /**
     * @param User $user
     * @return bool
     */
    public function isFollowing(User $user) {
        return (bool) $this->following->where('id', $user->id)->count();
    }

    /**
     * @param User $user
     * @return bool
     */
    public function canFollow(User $user) {
        if (!$this->isNotTheUser($user)) {
            return false;
        }
        return !$this->isFollowing($user);
    }

    /**
     * @param User $user
     * @return bool
     */
    public function canUnfollow(User $user) {
        return $this->isFollowing($user);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function following() {
        return $this->belongsToMany('App\User', 'follows', 'user_id', 'follower_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function followers() {
        return $this->belongsToMany('App\User', 'follows', 'follower_id', 'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function retweets() {
        return $this->hasMany(Retweet::class);
    }

    /**
     * @return mixed
     */
    public function getTime() {
        return $this->created_at->diffForHumans();
    }

    /**
     * @return mixed
     */
    public function getTimeAttribute() {
        return $this->getTime();
    }

    /**
     * @return mixed
     */
    public function getTweetsAttribute() {
        //return '2000;
        return $this->posts->count();
    }
}
