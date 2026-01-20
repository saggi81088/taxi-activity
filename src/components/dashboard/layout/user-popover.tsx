import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { UserIcon } from '@phosphor-icons/react/dist/ssr/User';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/client';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const { user } = useUser();
  const { checkSession } = useUser();

  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      // Close the popover first
      onClose();
      
      // Show loading overlay immediately
      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        logger.error('Sign out error', error);
        setIsSigningOut(false);
        return;
      }

      // Refresh the auth state
      await checkSession?.();

      // Add a small delay to ensure state updates before navigation
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to sign-in page
      router.push(paths.auth.signIn);
    } catch (error) {
      logger.error('Sign out error', error);
      setIsSigningOut(false);
    }
  }, [checkSession, router, onClose]);

  return (
    <>
      {/* Full-screen loading overlay */}
      {isSigningOut && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Signing out...
          </Typography>
        </Box>
      )}

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={onClose}
        open={open && !isSigningOut}
        slotProps={{ paper: { sx: { width: '240px' } } }}
      >
        <Box sx={{ p: '16px 20px ' }}>
          <Typography variant="subtitle1">{user?.name || 'User'}</Typography>
          <Typography color="text.secondary" variant="body2">
            {user?.email || ''}
          </Typography>
        </Box>
        <Divider />
        <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
          <MenuItem component={RouterLink} href={paths.dashboard.account} onClick={onClose}>
            <ListItemIcon>
              <UserIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={handleSignOut} disabled={isSigningOut}>
            <ListItemIcon>
              <SignOutIcon fontSize="var(--icon-fontSize-md)" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
