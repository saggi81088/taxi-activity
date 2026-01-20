"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { AdminCount } from '@/components/dashboard/overview/admin-count';
import { PromoterCount } from '@/components/dashboard/overview/promoter-count';
import { FeedbackCount } from '@/components/dashboard/overview/feedback-count';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Budget } from '@/components/dashboard/overview/budget';
import { SamplingCompletedToday } from '@/components/dashboard/overview/sampling-completed-today';
import { DailySamplingTrend } from '@/components/dashboard/overview/daily-sampling-trend';
import { SamplingCompleted } from '@/components/dashboard/overview/sampling-completed';
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

  const latestProducts = [
    { id: '1', image: '/assets/product-1.png', name: 'Perfume A', updatedAt: new Date() },
    { id: '2', image: '/assets/product-2.png', name: 'Perfume B', updatedAt: new Date() },
  ];

  return (
    <Box sx={{ backgroundColor: 'background.default', minHeight: '100%' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Overview
        </Typography>

        {/* Top metrics row - five compact cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <Budget value={`${taxiCount}`} trend="up" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <SamplingCompletedToday value={`${samplingCount}`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <AdminCount />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <PromoterCount />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 2.4 }}>
            <FeedbackCount />
          </Grid>
        </Grid>

        {/* Daily Sampling Trend with Sampling Charts - Side by Side */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ minHeight: 400 }}>
              <DailySamplingTrend sx={{ height: '100%' }} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid size={{ xs: 12 }}>
                <SamplingCompleted sx={{ height: '100%' }} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* Secondary row: Latest Products */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <LatestProducts products={latestProducts} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
