<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Coderflex\LaravelTicket\Concerns\HasTickets;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements HasMedia
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    use HasRoles;
    use HasTickets;
    use InteractsWithMedia;
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'media',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var list<string>
     */
    protected $appends = [
        'avatar',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Register media collections for the user.
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('avatar')
            ->singleFile();
            // ->useFallbackUrl('/images/default-avatar.png')
            // ->useFallbackPath(public_path('/images/default-avatar.png'));
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarAttribute(): ?string
    {
        $url = $this->getFirstMediaUrl('avatar');

        return $url !== '' ? $url : null;
    }

    /**
     * Get the sites assigned to the user.
     */
    public function sites(): BelongsToMany
    {
        return $this->belongsToMany(Site::class)->withTimestamps();
    }

    /**
     * Get the tools favorited by the user.
     */
    public function favoriteTools(): BelongsToMany
    {
        return $this->belongsToMany(Tool::class, 'tool_user_favorites')
            ->withTimestamps();
    }
}
