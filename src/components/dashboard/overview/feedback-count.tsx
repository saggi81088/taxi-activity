'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { ChatCenteredDots } from '@phosphor-icons/react/dist/ssr/ChatCenteredDots';
import axiosInstance from '@/lib/axios';

export function FeedbackCount(): React.JSX.Element {
  const [feedbackCount, setFeedbackCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchFeedbackCount = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get('/feedback');
        
        // Check for both 'clients' and 'data' keys as the API might return either
        const feedbackData = response.data.clients || response.data.data || [];
        if (Array.isArray(feedbackData)) {
          setFeedbackCount(feedbackData.length);
        }
      } catch (err) {
        console.error('Failed to fetch feedback count:', err);
        setError('Failed to load feedback count');
        setFeedbackCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbackCount();
  }, []);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Feedback
              </Typography>
              {isLoading ? (
                <CircularProgress size={32} />
              ) : (
                <Typography variant="h4">{feedbackCount}</Typography>
              )}
            </Stack>
            <Avatar sx={{ backgroundColor: 'var(--mui-palette-info-main)', height: '56px', width: '56px' }}>
              <ChatCenteredDots fontSize="var(--icon-fontSize-lg)" />
            </Avatar>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
