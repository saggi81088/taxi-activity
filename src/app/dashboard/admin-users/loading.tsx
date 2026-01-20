import * as React from 'react';
import { PageLoader } from '@/components/core/page-loader';

export default function AdminUsersLoading(): React.JSX.Element {
  return <PageLoader message="Loading admin users..." />;
}
