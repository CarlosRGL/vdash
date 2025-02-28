<?php

namespace Database\Factories;

use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SiteMetric>
 */
class SiteMetricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $phpVersions = ['7.4.33', '8.0.28', '8.1.27', '8.2.17', '8.3.5'];

        return [
            'site_id' => Site::factory(),
            'php_version' => fake()->randomElement($phpVersions),
            'memory_limit' => fake()->randomElement(['128M', '256M', '512M', '1G']),
            'max_execution_time' => fake()->randomElement(['30', '60', '120', '300']),
            'post_max_size' => fake()->randomElement(['8M', '16M', '32M', '64M']),
            'upload_max_filesize' => fake()->randomElement(['2M', '8M', '16M', '32M']),
            'max_input_vars' => fake()->randomElement(['1000', '1500', '2000', '3000']),
            'server_ip' => fake()->ipv4(),
            'lighthouse_score' => fake()->numberBetween(30, 100),
            'last_check' => fake()->dateTimeBetween('-1 month', 'now'),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }
}
