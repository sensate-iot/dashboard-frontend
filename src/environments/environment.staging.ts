export const environment = {
  production: false,
  authApiHost: 'https://api.staging.sensateiot.com/auth/v1',
  dashboardApiHost: 'https://api.staging.sensateiot.com/stats/v1',
  networkApiHost: 'https://api.staging.sensateiot.com/network/v1',
  dataApiHost: 'https://api.staging.sensateiot.com/data/v1',
  liveDataHost: 'wss://api.staging.sensateiot.com:443/live/v1/measurements',

  appsMap: {
    login: 'https://login.staging.sensateiot.com',
    dashboard: 'https://dashboard.staging.sensateiot.com',
    datawhere: 'https://datawhere.staging.sensateiot.com',
    home: 'https://staging.sensateiot.com'
  }
};
