"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Hide Overview page for promoters
  React.useEffect(() => {
    if (!isLoading && user && user.role === 'promoter') {
      router.push('/dashboard/taxis');
    }
  }, [user, isLoading, router]);
  const [taxiCount, setTaxiCount] = React.useState<number>(0);
  const [samplingCount, setSamplingCount] = React.useState<number>(0);
  const [taxis, setTaxis] = React.useState<Array<Record<string, unknown>>>([]);
  const [adminCount, setAdminCount] = React.useState<number>(0);
  const [promoterCount, setPromoterCount] = React.useState<number>(0);
  const [feedbackCount, setFeedbackCount] = React.useState<number>(0);
  const [dataLoading, setDataLoading] = React.useState(true);

  React.useEffect(() => {
    // Only fetch data after user is loaded and authenticated
    if (isLoading) {
      return;
    }

    const fetchAllData = async () => {
      try {
        setDataLoading(true);
        console.log('🔵 [Overview] Fetching all dashboard data in parallel...');
        
        // Fetch all data in parallel
        const [taxiRes, userlistRes, feedbackRes] = await Promise.all([
          axiosInstance.get('/taxi'),
          axiosInstance.get('/userlist'),
          axiosInstance.get('/feedback'),
        ]);
        console.log('🟢 [Overview] All dashboard data fetched successfully');

        // Process taxi data
        if (taxiRes.data.clients && Array.isArray(taxiRes.data.clients)) {
          const allTaxis = taxiRes.data.clients;
          setTaxis(allTaxis);
          setTaxiCount(allTaxis.length);

          // Count taxis from today
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
              const createdAtTime = new Date(createdAtStr).getTime();
              return createdAtTime >= todayStartTime && createdAtTime < tomorrowStartTime;
            } catch {
              return false;
            }
          }).length;
          
          setSamplingCount(todayCount);
        }

        // Process userlist data
        const usersData = userlistRes.data?.data || userlistRes.data?.clients || [];
        if (Array.isArray(usersData) && usersData.length > 0) {
          const admins = usersData.filter((u: Record<string, unknown>) => u.role === 'admin').length;
          const promoters = usersData.filter((u: Record<string, unknown>) => u.role === 'promoter').length;
          console.log(`📊 [Overview] Users - Total: ${usersData.length}, Admins: ${admins}, Promoters: ${promoters}`);
          setAdminCount(admins);
          setPromoterCount(promoters);
        } else {
          console.log('⚠️  [Overview] No user data found');
        }

        // Process feedback data
        if (feedbackRes.data.clients && Array.isArray(feedbackRes.data.clients)) {
          setFeedbackCount(feedbackRes.data.clients.length);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setTaxiCount(0);
        setSamplingCount(0);
        setAdminCount(0);
        setPromoterCount(0);
        setFeedbackCount(0);
      } finally {
        setDataLoading(false);
      }
    };

    fetchAllData();
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

        {/* First row - Admin Users, Promoter Users, Total Feedback */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <AdminCount count={adminCount} _isLoading={dataLoading} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <PromoterCount count={promoterCount} _isLoading={dataLoading} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <FeedbackCount count={feedbackCount} _isLoading={dataLoading} />
          </Grid>
        </Grid>

        {/* Second row - Total Registered Taxis & Sampling Completed Today */}
        <Grid container spacing={3} sx={{ mb: 3, justifyContent: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <Budget value={`${taxiCount}`} trend="up" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
            <SamplingCompletedToday value={`${samplingCount}`} />
          </Grid>
        </Grid>

        {/* Daily Sampling Trend with Sampling Charts - Side by Side */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Box sx={{ minHeight: 400 }}>
              <DailySamplingTrend sx={{ height: '100%' }} taxis={taxis} />
            </Box>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={3} sx={{ height: '100%' }}>
              <Grid size={{ xs: 12 }}>
                <SamplingCompleted sx={{ height: '100%' }} taxis={taxis} />
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
