<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
    ];

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
     * Get the users assigned to the site.
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
