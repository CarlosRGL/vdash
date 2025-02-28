<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteMetric extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'php_version',
        'memory_limit',
        'max_execution_time',
        'post_max_size',
        'upload_max_filesize',
        'max_input_vars',
        'server_ip',
        'lighthouse_score',
        'last_check',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'lighthouse_score' => 'integer',
        'last_check' => 'datetime',
    ];

    /**
     * Get the site that owns the metric.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
}
