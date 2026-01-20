'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

export function PageLoader({ message = 'Loading...', fullScreen = true }: PageLoaderProps): React.JSX.Element {
  const theme = useTheme();

  const loaderContent = (
    <Stack
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary" align="center">
        {message}
      </Typography>
    </Stack>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          alignItems: 'center',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          left: 0,
          position: 'fixed',
          top: 0,
          width: '100%',
          zIndex: 9999,
        }}
      >
        {loaderContent}
      </Box>
    );
  }

  return (
    <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', py: 8 }}>
      {loaderContent}
    </Box>
  );
}
