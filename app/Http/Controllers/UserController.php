<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    //
    public function index(User $user) {
        $following = $user->following;
        $followers = $user->followers;
        return view('users.index', compact('user', 'following', 'followers'));
    }

    public function follow(Request $request, User $user) {
        if ($request->user()->canFollow($user)) {
            $request->user()->following()->attach($user->id);
        }
        return redirect()->back();
    }

    public function unfollow(Request $request, User $user) {
        if ($request->user()->canUnfollow($user)) {
            $request->user()->following()->detach($user->id);
        }
        return redirect()->back();
    }

    public function addProfilePhoto(Request $request) {
        if ($file = $request->get('file')) {
            $name = time() . '.' . explode('/', explode(':', substr($file, 0, strpos($file, ';')))[1])[1];
            \Image::make($file)->save(public_path('images/') . $name);
            $user = User::findOrFail(Auth::user()->id);
            $user->update([
                'profile_picture' => $name
            ]);
        }
        return redirect()->back();
    }
}
