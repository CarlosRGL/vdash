<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

// Schedule daily site sync
Schedule::command('sites:sync-all')->dailyAt('02:00');

// Schedule weekly PageSpeed Insights tests
Schedule::command('sites:pagespeed-insights --strategy=mobile')->weeklyOn(1, '03:00');
Schedule::command('sites:pagespeed-insights --strategy=desktop')->weeklyOn(1, '04:00');

// Schedule weekly PageSpeed Insights tests (every Monday at 3:00 AM)
Schedule::command('sites:pagespeed-insights --strategy=mobile')->weekly()->mondays()->at('03:00');
Schedule::command('sites:pagespeed-insights --strategy=desktop')->weekly()->mondays()->at('04:00');
