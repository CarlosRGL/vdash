<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Site;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Site>
 */
class SiteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $siteTypes = ['wordpress', 'laravel', 'other'];
        $statuses = ['active', 'inactive', 'maintenance'];

        return [
            'name' => fake()->company() . ' ' . fake()->word(),
            'url' => fake()->domainName(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement($siteTypes),
            'status' => fake()->randomElement($statuses),
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }

    /**
     * Indicate that the site is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the site is in maintenance mode.
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'maintenance',
        ]);
    }

    /**
     * Indicate that the site is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Indicate that the site is a WordPress site.
     */
    public function wordpress(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'wordpress',
        ]);
    }

    /**
     * Indicate that the site is a Laravel site.
     */
    public function laravel(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'laravel',
        ]);
    }
}
