'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Box from '@mui/material/Box';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface SamplingPendingProps {
  sx?: Record<string, unknown>;
}

export function SamplingPending({ sx }: SamplingPendingProps): React.JSX.Element {

  const data = [
    { name: 'Pending', value: 45 },
    { name: 'Scheduled', value: 55 },
  ];

  const COLORS = ['#FF6B6B', '#2196F3'];

  return (
    <Card sx={sx}>
      <CardHeader title="Sampling Queue" />
      <Box sx={{ p: 2 }}>
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
      </Box>
    </Card>
  );
}
