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
        $siteTypes = ['WordPress', 'Drupal', 'SPIP', 'Typo3', 'laravel', 'symfony', 'other'];
        $teams = ['quai13', 'vernalis'];

        return [
            'name' => fake()->company() . ' ' . fake()->word(),
            'url' => fake()->domainName(),
            'description' => fake()->paragraph(),
            'type' => fake()->randomElement($siteTypes),
            'team' => fake()->randomElement($teams),
            'created_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'updated_at' => function (array $attributes) {
                return fake()->dateTimeBetween($attributes['created_at'], 'now');
            },
        ];
    }

    /**
     * Indicate that the site is a WordPress site.
     */
    public function wordpress(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'WordPress',
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

    /**
     * Indicate that the site is a Drupal site.
     */
    public function drupal(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'Drupal',
        ]);
    }

    /**
     * Indicate that the site is a SPIP site.
     */
    public function spip(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'SPIP',
        ]);
    }

    /**
     * Indicate that the site is a Typo3 site.
     */
    public function typo3(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'Typo3',
        ]);
    }

    /**
     * Indicate that the site is a Symfony site.
     */
    public function symfony(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'symfony',
        ]);
    }

    /**
     * Indicate that the site belongs to Quai13 team.
     */
    public function quai13(): static
    {
        return $this->state(fn (array $attributes) => [
            'team' => 'quai13',
        ]);
    }

    /**
     * Indicate that the site belongs to Vernalis team.
     */
    public function vernalis(): static
    {
        return $this->state(fn (array $attributes) => [
            'team' => 'vernalis',
        ]);
    }

    /**
     * Configure the site to have users assigned after creation.
     */
    public function configure(): static
    {
        return $this->afterCreating(function (Site $site) {
            // Only assign users if none are already assigned
            if ($site->users()->count() === 0) {
                // Assign 1-3 random users to the site
                $userCount = fake()->numberBetween(1, 3);
                $users = User::inRandomOrder()->limit($userCount)->get();

                if ($users->isEmpty()) {
                    // If no users exist, create some
                    $users = User::factory()->count($userCount)->create();
                }

                $site->users()->attach($users->pluck('id'));
            }
        });
    }

    /**
     * Assign specific users to the site.
     */
    public function withUsers($users): static
    {
        return $this->afterCreating(function (Site $site) use ($users) {
            if (is_array($users) || $users instanceof \Illuminate\Support\Collection) {
                $userIds = collect($users)->map(function ($user) {
                    return is_object($user) ? $user->id : $user;
                });
                $site->users()->sync($userIds);
            } else {
                $userId = is_object($users) ? $users->id : $users;
                $site->users()->sync([$userId]);
            }
        });
    }
}
