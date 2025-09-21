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
        Schema::create('site_server_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');

            // PHP configuration
            $table->string('php_version')->nullable();
            $table->string('php_memory_limit')->nullable();
            $table->integer('php_max_execution_time')->nullable();
            $table->string('php_post_max_size')->nullable();
            $table->string('php_upload_max_filesize')->nullable();

            // MySQL configuration
            $table->string('mysql_version')->nullable();
            $table->string('mysql_server_info')->nullable();

            // Server information
            $table->string('server_ip')->nullable();
            $table->string('server_hostname')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_server_infos');
    }
};
