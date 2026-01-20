import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'vehicle-search', title: 'Vehicle Search', href: paths.dashboard.vehicleSearch, icon: 'car' },
  { key: 'taxis', title: 'Taxis', href: paths.dashboard.taxis, icon: 'taxi' },
  { key: 'feedback', title: 'Feedback', href: paths.dashboard.feedback, icon: 'note-pencil' },
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'user', title: 'Users', href: paths.dashboard.user, icon: 'userfocus' },
  {
    key: 'user-management',
    title: 'User Management',
    icon: 'users',
    items: [
      { key: 'admin-users', title: 'Admin Users', href: paths.dashboard.adminUsers },
      { key: 'promoter-users', title: 'Promoter Users', href: paths.dashboard.promoterUsers },
    ],
  },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
