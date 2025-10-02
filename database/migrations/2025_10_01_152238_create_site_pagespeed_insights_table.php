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
        Schema::create('site_pagespeed_insights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('site_id')->constrained()->cascadeOnDelete();
            $table->string('strategy')->default('mobile'); // mobile or desktop
            $table->decimal('performance_score', 3, 2)->nullable();
            $table->decimal('accessibility_score', 3, 2)->nullable();
            $table->decimal('best_practices_score', 3, 2)->nullable();
            $table->decimal('seo_score', 3, 2)->nullable();
            $table->integer('first_contentful_paint')->nullable();
            $table->integer('speed_index')->nullable();
            $table->integer('largest_contentful_paint')->nullable();
            $table->integer('time_to_interactive')->nullable();
            $table->integer('total_blocking_time')->nullable();
            $table->integer('cumulative_layout_shift')->nullable();
            $table->json('full_response')->nullable();
            $table->timestamps();

            // Add unique constraint for site_id and strategy
            $table->unique(['site_id', 'strategy']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_pagespeed_insights');
    }
};
