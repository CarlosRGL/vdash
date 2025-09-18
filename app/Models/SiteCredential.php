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
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // Contract fields moved to SiteContract model
    ];

    /**
     * Get the site that owns the credentials.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Encrypt the FTP password when setting it.
     */
    public function setFtpPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['ftp_password'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt the FTP password when getting it.
     */
    public function getFtpPasswordAttribute($value)
    {
        if (!empty($value)) {
            return Crypt::decryptString($value);
        }
        return null;
    }

    /**
     * Encrypt the DB password when setting it.
     */
    public function setDbPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['db_password'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt the DB password when getting it.
     */
    public function getDbPasswordAttribute($value)
    {
        if (!empty($value)) {
            return Crypt::decryptString($value);
        }
        return null;
    }

    /**
     * Encrypt the login password when setting it.
     */
    public function setLoginPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['login_password'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt the login password when getting it.
     */
    public function getLoginPasswordAttribute($value)
    {
        if (!empty($value)) {
            return Crypt::decryptString($value);
        }
        return null;
    }

    /**
     * Encrypt the API keys when setting them.
     */
    public function setApiKeysAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['api_keys'] = Crypt::encryptString($value);
        }
    }

    /**
     * Decrypt the API keys when getting them.
     */
    public function getApiKeysAttribute($value)
    {
        if (!empty($value)) {
            return Crypt::decryptString($value);
        }
        return null;
    }
}
