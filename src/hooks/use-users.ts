'use client';

import * as React from 'react';
import axiosInstance from '@/lib/axios';

interface UseUsersReturn {
  adminCount: number;
  promoterCount: number;
  isLoading: boolean;
  error: string | null;
}

export function useUsers(): UseUsersReturn {
  const [adminCount, setAdminCount] = React.useState<number>(0);
  const [promoterCount, setPromoterCount] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUserCounts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get('/userlist');

        if (response.data && response.data.clients && Array.isArray(response.data.clients)) {
          const clients = response.data.clients;
          const admins = clients.filter((user: Record<string, unknown>) => user.role === 'admin').length;
          const promoters = clients.filter((user: Record<string, unknown>) => user.role === 'promoter').length;
          
          setAdminCount(admins);
          setPromoterCount(promoters);
        } else {
          setAdminCount(0);
          setPromoterCount(0);
        }
      } catch (error_: unknown) {
        console.error('Failed to fetch user counts:', error_);
        setError('Failed to fetch user counts');
        setAdminCount(0);
        setPromoterCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserCounts();
  }, []);

  return {
    adminCount,
    promoterCount,
    isLoading,
    error,
  };
}
