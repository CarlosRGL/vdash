<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteServerInfo extends Model
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
        'php_memory_limit',
        'php_max_execution_time',
        'php_post_max_size',
        'php_upload_max_filesize',
        'mysql_version',
        'mysql_server_info',
        'server_ip',
        'server_hostname',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected function casts(): array
    {
        return [
            'php_max_execution_time' => 'integer',
        ];
    }

    /**
     * Get the site that owns the server info.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Get PHP configuration as an array.
     *
     * @return array<string, mixed>
     */
    public function getPhpConfigAttribute(): array
    {
        return [
            'version' => $this->php_version,
            'memory_limit' => $this->php_memory_limit,
            'max_execution_time' => $this->php_max_execution_time,
            'post_max_size' => $this->php_post_max_size,
            'upload_max_filesize' => $this->php_upload_max_filesize,
        ];
    }

    /**
     * Get MySQL configuration as an array.
     *
     * @return array<string, mixed>
     */
    public function getMysqlConfigAttribute(): array
    {
        return [
            'version' => $this->mysql_version,
            'server_info' => $this->mysql_server_info,
        ];
    }

    /**
     * Get server configuration as an array.
     *
     * @return array<string, mixed>
     */
    public function getServerConfigAttribute(): array
    {
        return [
            'server_ip' => $this->server_ip,
            'server_hostname' => $this->server_hostname,
        ];
    }

    /**
     * Get all server information as a structured array.
     *
     * @return array<string, mixed>
     */
    public function getFullServerInfoAttribute(): array
    {
        return [
            'php' => $this->php_config,
            'mysql' => $this->mysql_config,
            'server' => $this->server_config,
        ];
    }
}
