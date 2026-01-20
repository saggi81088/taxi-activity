'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '@/lib/axios';

interface SamplingCompletedProps {
  sx?: Record<string, unknown>;
}

export function SamplingCompleted({ sx }: SamplingCompletedProps): React.JSX.Element {
  const [data, setData] = React.useState<Array<{ name: string; value: number }>>([
    { name: 'Completed', value: 0 },
    { name: 'In Progress', value: 0 },
  ]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSamplingStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get('/taxi');
        
        if (response.data.clients && Array.isArray(response.data.clients)) {
          const taxis = response.data.clients;

          // Count by air_freshener_installed field
          // "1" = installed (sampling completed), "0" = not installed (sampling pending)
          const completedCount = taxis.filter((taxi: Record<string, unknown>) => {
            return String(taxi.air_freshener_installed) === '1';
          }).length;

          const pendingCount = taxis.filter((taxi: Record<string, unknown>) => {
            return String(taxi.air_freshener_installed) === '0';
          }).length;

          const total = completedCount + pendingCount || 1; // Avoid division by zero

          setData([
            { name: 'Sampling Completed', value: Math.round((completedCount / total) * 100) },
            { name: 'Sampling Pending', value: Math.round((pendingCount / total) * 100) },
          ]);
        }
      } catch (err) {
        console.error('Failed to fetch sampling status:', err);
        setError('Failed to load sampling data');
        // Keep showing zeros on error
        setData([
          { name: 'Completed', value: 0 },
          { name: 'In Progress', value: 0 },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSamplingStatus();
  }, []);

  const COLORS = ['#4CAF50', '#FFC107'];

  return (
    <Card sx={sx}>
      <CardHeader title="Sampling Status" />
      <Box sx={{ p: 2 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : isLoading ? (
          <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 8 }}>
            <p>Loading...</p>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Card>
  );
}
