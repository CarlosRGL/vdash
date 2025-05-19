<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('site_metrics', function (Blueprint $table) {
            // PHP extensions
            $table->json('php_extensions')->nullable()->after('max_input_vars');

            // Server information
            $table->string('server_software')->nullable()->after('server_ip');
            $table->string('server_os')->nullable()->after('server_software');
            $table->string('server_hostname')->nullable()->after('server_os');

            // MySQL information
            $table->string('mysql_version')->nullable()->after('server_hostname');
            $table->string('mysql_server_info')->nullable()->after('mysql_version');

            // WordPress information
            $table->string('wordpress_version')->nullable()->after('mysql_server_info');
            $table->string('wordpress_site_url')->nullable()->after('wordpress_version');
            $table->string('wordpress_home_url')->nullable()->after('wordpress_site_url');
            $table->boolean('wordpress_is_multisite')->default(false)->after('wordpress_home_url');
            $table->string('wordpress_max_upload_size')->nullable()->after('wordpress_is_multisite');
            $table->string('wordpress_permalink_structure')->nullable()->after('wordpress_max_upload_size');
            $table->string('wordpress_active_theme')->nullable()->after('wordpress_permalink_structure');
            $table->string('wordpress_active_theme_version')->nullable()->after('wordpress_active_theme');
            $table->json('wordpress_active_plugins')->nullable()->after('wordpress_active_theme_version');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('site_metrics', function (Blueprint $table) {
            $table->dropColumn([
                'php_extensions',
                'server_software',
                'server_os',
                'server_hostname',
                'mysql_version',
                'mysql_server_info',
                'wordpress_version',
                'wordpress_site_url',
                'wordpress_home_url',
                'wordpress_is_multisite',
                'wordpress_max_upload_size',
                'wordpress_permalink_structure',
                'wordpress_active_theme',
                'wordpress_active_theme_version',
                'wordpress_active_plugins'
            ]);
        });
    }
};
