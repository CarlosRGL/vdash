<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Site extends Model
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'url',
        'description',
        'type',
        'team',
        'wordpress_version',
        'is_multisite',
        'sync_enabled',
        'api_token',
        'last_sync',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_multisite' => 'boolean',
            'sync_enabled' => 'boolean',
            'last_sync' => 'datetime',
        ];
    }

    /**
     * Get the credentials associated with the site.
     */
    public function credential(): HasOne
    {
        return $this->hasOne(SiteCredential::class);
    }

    /**
     * Get the contract associated with the site.
     */
    public function contract(): HasOne
    {
        return $this->hasOne(SiteContract::class);
    }

    /**
     * Get the server info associated with the site.
     */
    public function serverInfo(): HasOne
    {
        return $this->hasOne(SiteServerInfo::class);
    }

    /**
     * Get the users assigned to the site.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
