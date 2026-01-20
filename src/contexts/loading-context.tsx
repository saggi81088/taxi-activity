'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export interface LoadingContextType {
  isNavigating: boolean;
}

export const LoadingContext = React.createContext<LoadingContextType | undefined>(undefined);

export interface LoadingProviderProps {
  children: React.ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps): React.JSX.Element {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = React.useState(false);

  // Track navigation changes
  React.useEffect(() => {
    const handleStart = (): void => {
      setIsNavigating(true);
    };

    // Add event listeners for route changes
    window.addEventListener('beforeunload', handleStart);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
    };
  }, [router]);

  return (
    <LoadingContext.Provider value={{ isNavigating }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading(): LoadingContextType {
  const context = React.useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
