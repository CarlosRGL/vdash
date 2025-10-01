<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Tool extends Model implements HasMedia
{
    use HasFactory;
    use InteractsWithMedia;
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'image',
        'url',
        'login',
        'password',
        'api_key',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Note: password and api_key are stored in encrypted database columns
            // The encryption happens at the database level, not in Laravel
        ];
    }

    /**
     * The categories that belong to the tool.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ToolCategory::class, 'tool_category_tool')->withTimestamps();
    }

    /**
     * The users who have favorited this tool.
     */
    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'tool_user_favorites')
            ->withTimestamps();
    }

    /**
     * Check if the tool is favorited by a user.
     */
    public function isFavoritedBy(User $user): bool
    {
        return $this->favoritedBy()->where('user_id', $user->id)->exists();
    }

    /**
     * Register media collections.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments')
            ->useDisk('public');
    }
}
