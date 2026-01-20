'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useUsers } from '@/hooks/use-users';

export function PromoterCount(): React.JSX.Element {
  const { promoterCount, isLoading } = useUsers();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" variant="overline" sx={{ fontWeight: 500 }}>
              Promoter Users
            </Typography>
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
                {promoterCount}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              borderRadius: '50%',
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            👥
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
