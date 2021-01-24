/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {RouterModule, Routes} from '@angular/router';
import {RootComponent} from './components/root/root.component';
import {DashboardComponent} from './pages/dashboard/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './pages/profile/profile/profile.component';
import {ConfirmUpdateEmailComponent} from './pages/profile/confirm-update-email/confirm-update-email.component';
import {ConfirmPhoneNumberComponent} from './pages/profile/confirm-phone-number/confirm-phone-number.component';
import {AdminDashboardComponent} from './pages/admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './pages/admin/user-manager/user-manager.component';
import {AdminGuard} from './guards/admin.guard';
import {ApiKeysComponent} from './pages/dashboard/apikeys/api-keys.component';
import {SensorWizardComponent} from './pages/sensors/sensor-wizard/sensor-wizard.component';
import {SensorsListComponent} from './pages/sensors/sensors-list/sensors-list.component';
import {SensorDetailComponent} from './pages/sensors/sensor-detail/sensor-detail.component';
import {AuditlogComponent} from './pages/admin/auditlog/auditlog.component';
import {ConfirmGuard} from './guards/confirm.guard';

const routes: Routes = [
  {
    path: '', component: RootComponent, canActivate: [AuthGuard], children: [
      {path: 'overview', component: DashboardComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'api-keys', component: ApiKeysComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'confirm-update-email', component: ConfirmUpdateEmailComponent, canActivate: [AuthGuard]},
      {path: 'confirm-phone-number', component: ConfirmPhoneNumberComponent, canActivate: [AuthGuard]}
    ]
  },
  {
    path: 'sensors', component: RootComponent, canActivate: [AuthGuard, ConfirmGuard], children: [
      {path: 'create', component: SensorWizardComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: 'manager', component: SensorsListComponent, canActivate: [AuthGuard, ConfirmGuard]},
      {path: ':id', component: SensorDetailComponent, canActivate: [AuthGuard, ConfirmGuard]}
    ]
  },
  {
    path: 'admin', component: RootComponent, children: [
      {path: 'overview', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard, ConfirmGuard]},
      {path: 'user-manager', component: UserManagerComponent, canActivate: [AuthGuard, AdminGuard, ConfirmGuard]},
      {path: 'audit-logs', component: AuditlogComponent, canActivate: [AuthGuard, AdminGuard, ConfirmGuard]}
    ]
  },
  { path: '*', redirectTo: '/' }
];

export const Routing = RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' });
