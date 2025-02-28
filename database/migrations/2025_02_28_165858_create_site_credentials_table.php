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
        Schema::create('site_credentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->onDelete('cascade');

            // FTP credentials
            $table->string('ftp_host')->nullable();
            $table->string('ftp_username')->nullable();
            $table->text('ftp_password')->nullable();

            // Database credentials
            $table->string('db_host')->nullable();
            $table->string('db_name')->nullable();
            $table->string('db_username')->nullable();
            $table->text('db_password')->nullable();

            // Login credentials
            $table->string('login_url')->nullable();
            $table->string('login_username')->nullable();
            $table->text('login_password')->nullable();

            // API credentials
            $table->text('api_keys')->nullable();

            // Contract information
            $table->date('contract_start_date')->nullable();
            $table->date('contract_end_date')->nullable();
            $table->string('contract_capacity')->nullable();
            $table->string('contract_storage_usage')->nullable();
            $table->string('contract_storage_limit')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_credentials');
    }
};
