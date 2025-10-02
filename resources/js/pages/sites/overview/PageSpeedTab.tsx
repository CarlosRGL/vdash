import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { cn, getProgressColor } from '@/lib/utils';
import { type Site, type SitePageSpeedInsight } from '@/types';
import { router } from '@inertiajs/react';
import { Activity, Gauge, Monitor, RefreshCw, Smartphone } from 'lucide-react';
import { useState } from 'react';

interface PageSpeedTabProps {
  site: Site;
}

export function PageSpeedTab({ site }: PageSpeedTabProps) {
  const pageSpeedInsights = site.page_speed_insights as SitePageSpeedInsight[] | undefined;
  const mobileInsight = pageSpeedInsights?.find((insight) => insight.strategy === 'mobile');
  const desktopInsight = pageSpeedInsights?.find((insight) => insight.strategy === 'desktop');
  const { toast } = useToast();
  const [isRunningMobile, setIsRunningMobile] = useState(false);
  const [isRunningDesktop, setIsRunningDesktop] = useState(false);

  const handleRunTest = (strategy: 'mobile' | 'desktop') => {
    if (strategy === 'mobile') {
      setIsRunningMobile(true);
    } else {
      setIsRunningDesktop(true);
    }

    router.post(
      route('sites.pagespeed.run', { site: site.id }),
      { strategy },
      {
        onSuccess: () => {
          toast.success('Test queued', {
            description: `${strategy === 'mobile' ? 'Mobile' : 'Desktop'} PageSpeed test has been queued. Refresh the page in a few moments to see results.`,
          });
        },
        onError: () => {
          toast.error('Error', {
            description: 'Failed to queue PageSpeed test. Please try again.',
          });
        },
        onFinish: () => {
          if (strategy === 'mobile') {
            setIsRunningMobile(false);
          } else {
            setIsRunningDesktop(false);
          }
        },
      },
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (score >= 50) return { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' };
    return { text: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' };
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 90) return 'default';
    if (score >= 50) return 'secondary';
    return 'destructive';
  };

  const formatMetric = (value: number | null | undefined, unit: string = 'ms') => {
    if (!value) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const ScoreCard = ({ insight, strategy }: { insight: SitePageSpeedInsight | undefined; strategy: 'mobile' | 'desktop' }) => {
    const isRunning = strategy === 'mobile' ? isRunningMobile : isRunningDesktop;

    if (!insight) {
      return (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                {strategy === 'mobile' ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                {strategy === 'mobile' ? 'Mobile' : 'Desktop'}
              </CardTitle>
              <Button size="sm" onClick={() => handleRunTest(strategy)} disabled={isRunning}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                Run Test
              </Button>
            </div>
            <CardDescription>PageSpeed Insights data not available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-center text-sm">No data available. Run a PageSpeed test to see metrics.</div>
          </CardContent>
        </Card>
      );
    }

    const performanceScore = insight.performance_score ? parseFloat(insight.performance_score) * 100 : 0;
    const accessibilityScore = insight.accessibility_score ? parseFloat(insight.accessibility_score) * 100 : 0;
    const bestPracticesScore = insight.best_practices_score ? parseFloat(insight.best_practices_score) * 100 : 0;
    const seoScore = insight.seo_score ? parseFloat(insight.seo_score) * 100 : 0;

    const scoreColors = getScoreColor(performanceScore);

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                {strategy === 'mobile' ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
                {strategy === 'mobile' ? 'Mobile' : 'Desktop'}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => handleRunTest(strategy)} disabled={isRunning}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                Retest
              </Button>
            </div>
            <div className="text-muted-foreground text-xs">Tested {formatDate(insight.created_at)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Score - Large Display */}
          <div className={`flex items-center justify-center rounded-lg p-6 ${scoreColors.bg}`}>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <Gauge className={`h-8 w-8 ${scoreColors.text}`} />
                <div className={`text-5xl font-bold ${scoreColors.text}`}>{Math.round(performanceScore)}</div>
              </div>
              <div className="text-muted-foreground mt-2 text-sm font-medium">Performance Score</div>
            </div>
          </div>

          {/* Other Scores */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Accessibility</span>
                <Badge variant={getScoreBadgeVariant(accessibilityScore)}>{Math.round(accessibilityScore)}</Badge>
              </div>
              <div className="relative w-full">
                <Progress value={accessibilityScore} className="h-2" />
                <div
                  className={cn('absolute inset-0 h-2 rounded-full transition-all', getProgressColor(accessibilityScore))}
                  style={{ width: `${Math.min(accessibilityScore, 100)}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Best Practices</span>
                <Badge variant={getScoreBadgeVariant(bestPracticesScore)}>{Math.round(bestPracticesScore)}</Badge>
              </div>
              <Progress value={bestPracticesScore} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SEO</span>
                <Badge variant={getScoreBadgeVariant(seoScore)}>{Math.round(seoScore)}</Badge>
              </div>
              <Progress value={seoScore} className="h-2" />
            </div>
          </div>

          {/* Core Web Vitals */}
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Activity className="h-4 w-4" />
              Core Web Vitals
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">First Contentful Paint</div>
                <div className="text-lg font-semibold">{formatMetric(insight.first_contentful_paint)}</div>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Speed Index</div>
                <div className="text-lg font-semibold">{formatMetric(insight.speed_index)}</div>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Largest Contentful Paint</div>
                <div className="text-lg font-semibold">{formatMetric(insight.largest_contentful_paint)}</div>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Time to Interactive</div>
                <div className="text-lg font-semibold">{formatMetric(insight.time_to_interactive)}</div>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Total Blocking Time</div>
                <div className="text-lg font-semibold">{formatMetric(insight.total_blocking_time)}</div>
              </div>
              <div className="space-y-1 rounded-lg border p-3">
                <div className="text-muted-foreground text-xs">Cumulative Layout Shift</div>
                <div className="text-lg font-semibold">{formatMetric(insight.cumulative_layout_shift, '')}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-2xl font-bold">PageSpeed Insights</h2>
        <p className="text-muted-foreground text-sm">Performance metrics and Core Web Vitals for this site</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ScoreCard insight={mobileInsight} strategy="mobile" />
        <ScoreCard insight={desktopInsight} strategy="desktop" />
      </div>
    </div>
  );
}
