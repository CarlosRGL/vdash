<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SitePageSpeedInsight>
 */
class SitePageSpeedInsightFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'site_id' => \App\Models\Site::factory(),
            'strategy' => fake()->randomElement(['mobile', 'desktop']),
            'performance_score' => fake()->randomFloat(2, 0, 1),
            'accessibility_score' => fake()->randomFloat(2, 0, 1),
            'best_practices_score' => fake()->randomFloat(2, 0, 1),
            'seo_score' => fake()->randomFloat(2, 0, 1),
            'first_contentful_paint' => fake()->numberBetween(500, 5000),
            'speed_index' => fake()->numberBetween(1000, 8000),
            'largest_contentful_paint' => fake()->numberBetween(1000, 6000),
            'time_to_interactive' => fake()->numberBetween(2000, 10000),
            'total_blocking_time' => fake()->numberBetween(0, 1000),
            'cumulative_layout_shift' => fake()->numberBetween(0, 500),
            'full_response' => [
                'lighthouseResult' => [
                    'finalUrl' => fake()->url(),
                    'fetchTime' => now()->toIso8601String(),
                ],
            ],
        ];
    }
}
