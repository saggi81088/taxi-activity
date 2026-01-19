'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import EmployeeSignUpForm from '@/components/dashboard/employee/employee-signup-form';
import { useUser } from '@/hooks/use-user';

export default function EmployeePage(): React.JSX.Element {
  const router = useRouter();
  const { user, isLoading } = useUser();

  // Hide Users page for promoters
  React.useEffect(() => {
    if (!isLoading && user && user.role === 'promoter') {
      router.push('/dashboard/overview');
    }
  }, [user, isLoading, router]);

  const handleUserSubmit = React.useCallback(
    async (_values: Record<string, unknown>) => {
      try {
        // Handle user sign-up submission
      } catch {
        // Error handling
      }
    },
    []
  );

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '500px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Not authenticated. Please sign in.</Alert>
      </Container>
    );
  }

  if (user.role === 'promoter') {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning">You do not have access to this page.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <EmployeeSignUpForm onSubmit={handleUserSubmit} userRole={user.role} />
      </Stack>
    </Container>
  );
}
