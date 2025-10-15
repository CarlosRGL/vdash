<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;

class SiteCredential extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'ftp_host',
        'ftp_username',
        'ftp_password',
        'db_host',
        'db_name',
        'db_username',
        'db_password',
        'login_url',
        'login_username',
        'login_password',
        'api_keys',
    ];

    /**
     * Get the site that owns the credentials.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }
    /**
     * Decrypt the FTP password when getting it.
     */
    protected function ftpPassword(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(get: function ($value) {
            if (! empty($value)) {
                return Crypt::decryptString($value);
            }
            return null;
        }, set: function ($value) {
            if (! empty($value)) {
                $this->attributes['ftp_password'] = Crypt::encryptString($value);
            }
            return ['ftp_password' => Crypt::encryptString($value)];
        });
    }
    /**
     * Decrypt the DB password when getting it.
     */
    protected function dbPassword(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(get: function ($value) {
            if (! empty($value)) {
                return Crypt::decryptString($value);
            }
            return null;
        }, set: function ($value) {
            if (! empty($value)) {
                $this->attributes['db_password'] = Crypt::encryptString($value);
            }
            return ['db_password' => Crypt::encryptString($value)];
        });
    }
    /**
     * Decrypt the login password when getting it.
     */
    protected function loginPassword(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(get: function ($value) {
            if (! empty($value)) {
                return Crypt::decryptString($value);
            }
            return null;
        }, set: function ($value) {
            if (! empty($value)) {
                $this->attributes['login_password'] = Crypt::encryptString($value);
            }
            return ['login_password' => Crypt::encryptString($value)];
        });
    }
    /**
     * Decrypt the API keys when getting them.
     */
    protected function apiKeys(): \Illuminate\Database\Eloquent\Casts\Attribute
    {
        return \Illuminate\Database\Eloquent\Casts\Attribute::make(get: function ($value) {
            if (! empty($value)) {
                return Crypt::decryptString($value);
            }
            return null;
        }, set: function ($value) {
            if (! empty($value)) {
                $this->attributes['api_keys'] = Crypt::encryptString($value);
            }
            return ['api_keys' => Crypt::encryptString($value)];
        });
    }
    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            // Contract fields moved to SiteContract model
        ];
    }
}
