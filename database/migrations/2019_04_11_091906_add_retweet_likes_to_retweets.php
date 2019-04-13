<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddRetweetLikesToRetweets extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('retweets', function (Blueprint $table) {
            //
            $table->integer('retweet_likes')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('retweets', function (Blueprint $table) {
            //
            $table->dropColumn('retweet_likes');
        });
    }
}
