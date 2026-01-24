'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';
import dayjs from 'dayjs';

import { Chart } from '@/components/core/chart';
import axiosInstance from '@/lib/axios';

export interface DailySamplingTrendProps {
  sx?: SxProps;
  taxis?: Array<Record<string, unknown>>;
}

export function DailySamplingTrend({ sx, taxis = [] }: DailySamplingTrendProps): React.JSX.Element {
  const theme = useTheme();
  const [chartSeries, setChartSeries] = React.useState<{ name: string; data: number[] }>({ name: 'Daily Samples', data: [] });
  const [chartCategories, setChartCategories] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(taxis.length === 0);
  const [error, setError] = React.useState<string | null>(null);

  const fetchDailySamplingData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 [DailySamplingTrend] Taxis prop received:', taxis.length > 0 ? `${taxis.length} items` : 'empty, will fetch from API');
      const response = taxis.length > 0 ? { data: { clients: taxis } } : await axiosInstance.get('/taxi');
      const allTaxis = response.data.clients || [];
      
      if (Array.isArray(allTaxis)) {
        // Group taxis by date
        const dailyCounts: { [date: string]: number } = {};
        
        for (const item of allTaxis) {
          const createdAtStr = item.created_at as string || '';
          if (!createdAtStr) continue;
          
          try {
            const dateOnly = dayjs(createdAtStr).format('MMM DD');
            dailyCounts[dateOnly] = (dailyCounts[dateOnly] || 0) + 1;
          } catch {
            // Skip items with invalid dates
          }
        }
        
        // Sort dates chronologically and only include dates with sampling
        const sortedDates = Object.keys(dailyCounts).sort((a, b) => {
          // Parse dates back to compare chronologically
          const dateA = dayjs(a, 'MMM DD');
          const dateB = dayjs(b, 'MMM DD');
          return dateA.isBefore(dateB) ? -1 : 1;
        });
        
        // Map data for chart (only days with sampling)
        const data = sortedDates.map(date => dailyCounts[date]);
        
        setChartCategories(sortedDates);
        setChartSeries({ name: 'Daily Samples', data });
      }
    } catch (error_) {
      console.error('Failed to fetch daily sampling data:', error_);
      setError('Failed to load daily sampling data');
    } finally {
      setIsLoading(false);
    }
  }, [taxis]);

  React.useEffect(() => {
    fetchDailySamplingData();
  }, [fetchDailySamplingData, taxis]);

  const chartOptions = useChartOptions(chartCategories, theme);

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button 
            color="inherit" 
            size="small" 
            startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}
            onClick={fetchDailySamplingData}
            disabled={isLoading}
          >
            Sync
          </Button>
        }
        title="Daily Sampling Trend"
      />
      <CardContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {isLoading ? (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <p>Loading chart data...</p>
          </Stack>
        ) : chartSeries.data.length > 0 ? (
          <Chart height={350} options={chartOptions} series={[chartSeries]} type="bar" width="100%" />
        ) : (
          <Alert severity="info">No sampling data available</Alert>
        )}
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(categories: string[], theme: Theme): ApexOptions {
  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories,
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
