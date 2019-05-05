<?php

namespace App\Http\Controllers;

use App\Chat;
use App\Events\BroadcastChat;
use App\Http\Requests\ChatCreateRequest;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ChatController extends Controller
{
    //
    /**
     * @param $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function chat($id) {
        $user = User::findOrFail($id);
        return response()->json(['user' => $user]);
    }

    /**
     * @param $id
     * @return array
     */
    public function getChat($id) {
        $chats = Chat::where(function ($query) use ($id) {
            $query->where('user_id', '=', Auth::user()->id)->where('follower_id', '=', $id);
        })->orWhere(function ($query) use ($id) {
            $query->where('user_id', '=', $id)->where('follower_id', '=', Auth::user()->id);
        })->get();

        return response()->json(['chats' => $chats]);
    }


    /**
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendChat(Request $request) {
        $input = $request->all();
        if (Auth::check()) { $input['user_id'] = Auth::user()->id; }
        $chat = Chat::create($input);
        broadcast(new BroadcastChat($chat))->toOthers();
        return response()->json(['chat' => $chat]);
    }
}
