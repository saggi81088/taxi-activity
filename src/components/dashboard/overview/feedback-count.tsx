'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChatCenteredDots } from '@phosphor-icons/react/dist/ssr/ChatCenteredDots';

export interface FeedbackCountProps {
  count?: number;
  _isLoading?: boolean;
}

export function FeedbackCount({ count = 0, _isLoading = false }: FeedbackCountProps): React.JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography color="text.secondary" variant="overline">
                Total Feedback
              </Typography>
              <Typography variant="h4">{count}</Typography>
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
