'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import axiosInstance from '@/lib/axios';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { useUser } from '@/hooks/use-user';
import { FeedbackTable } from '@/components/dashboard/feedback/feedback-table';
import type { Feedback } from '@/components/dashboard/feedback/feedback-table';

export default function Page(): React.JSX.Element {
  const { user } = useUser();
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch feedbacks from API
  React.useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem('custom-auth-token');

        if (!token) {
          setError('Authentication token not found. Please login again.');
          setIsLoading(false);
          return;
        }

        const response = await axiosInstance.get('/feedback');

        // Map API response to Feedback interface
        if (response.data && response.data.clients && Array.isArray(response.data.clients)) {
          let mappedFeedbacks: Feedback[] = response.data.clients.map((item: Record<string, unknown>) => {
            const feedback: Feedback = {
              id: String(item.id || ''),
              taxiNumber: String(item.taxi_number || ''),
              driverName: String(item.driver_name || ''),
              fragrance: String(item.fragrance || ''),
              email: String(item.promotor_id || ''),
              isLiked: String(item.is_liked || '0'),
              hasPassengerLiked: String(item.has_passenger_liked || '0'),
              willUseAgain: String(item.will_use_again || '0'),
              comments: String(item.comments || ''),
              createdAt: new Date(String(item.created_at || new Date().toISOString())),
            };
            return feedback;
          });

          // Filter by user role - promoters only see their own feedback
          if (user?.role === 'promoter' && user?.email) {
            mappedFeedbacks = mappedFeedbacks.filter((feedback) => feedback.email === user.email);
          }

          // Sort by createdAt in descending order (latest first)
          mappedFeedbacks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          setFeedbacks(mappedFeedbacks);
        } else {
          setFeedbacks([]);
        }
      } catch (error_: unknown) {
        let errorMsg = 'Failed to fetch feedbacks';
        if (error_ instanceof Error) {
          errorMsg = error_.message;
        } else if (typeof error_ === 'object' && error_ !== null) {
          const err = error_ as Record<string, unknown>;
          if (err.response && typeof err.response === 'object' && err.response !== null) {
            const response = err.response as Record<string, unknown>;
            if (response.data && typeof response.data === 'object' && response.data !== null) {
              const data = response.data as Record<string, unknown>;
              errorMsg = String(data.message || errorMsg);
            }
          } else if (typeof err.message === 'string') {
            errorMsg = err.message;
          }
        }
        setError(errorMsg);
        setFeedbacks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [user?.role, user?.email]);

  const handleExport = () => {
    const dataToExport = user?.role === 'promoter' && user?.email
      ? feedbacks.filter((feedback) => feedback.email === user.email)
      : feedbacks;

    if (dataToExport.length === 0) {
      alert('No data to export');
      return;
    }

    // Prepare data for Excel
    const excelData = dataToExport.map((feedback) => ({
      'Taxi Number': feedback.taxiNumber,
      'Driver Name': feedback.driverName,
      'Fragrance': feedback.fragrance,
      'Email': feedback.email,
      'Liked': feedback.isLiked === '1' ? 'Yes' : 'No',
      'Passenger Liked': feedback.hasPassengerLiked === '1' ? 'Yes' : 'No',
      'Will Use Again': feedback.willUseAgain === '1' ? 'Yes' : 'No',
      'Comments': feedback.comments,
      'Submitted': dayjs(feedback.createdAt).format('MMM D, YYYY'),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Feedbacks');

    // Generate filename with current date
    const filename = `feedbacks_${dayjs().format('YYYY-MM-DD')}.xlsx`;

    // Write the file
    XLSX.writeFile(workbook, filename);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }} flex="1">
        <div>
          <Typography variant="h4">Feedbacks</Typography>
        </div>
        <Button
          startIcon={<DownloadIcon fontSize="var(--icon-fontSize-lg)" />}
          variant="contained"
          onClick={handleExport}
          disabled={isLoading || feedbacks.length === 0}
        >
          Download as Excel
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading feedbacks...
          </Typography>
        </Stack>
      ) : (
        <FeedbackTable rows={feedbacks} count={feedbacks.length} />
      )}
    </Stack>
  );
}
