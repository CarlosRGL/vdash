import { TrendingUp } from 'lucide-react';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface SiteTypeStat {
  type: string;
  count: number;
  fill: string;
}

interface DashboardChartProps {
  siteTypeStats: SiteTypeStat[];
}

export default function DashboardChart({ siteTypeStats }: DashboardChartProps) {
  // Transform the data for the chart
  const chartData = siteTypeStats.map((stat) => ({
    browser: stat.type,
    visitors: stat.count,
    fill: stat.fill,
  }));

  // Create dynamic chart config based on the data
  const chartConfig: ChartConfig = siteTypeStats.reduce(
    (config, stat) => {
      const key = stat.type.toLowerCase().replace(/\s+/g, '');
      config[key] = {
        label: stat.type,
        color: stat.fill,
      };
      return config;
    },
    {
      visitors: {
        label: 'Sites',
      },
    } as ChartConfig,
  );

  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Sites by Type</CardTitle>
        <CardDescription>Distribution of managed sites</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Sites
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          {totalVisitors} total sites managed <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing distribution across all site types</div>
      </CardFooter>
    </Card>
  );
}
