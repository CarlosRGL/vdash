<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->boolean('sync_enabled')->default(false)->after('is_multisite');
            $table->string('api_token')->default('SEec1oWGvJWmpja4CnWId6ONRwyWFkSF')->after('sync_enabled');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sites', function (Blueprint $table) {
            $table->dropColumn(['sync_enabled', 'api_token']);
        });
    }
};
