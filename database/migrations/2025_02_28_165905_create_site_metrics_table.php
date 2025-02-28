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
        Schema::create('site_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');

            // PHP configuration
            $table->string('php_version')->nullable();
            $table->string('memory_limit')->nullable();
            $table->string('max_execution_time')->nullable();
            $table->string('post_max_size')->nullable();
            $table->string('upload_max_filesize')->nullable();
            $table->string('max_input_vars')->nullable();

            // Server information
            $table->string('server_ip')->nullable();

            // Performance metrics
            $table->integer('lighthouse_score')->nullable();

            // Last check timestamp
            $table->timestamp('last_check')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_metrics');
    }
};
