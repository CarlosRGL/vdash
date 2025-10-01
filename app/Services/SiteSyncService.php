<?php

namespace App\Services;

use App\Models\Site;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\RequestException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SiteSyncService
{
    /**
     * Sync site data from the WordPress API.
     */
    public function syncSiteData(Site $site): bool
    {
        if (! $site->sync_enabled || ! $site->api_token || ! $site->url) {
            return false;
        }

        try {
            $apiUrl = rtrim($site->url, '/').'/wp-json/teamtreize/v1/system-info/'.$site->api_token;

            $response = Http::timeout(30)->get($apiUrl);

            if (! $response->successful()) {
                Log::warning("Site sync failed for site {$site->id}: HTTP {$response->status()}");

                return false;
            }

            $data = $response->json();

            if (! $data) {
                Log::warning("Site sync failed for site {$site->id}: Invalid JSON response");

                return false;
            }

            $this->updateSiteInfo($site, $data);
            $this->updateServerInfo($site, $data);
            $this->updateContractInfo($site, $data);

            Log::info("Site sync completed successfully for site {$site->id}");

            return true;
        } catch (ConnectionException $e) {
            Log::error("Site sync connection failed for site {$site->id}: ".$e->getMessage());

            return false;
        } catch (RequestException $e) {
            Log::error("Site sync request failed for site {$site->id}: ".$e->getMessage());

            return false;
        } catch (\Exception $e) {
            Log::error("Site sync failed for site {$site->id}: ".$e->getMessage());

            return false;
        }
    }

    /**
     * Update site basic information.
     */
    private function updateSiteInfo(Site $site, array $data): void
    {
        $updateData = [];

        if (isset($data['wordpress']['version'])) {
            $updateData['wordpress_version'] = $data['wordpress']['version'];
        }

        if (isset($data['wordpress']['is_multisite'])) {
            $updateData['is_multisite'] = (bool) $data['wordpress']['is_multisite'];
        }

        if (! empty($updateData)) {
            $site->update($updateData);
        }
    }

    /**
     * Update or create server information.
     */
    private function updateServerInfo(Site $site, array $data): void
    {
        $serverData = [];

        // PHP information
        if (isset($data['php']['version'])) {
            $serverData['php_version'] = $data['php']['version'];
        }
        if (isset($data['php']['memory_limit'])) {
            $serverData['php_memory_limit'] = $data['php']['memory_limit'];
        }
        if (isset($data['php']['max_execution_time'])) {
            $serverData['php_max_execution_time'] = (int) $data['php']['max_execution_time'];
        }
        if (isset($data['php']['post_max_size'])) {
            $serverData['php_post_max_size'] = $data['php']['post_max_size'];
        }
        if (isset($data['php']['upload_max_filesize'])) {
            $serverData['php_upload_max_filesize'] = $data['php']['upload_max_filesize'];
        }

        // MySQL information
        if (isset($data['mysql']['version'])) {
            $serverData['mysql_version'] = $data['mysql']['version'];
        }
        if (isset($data['mysql']['server_info'])) {
            $serverData['mysql_server_info'] = $data['mysql']['server_info'];
        }

        // Server information
        if (isset($data['server']['server_ip'])) {
            $serverData['server_ip'] = $data['server']['server_ip'];
        }
        if (isset($data['server']['server_hostname'])) {
            $serverData['server_hostname'] = $data['server']['server_hostname'];
        }

        if (! empty($serverData)) {
            $site->serverInfo()->updateOrCreate(
                ['site_id' => $site->id],
                $serverData
            );
        }
    }

    /**
     * Update or create contract information.
     */
    private function updateContractInfo(Site $site, array $data): void
    {
        if (! isset($data['contract'])) {
            return;
        }

        $contractData = [];

        if (isset($data['contract']['start_date'])) {
            $contractData['contract_start_date'] = $data['contract']['start_date'];
        }
        if (isset($data['contract']['end_date'])) {
            $contractData['contract_end_date'] = $data['contract']['end_date'];
        }
        if (isset($data['contract']['capacity'])) {
            $contractData['contract_capacity'] = $data['contract']['capacity'];
        }
        if (isset($data['contract']['storage']['usage_gb'])) {
            $contractData['contract_storage_usage'] = (string) $data['contract']['storage']['usage_gb'];
        }

        // Calculate storage limit based on capacity or set a default
        if (isset($data['contract']['capacity'])) {
            // Assuming each capacity unit equals 1GB, adjust as needed
            $contractData['contract_storage_limit'] = (string) $data['contract']['capacity'];
        }

        if (! empty($contractData)) {
            $site->contract()->updateOrCreate(
                ['site_id' => $site->id],
                $contractData
            );
        }
    }
}
