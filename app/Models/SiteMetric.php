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
        'php_extensions',
        'server_ip',
        'server_software',
        'server_os',
        'server_hostname',
        'mysql_version',
        'mysql_server_info',
        'wordpress_version',
        'wordpress_site_url',
        'wordpress_home_url',
        'wordpress_is_multisite',
        'wordpress_max_upload_size',
        'wordpress_permalink_structure',
        'wordpress_active_theme',
        'wordpress_active_theme_version',
        'wordpress_active_plugins',
        'lighthouse_score',
        'last_check',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'php_extensions' => 'array',
        'wordpress_is_multisite' => 'boolean',
        'wordpress_active_plugins' => 'array',
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
