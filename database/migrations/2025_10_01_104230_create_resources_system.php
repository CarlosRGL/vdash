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
        // Resource Categories table
        Schema::create('resource_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color')->default('#6366f1');
            $table->timestamps();
        });

        // Resources table
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('image')->nullable();
            $table->string('url')->nullable();
            $table->string('login')->nullable();
            $table->string('password')->nullable();
            $table->text('api_key')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // Pivot table for categories and resources (many-to-many)
        Schema::create('resource_category_resource', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resource_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['resource_category_id', 'resource_id'], 'resource_category_unique');
        });

        // Pivot table for user favorites
        Schema::create('resource_user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('resource_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'resource_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resource_user_favorites');
        Schema::dropIfExists('resource_category_resource');
        Schema::dropIfExists('resources');
        Schema::dropIfExists('resource_categories');
    }
};
