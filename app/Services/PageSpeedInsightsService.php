<?php

namespace App\Services;

use App\Models\Site;
use App\Models\SitePageSpeedInsight;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PageSpeedInsightsService
{
    private string $apiUrl = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    /**
     * Run PageSpeed Insights test for a site.
     */
    public function runTest(Site $site, string $strategy = 'mobile'): ?SitePageSpeedInsight
    {
        $apiKey = config('services.google_pagespeed.api_key');

        if (! $apiKey) {
            Log::error('Google PageSpeed Insights API key not configured');

            return null;
        }

        try {
            // Build URL with multiple category parameters
            $params = http_build_query([
                'url' => $site->url,
                'key' => $apiKey,
                'strategy' => $strategy,
            ]);

            // Add category parameters separately (Google API requires multiple category params)
            $categories = ['performance', 'accessibility', 'best-practices', 'seo'];
            foreach ($categories as $category) {
                $params .= '&category=' . urlencode($category);
            }

            $fullUrl = $this->apiUrl . '?' . $params;

            $response = Http::timeout(120)->get($fullUrl);

            if (! $response->successful()) {
                Log::error("PageSpeed API request failed for site {$site->id}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return null;
            }

            $data = $response->json();

            return $this->storeResults($site, $strategy, $data);
        } catch (\Exception $e) {
            Log::error("Exception running PageSpeed test for site {$site->id}: {$e->getMessage()}");

            return null;
        }
    }

    /**
     * Store PageSpeed Insights results in the database.
     */
    private function storeResults(Site $site, string $strategy, array $data): SitePageSpeedInsight
    {
        $lighthouseResult = $data['lighthouseResult'] ?? [];
        $categories = $lighthouseResult['categories'] ?? [];
        $audits = $lighthouseResult['audits'] ?? [];

        return SitePageSpeedInsight::updateOrCreate(
            [
                'site_id' => $site->id,
                'strategy' => $strategy,
            ],
            [
                'performance_score' => $categories['performance']['score'] ?? null,
                'accessibility_score' => $categories['accessibility']['score'] ?? null,
                'best_practices_score' => $categories['best-practices']['score'] ?? null,
                'seo_score' => $categories['seo']['score'] ?? null,
                'first_contentful_paint' => $audits['first-contentful-paint']['numericValue'] ?? null,
                'speed_index' => $audits['speed-index']['numericValue'] ?? null,
                'largest_contentful_paint' => $audits['largest-contentful-paint']['numericValue'] ?? null,
                'time_to_interactive' => $audits['interactive']['numericValue'] ?? null,
                'total_blocking_time' => $audits['total-blocking-time']['numericValue'] ?? null,
                'cumulative_layout_shift' => $audits['cumulative-layout-shift']['numericValue'] ?? null,
                'full_response' => $data,
            ]
        );
    }
}
