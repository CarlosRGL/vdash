<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SiteContract extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'site_id',
        'contract_start_date',
        'contract_end_date',
        'contract_capacity',
        'contract_storage_usage',
        'contract_storage_limit',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
    ];

    /**
     * Get the site that owns the contract.
     */
    public function site(): BelongsTo
    {
        return $this->belongsTo(Site::class);
    }

    /**
     * Check if the contract is currently active.
     */
    public function isActive(): bool
    {
        $now = now();
        return $this->contract_start_date <= $now &&
               ($this->contract_end_date === null || $this->contract_end_date >= $now);
    }

    /**
     * Check if the contract has expired.
     */
    public function isExpired(): bool
    {
        return $this->contract_end_date !== null && $this->contract_end_date < now();
    }

    /**
     * Get the number of days until the contract expires.
     */
    public function daysUntilExpiry(): ?int
    {
        if ($this->contract_end_date === null) {
            return null;
        }

        return now()->diffInDays($this->contract_end_date, false);
    }
}
