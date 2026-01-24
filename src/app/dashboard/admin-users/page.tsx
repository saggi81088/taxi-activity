'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import axiosInstance from '@/lib/axios';
import { AdminUsersTable } from '@/components/dashboard/user-management/admin-users-table';
import type { AdminUser } from '@/components/dashboard/user-management/admin-users-table';

export default function Page(): React.JSX.Element {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axiosInstance.get('/userlist');

        // API response has data under response.data.data
        const usersData = response.data?.data || response.data?.clients || [];
        
        if (Array.isArray(usersData) && usersData.length > 0) {
          // Filter only admin users
          const adminUsers: AdminUser[] = usersData
            .filter((item: Record<string, unknown>) => item.role === 'admin')
            .map((item: Record<string, unknown>) => ({
              id: String(item.id || ''),
              name: String(item.name || ''),
              email: String(item.email || ''),
              mobile: String(item.mobile || ''),
              role: String(item.role || ''),
              createdAt: new Date(String(item.created_at || new Date().toISOString())),
              createdBy: String(item.created_by || ''),
              updatedAt: new Date(String(item.updated_at || new Date().toISOString())),
              updatedBy: String(item.updated_by || ''),
            }));

          setUsers(adminUsers);
        } else {
          setUsers([]);
        }
      } catch (error_: unknown) {
        let errorMsg = 'Failed to fetch admin users';
        if (error_ instanceof Error) {
          errorMsg = error_.message;
        } else if (typeof error_ === 'object' && error_ !== null) {
          const err = error_ as Record<string, unknown>;
          if (err.response && typeof err.response === 'object' && err.response !== null) {
            const response = err.response as Record<string, unknown>;
            if (response.data && typeof response.data === 'object' && response.data !== null) {
              const data = response.data as Record<string, unknown>;
              errorMsg = String(data.message || errorMsg);
            }
          } else if (typeof err.message === 'string') {
            errorMsg = err.message;
          }
        }
        setError(errorMsg);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Admin Users</Typography>
        <Typography color="text.secondary" variant="body2">
          View and manage all admin users
        </Typography>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {isLoading ? (
        <Stack sx={{ alignItems: 'center', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading admin users...
          </Typography>
        </Stack>
      ) : (
        <AdminUsersTable rows={users} count={users.length} />
      )}
    </Stack>
  );
}
