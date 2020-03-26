/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {RouterModule, Routes} from '@angular/router';
import {LockComponent} from './pages/lock/lock.component';
import {RootComponent} from './components/root/root.component';
import {DashboardComponent} from './pages/dashboard/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './pages/profile/profile/profile.component';
import {LockGuard} from './guards/lock.guard';
import {ConfirmUpdateEmailComponent} from './pages/profile/confirm-update-email/confirm-update-email.component';
import {ConfirmPhoneNumberComponent} from './pages/profile/confirm-phone-number/confirm-phone-number.component';
import {AdminDashboardComponent} from './pages/admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './pages/admin/user-manager/user-manager.component';
import {AdminGuard} from './guards/admin.guard';
import {ApikeysComponent} from './pages/dashboard/apikeys/apikeys.component';
import {SensorWizardComponent} from './pages/sensors/sensor-wizard/sensor-wizard.component';
import {SensorsListComponent} from './pages/sensors/sensors-list/sensors-list.component';
import {SensorDetailComponent} from './pages/sensors/sensor-detail/sensor-detail.component';
import {QueryToolComponent} from './pages/sensors/query-tool/query-tool.component';
import {MapToolComponent} from './pages/sensors/map-tool/map-tool.component';
import {AuditlogComponent} from './pages/admin/auditlog/auditlog.component';
import {ConfirmGuard} from './guards/confirm.guard';

const routes: Routes = [
  {
    path: '', component: RootComponent, canActivate: [AuthGuard, LockGuard], children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'api-keys', component: ApikeysComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: 'confirm-update-email', component: ConfirmUpdateEmailComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'confirm-phone-number', component: ConfirmPhoneNumberComponent, canActivate: [AuthGuard, LockGuard]}
    ]
  },
  {
    path: 'sensors', component: RootComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard], children: [
      {path: 'create', component: SensorWizardComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: 'manager', component: SensorsListComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: 'query-tool', component: QueryToolComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: 'map-tool', component: MapToolComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]},
      {path: ':id', component: SensorDetailComponent, canActivate: [AuthGuard, LockGuard, ConfirmGuard]}
    ]
  },
  {path: 'index', redirectTo: '/dashboard'},
  {path: 'lock', component: LockComponent, canActivate: [AuthGuard, ConfirmGuard]},
  {
    path: 'admin', component: RootComponent, children: [
      {path: 'home', component: AdminDashboardComponent, canActivate: [AuthGuard, LockGuard, AdminGuard, ConfirmGuard]},
      {path: 'user-manager', component: UserManagerComponent, canActivate: [AuthGuard, LockGuard, AdminGuard, ConfirmGuard]},
      {path: 'audit-logs', component: AuditlogComponent, canActivate: [AuthGuard, LockGuard, AdminGuard, ConfirmGuard]}
    ]
  },
  {path: '*', redirectTo: '/dashboard', canActivate: [AuthGuard, ConfirmGuard]}
];

export const Routing = RouterModule.forRoot(routes);
