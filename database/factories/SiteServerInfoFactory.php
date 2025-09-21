<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SiteServerInfo>
 */
class SiteServerInfoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'php_version' => fake()->randomElement(['8.4.12', '8.3.10', '8.2.23', '8.1.29']),
            'php_memory_limit' => fake()->randomElement(['512M', '1024M', '2048M']),
            'php_max_execution_time' => fake()->randomElement([30, 60, 120, 300]),
            'php_post_max_size' => fake()->randomElement(['128M', '256M', '512M']),
            'php_upload_max_filesize' => fake()->randomElement(['64M', '128M', '256M']),
            'mysql_version' => fake()->randomElement(['8.0.35', '8.1.0', '10.10.7', '10.11.5']),
            'mysql_server_info' => fake()->randomElement(['8.0.35-MySQL', '10.10.7-MariaDB', '10.11.5-MariaDB']),
            'server_ip' => fake()->localIpv4(),
            'server_hostname' => fake()->domainName(),
        ];
    }
}
