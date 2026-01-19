import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'user', title: 'Users', href: paths.dashboard.user, icon: 'userfocus' },
  { key: 'vehicle-search', title: 'Vehicle Search', href: paths.dashboard.vehicleSearch, icon: 'car' },
  { key: 'taxis', title: 'Taxis', href: paths.dashboard.taxis, icon: 'taxi' },
  { key: 'feedback', title: 'Feedback', href: paths.dashboard.feedback, icon: 'note-pencil' },
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
