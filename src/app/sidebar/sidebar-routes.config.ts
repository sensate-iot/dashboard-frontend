/*
 * Sidebar routes.
 */

export const ROUTES = [
  {
    path: '#dashboard', id: 'dashboard', title: 'Dashboard', admin: false, icon: 'dashboard', children: [
      {path: '/dashboard', title: 'Dashboard', icon: 'DB'},
      {path: '/api-keys', title: 'API keys', icon: 'API'}
    ]
  },
  {
    path: '#admin-tools', id: 'admin-tools', admin: true, title: 'Administrative tools', icon: 'apps', children: [
      {path: '/admin/home', title: 'Dashboard', icon: 'DB'},
      {path: '/admin/user-manager', title: 'User manager', icon: 'UM'}
    ]
  },
  {path: '/profile', title: 'User Profile', admin: false, icon: 'person', children: null},
  {path: 'table', title: 'Table List', admin: false, icon: 'content_paste', children: null},
  {
    path: '#sensor-management', id: 'sensor-management', admin: false, title: 'Sensor Management', icon: 'apps', children: [
      {path: '/sensors/create', title: 'Create sensor', icon: 'DB'},
      {path: '/sensors/manager', title: 'Sensor Manager', icon: 'UM'}
    ]
  },
  {path: 'notification', title: 'Notification', admin: false, icon: 'notifications', children: null},
  {path: 'alert', title: 'Sweet Alert', admin: false, icon: 'warning', children: null},
  {path: 'settings', title: 'Settings', admin: false, icon: 'settings', children: null},
];
