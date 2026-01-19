"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Sales } from '@/components/dashboard/overview/sales';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { Budget } from '@/components/dashboard/overview/budget';
import { SamplingCompletedToday } from '@/components/dashboard/overview/sampling-completed-today';
import { DailySamplingTrend } from '@/components/dashboard/overview/daily-sampling-trend';
import axiosInstance from '@/lib/axios';
import { useUser } from '@/hooks/use-user';

export default function Page() {
  const { isLoading } = useUser();
  const [taxiCount, setTaxiCount] = React.useState<number>(0);
  const [samplingCount, setSamplingCount] = React.useState<number>(0);

  React.useEffect(() => {
    // Only fetch data after user is loaded and authenticated
    if (isLoading) {
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/taxi');
        if (response.data.clients && Array.isArray(response.data.clients)) {
          const allTaxis = response.data.clients;
          setTaxiCount(allTaxis.length);

          // Count taxis from today
          // Get today's date in local timezone (not UTC)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayStartTime = today.getTime();
          
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowStartTime = tomorrow.getTime();

          const todayCount = allTaxis.filter((item: Record<string, unknown>) => {
            const createdAtStr = item.created_at as string || '';
            if (!createdAtStr) return false;
            
            try {
              // Parse the created_at timestamp
              const createdAtTime = new Date(createdAtStr).getTime();
              // Check if it falls within today's range
              return createdAtTime >= todayStartTime && createdAtTime < tomorrowStartTime;
            } catch {
              return false;
            }
          }).length;
          
          setSamplingCount(todayCount);
        }
      } catch (error) {
        console.error('Failed to fetch taxi data:', error);
        setTaxiCount(0);
        setSamplingCount(0);
      }
    };

    fetchData();
  }, [isLoading]);
  const salesSeries = [
    { name: 'This year', data: [18, 25, 30, 45, 65, 55, 70, 60, 80, 75, 90, 100] },
  ];

  const trafficSeries = [45, 30, 25];
  const trafficLabels = ['Desktop', 'Tablet', 'Phone'];

  const latestProducts = [
    { id: '1', image: '/assets/product-1.png', name: 'Perfume A', updatedAt: new Date() },
    { id: '2', image: '/assets/product-2.png', name: 'Perfume B', updatedAt: new Date() },
  ];

  const latestOrders: Array<{ id: string; customer: { name: string }; amount: number; status: 'delivered' | 'pending' | 'refunded'; createdAt: Date }> = [
    { id: 'ORD-1001', customer: { name: 'Sofia' }, amount: 120, status: 'delivered', createdAt: new Date() },
    { id: 'ORD-1002', customer: { name: 'Liam' }, amount: 80, status: 'pending', createdAt: new Date() },
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Overview
        </Typography>

        {/* Top metrics row - four compact cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <Budget value={`${taxiCount}`} trend="up" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <SamplingCompletedToday value={`${samplingCount}`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TasksProgress value={75.5} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <TotalProfit value="$15k" />
          </Grid>
        </Grid>

        {/* Daily Sampling Trend - Most Important Chart */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ minHeight: 400 }}>
              <DailySamplingTrend sx={{ height: '100%' }} />
            </Box>
          </Grid>
        </Grid>

        {/* Main content: Sales chart + Traffic card side-by-side (50% / 50%) */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box sx={{ minHeight: 365 }}>
              <Sales chartSeries={salesSeries} sx={{ height: '100%' }} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 4 }}>
            <Box sx={{ height: '100%' }}>
              <Traffic chartSeries={trafficSeries} labels={trafficLabels} sx={{ height: '100%' }} />
            </Box>
          </Grid>
        </Grid>

        {/* Secondary row: traffic, products, orders */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6, lg: 4 }}>
            <LatestProducts products={latestProducts} />
          </Grid>

          <Grid size={{ xs: 12, md: 12, lg: 8 }}>
            <LatestOrders orders={latestOrders} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
