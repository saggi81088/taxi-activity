'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [hasChecked, setHasChecked] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Only run check once
    if (hasChecked) return;

    // If still loading the user from session, wait (don't mark as checked)
    if (isLoading) {
      return;
    }

    setHasChecked(true);

    // At this point, isLoading is false and we've done our check
    // If there's an error or no user, the useEffect will have prevented this from being reached
    // If user exists, we allow access
    // If neither error nor user, redirect to sign-in
    if (!user && !error) {
      // No token and no user - redirect to sign-in
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
    }
  }, [isLoading, user, error, hasChecked, router]);

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show error if there is one
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Only render children if user is authenticated
  if (!user) {
    return null;
  }

  // Render children (authenticated user only)
  return <React.Fragment>{children}</React.Fragment>;
}
