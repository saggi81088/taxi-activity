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
  taxis?: Array<Record<string, unknown>>;
}

const COLORS = ['#4CAF50', '#FFC107'];

const renderCustomLabel = ({ value }: { value: number }): string => `${value}%`;

export function SamplingCompleted({ sx, taxis = [] }: SamplingCompletedProps): React.JSX.Element {
  const [data, setData] = React.useState<Array<{ name: string; value: number }>>([
    { name: 'Completed', value: 0 },
    { name: 'In Progress', value: 0 },
  ]);
  const [isLoading, setIsLoading] = React.useState(taxis.length === 0);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSamplingStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('📈 [SamplingCompleted] Taxis prop received:', taxis.length > 0 ? `${taxis.length} items` : 'empty, will fetch from API');
        const response = taxis.length > 0 ? { data: { clients: taxis } } : await axiosInstance.get('/taxi');
        const allTaxis = response.data.clients || [];

        if (Array.isArray(allTaxis)) {
          // Count by air_freshener_installed field
          // "1" = installed (sampling completed), "0" = not installed (sampling pending)
          const completedCount = allTaxis.filter((taxi: Record<string, unknown>) => {
            const value = String(taxi.air_freshener_installed);
            return value === '1';
          }).length;

          const pendingCount = allTaxis.filter((taxi: Record<string, unknown>) => {
            const value = String(taxi.air_freshener_installed);
            return value === '0';
          }).length;

          const total = completedCount + pendingCount || 1; // Avoid division by zero

          setData([
            { name: 'Sampling Completed', value: Math.round((completedCount / total) * 100) },
            { name: 'Sampling Pending', value: Math.round((pendingCount / total) * 100) },
          ]);
        }
      } catch (error_) {
        console.error('Failed to fetch sampling status:', error_);
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
  }, [taxis]);

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
                label={renderCustomLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Card>
  );
}
