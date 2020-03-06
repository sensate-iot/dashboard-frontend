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
    path: '#admin-tools', id: 'admin-tools', admin: true, title: 'Administrative tools', icon: 'vpn_key', children: [
      {path: '/admin/home', title: 'Dashboard', icon: 'DB'},
      {path: '/admin/user-manager', title: 'User manager', icon: 'UM'}
    ]
  },
  {
    path: '#sensor-management', id: 'sensor-management', admin: false, title: 'Sensor Management', icon: 'timeline', children: [
      {path: '/sensors/create', title: 'Create sensor', icon: 'DB'},
      {path: '/sensors/manager', title: 'Sensor Manager', icon: 'UM'},
    ]
  },
  {path: '/sensors/query-tool', title: 'Query Tool', icon: 'code', admin: false, children: null},
  {path: '/sensors/map-tool', title: 'Map Tool', icon: 'map', admin: false, children: null},
  {path: '/profile', title: 'User Profile', admin: false, icon: 'person', children: null}
];
