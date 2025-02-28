<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SiteCredential>
 */
class SiteCredentialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'site_id' => Site::factory(),

            // FTP credentials
            'ftp_host' => 'ftp.' . fake()->domainName(),
            'ftp_username' => fake()->userName(),
            'ftp_password' => fake()->password(12, 16),

            // Database credentials
            'db_host' => fake()->randomElement(['localhost', '127.0.0.1', 'db.' . fake()->domainName()]),
            'db_name' => fake()->word() . '_db',
            'db_username' => fake()->userName(),
            'db_password' => fake()->password(12, 16),

            // Login credentials
            'login_url' => fake()->url() . '/wp-admin',
            'login_username' => fake()->userName(),
            'login_password' => fake()->password(12, 16),

            // API credentials
            'api_keys' => json_encode([
                'key_name' => fake()->word(),
                'key_value' => fake()->sha256(),
                'secret' => fake()->sha256(),
            ]),

            // Contract information
            'contract_start_date' => fake()->dateTimeBetween('-2 years', '-6 months'),
            'contract_end_date' => fake()->dateTimeBetween('+6 months', '+2 years'),
            'contract_capacity' => fake()->randomElement(['Basic', 'Standard', 'Premium', 'Enterprise']),
            'contract_storage_usage' => fake()->numberBetween(100, 9000) . ' MB',
            'contract_storage_limit' => fake()->randomElement(['10 GB', '20 GB', '50 GB', '100 GB']),

            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}
