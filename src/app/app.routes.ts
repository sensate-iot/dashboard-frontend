/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LockComponent} from './lock/lock.component';
import {RegisterComponent} from './register/register.component';
import {RootComponent} from './shared/root/root.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './dashboard/profile/profile/profile.component';
import {LockGuard} from './guards/lock.guard';
import {ConfirmUpdateEmailComponent} from './dashboard/profile/confirm-update-email/confirm-update-email.component';
import {ForgotPasswordComponent} from './login/forgot-password/forgot-password.component';
import {ConfirmPhoneNumberComponent} from './dashboard/profile/confirm-phone-number/confirm-phone-number.component';
import {AdminDashboardComponent} from './admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './admin/user-manager/user-manager.component';
import {AdminGuard} from './guards/admin.guard';
import {ApikeysComponent} from './dashboard/apikeys/apikeys.component';
import {ConfirmEmailComponent} from './register/confirm-email/confirm-email.component';
import {SensorWizardComponent} from './sensors/sensor-wizard/sensor-wizard.component';
import {SensorsListComponent} from './sensors/sensors-list/sensors-list.component';
import {SensorDetailComponent} from './sensors/sensor-detail/sensor-detail.component';

const routes: Routes = [
  {
    path: '', component: RootComponent, canActivate: [AuthGuard, LockGuard], children: [
      {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'api-keys', component: ApikeysComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'confirm-email-update-email', component: ConfirmUpdateEmailComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'confirm-email-phone-number', component: ConfirmPhoneNumberComponent, canActivate: [AuthGuard, LockGuard]}
    ]
  },
  {
    path: 'sensors', component: RootComponent, canActivate: [AuthGuard, LockGuard], children: [
      {path: 'create', component: SensorWizardComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'manager', component: SensorsListComponent, canActivate: [AuthGuard, LockGuard]},
      {path: ':id', component: SensorDetailComponent, canActivate: [AuthGuard, LockGuard]}
    ]
  },
  {path: 'confirm/:id/:token', component: ConfirmEmailComponent},
  {path: 'index', redirectTo: '/dashboard'},
  {path: 'login', component: LoginComponent},
  {path: 'reset-password/:email', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ForgotPasswordComponent},
  {path: 'lock', component: LockComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent},
  {
    path: 'admin', component: RootComponent, children: [
      {path: 'home', component: AdminDashboardComponent, canActivate: [AuthGuard, LockGuard, AdminGuard]},
      {path: 'user-manager', component: UserManagerComponent, canActivate: [AuthGuard, LockGuard, AdminGuard]}

    ]
  },
  {path: '*', redirectTo: '/dashboard', canActivate: [AuthGuard]}
];

export const Routing = RouterModule.forRoot(routes);
