/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {RouterModule, Routes, CanActivate} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LockComponent} from './lock/lock.component';
import {RegisterComponent} from './register/register.component';
import {RootComponent} from './dashboard/root/root.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {ProfileComponent} from './dashboard/profile/profile/profile.component';
import {LockGuard} from './guards/lock.guard';
import {ConfirmUpdateEmailComponent} from './dashboard/profile/confirm-update-email/confirm-update-email.component';
import {ForgotPasswordComponent} from './login/forgot-password/forgot-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'reset-password/:email', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },
  { path: 'lock', component: LockComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: RootComponent, children: [
      {path: '', component: DashboardComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard, LockGuard]},
      {path: 'confirm-update-email', component: ConfirmUpdateEmailComponent, canActivate: [AuthGuard, LockGuard]}
  ]}
];

export const Routing = RouterModule.forRoot(routes);
