'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  const [hasChecked, setHasChecked] = React.useState<boolean>(false);

  React.useEffect(() => {
    // Only run check once
    if (hasChecked) return;

    // If still loading the user from session, wait
    if (isLoading) {
      return;
    }

    setHasChecked(true);

    // If there's an error, allow render to show sign-in page
    if (error) {
      setIsChecking(false);
      return;
    }

    // If user is authenticated, redirect to dashboard
    if (user) {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
      router.replace(paths.dashboard.overview);
      return;
    }

    // User is not authenticated - allow access to guest page (sign-in)
    setIsChecking(false);
  }, [isLoading, user, error, hasChecked, router]);

  // Show nothing while checking
  if (isChecking) {
    return null;
  }

  // Show error if there is one
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Render children (sign-in page)
  return <React.Fragment>{children}</React.Fragment>;
}
