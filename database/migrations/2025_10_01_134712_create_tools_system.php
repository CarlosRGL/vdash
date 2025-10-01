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
        // Tool Categories table
        Schema::create('tool_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('color')->default('#6366f1');
            $table->timestamps();
        });

        // Tools table
        Schema::create('tools', function (Blueprint $table) {
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

        // Pivot table for categories and tools (many-to-many)
        Schema::create('tool_category_tool', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tool_category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tool_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['tool_category_id', 'tool_id'], 'tool_category_unique');
        });

        // Pivot table for user favorites
        Schema::create('tool_user_favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tool_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'tool_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tool_user_favorites');
        Schema::dropIfExists('tool_category_tool');
        Schema::dropIfExists('tools');
        Schema::dropIfExists('tool_categories');
    }
};
