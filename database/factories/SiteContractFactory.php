<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SiteContract>
 */
class SiteContractFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-2 years', '+1 year');
        $endDate = $this->faker->dateTimeBetween($startDate, '+3 years');

        return [
            'contract_start_date' => $startDate,
            'contract_end_date' => $this->faker->boolean(80) ? $endDate : null,
            'contract_capacity' => $this->faker->randomElement(['Basic', 'Standard', 'Premium', 'Enterprise']),
            'contract_storage_usage' => $this->faker->numberBetween(1, 50).'GB',
            'contract_storage_limit' => $this->faker->numberBetween(50, 500).'GB',
        ];
    }
}
