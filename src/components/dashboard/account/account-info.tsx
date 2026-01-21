'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useUser } from '@/hooks/use-user';

export function AccountInfo(): React.JSX.Element {
  const { user } = useUser();

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src="/assets/avatar.png" sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.name || 'User'}</Typography>
            {user?.mobile && typeof user.mobile === 'string' ? (
              <Typography color="text.secondary" variant="body2">
                {user.mobile}
              </Typography>
            ) : null}
            <Typography color="text.secondary" variant="body2">
              Goa City
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
