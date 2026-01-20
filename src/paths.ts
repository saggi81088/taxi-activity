export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard/overview',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    taxis: '/dashboard/taxis',
    feedback: '/dashboard/feedback',
    integrations: '/dashboard/integrations',
    settings: '/dashboard/settings',
    user: '/dashboard/user',
    vehicleSearch: '/dashboard/vehicle-search',
    adminUsers: '/dashboard/admin-users',
    promoterUsers: '/dashboard/promoter-users',
  },
  errors: { notFound: '/errors/not-found' },
} as const;
