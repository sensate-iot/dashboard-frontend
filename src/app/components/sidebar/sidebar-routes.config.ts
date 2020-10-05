/*
 * Sidebar routes.
 */

export const ROUTES = [
  {
    path: '#dashboard', id: 'dashboard', title: 'Dashboard', admin: false, icon: 'dashboard', children: [
      {path: '/overview', title: 'Dashboard', icon: ''},
      {path: '/api-keys', title: 'API keys', icon: ''}
    ]
  },
  {
    path: '#admin-tools', id: 'admin-tools', admin: true, title: 'Administrative tools', icon: 'vpn_key', children: [
      {path: '/admin/overview', title: 'Dashboard', icon: ''},
      {path: '/admin/user-manager', title: 'User manager', icon: ''},
      {path: '/admin/audit-logs', title: 'Audit logs', icon: ''}
    ]
  },
  {
    path: '#sensor-management', id: 'sensor-management', admin: false, title: 'Sensor Management', icon: 'timeline', children: [
      {path: '/sensors/create', title: 'Create sensor', icon: ''},
      {path: '/sensors/manager', title: 'Sensor Manager', icon: ''},
    ]
  },
  {path: '/profile', title: 'User Profile', admin: false, icon: 'person', children: null}
];
