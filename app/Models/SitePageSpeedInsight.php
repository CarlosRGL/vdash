<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SitePageSpeedInsight extends Model
{
    /** @use HasFactory<\Database\Factories\SitePageSpeedInsightFactory> */
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'site_pagespeed_insights';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'strategy',
        'performance_score',
        'accessibility_score',
        'best_practices_score',
        'seo_score',
        'first_contentful_paint',
        'speed_index',
        'largest_contentful_paint',
        'time_to_interactive',
        'total_blocking_time',
        'cumulative_layout_shift',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'performance_score' => 'decimal:2',
            'accessibility_score' => 'decimal:2',
            'best_practices_score' => 'decimal:2',
            'seo_score' => 'decimal:2',
        ];
    }

    /**
     * Get the site that owns the PageSpeed Insight.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
