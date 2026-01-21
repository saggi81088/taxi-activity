'use client';

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useUser } from '@/hooks/use-user';

export function AccountDetailsForm(): React.JSX.Element {
  const { user } = useUser();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="User profile information" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <OutlinedInput 
                  label="Name" 
                  name="name" 
                  value={user?.name || ''} 
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput 
                  label="Email address" 
                  name="email" 
                  value={user?.email || ''} 
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Mobile number</InputLabel>
                <OutlinedInput 
                  label="Mobile number" 
                  name="mobile" 
                  type="tel"
                  value={user?.mobile || ''}
                  readOnly
                />
              </FormControl>
            </Grid>
            <Grid
              size={{
                md: 6,
                xs: 12,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <OutlinedInput 
                  label="Role" 
                  name="role" 
                  value={user?.role || ''} 
                  readOnly
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}
