import { redirect } from 'next/navigation';

import { paths } from '@/paths';

export default function Page() {
  redirect(paths.dashboard.vehicleSearch);
  return null;
}
