/*
 * Sidebar routes.
 */

export const ROUTES = [
  { path: '/dashboard', title: 'Dashboard', admin: false, icon: 'dashboard', children: null },
  { path: '#admin-tools', id: 'admin-tools', admin: true, title: 'Administrative tools', icon: 'apps', children: [
      {path: '/admin/home', title: 'Dashboard', icon: 'DB'},
      {path: '/admin/user-manager', title: 'User manager', icon: 'UM'}
    ] },
  { path: '/dashboard/profile', title: 'User Profile', admin: false, icon: 'person', children: null },
  { path: 'table', title: 'Table List', admin: false, icon: 'content_paste', children: null },
  { path: '#component', id: 'component', admin: false, title: 'Component', icon: 'apps', children: [
      {path: 'components/price-table', title: 'Price Table', icon: 'PT'},
      {path: 'components/panels', title: 'Panels', icon: 'P'},
      {path: 'components/wizard', title: 'Wizard', icon: 'W'},
    ]},
  { path: 'notification', title: 'Notification', admin: false, icon: 'notifications', children: null },
  { path: 'alert', title: 'Sweet Alert', admin: false, icon: 'warning', children: null },
  { path: 'settings', title: 'Settings', admin: false, icon: 'settings', children: null },
];
