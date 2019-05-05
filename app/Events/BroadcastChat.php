<?php

namespace App\Events;

use App\Chat;
use App\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class BroadcastChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $chat;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(Chat $chat)
    {
        //
        $this->chat = $chat;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel('new-chat'),
            new PrivateChannel('Chat.' . $this->chat->user_id . '.' . $this->chat->follower_id)
        ];
    }

//    public function broadcastOn()
//    {
//        return [
//            new PrivateChannel('new-chat'),
//            new PrivateChannel('App.User.' . $this->chat->user->id),
//        ];
//    }

    /**
     * @return array
     */
//    public function broadcastWith() {
//        return [
//            'chat' => array_merge($this->chat->toArray(), [
//                'user' => $this->chat->user,
//            ]),
//            'user' => $this->user,
//        ];
//    }
}
