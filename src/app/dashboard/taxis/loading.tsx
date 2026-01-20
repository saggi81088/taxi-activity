import * as React from 'react';
import { PageLoader } from '@/components/core/page-loader';

export default function TaxisLoading(): React.JSX.Element {
  return <PageLoader message="Loading taxis..." />;
}
