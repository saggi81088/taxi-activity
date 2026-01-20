import * as React from 'react';
import { PageLoader } from '@/components/core/page-loader';

export default function OverviewLoading(): React.JSX.Element {
  return <PageLoader message="Loading overview..." />;
}
