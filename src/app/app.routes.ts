/*
 * Application routing.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {LockComponent} from './lock/lock.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'lock', component: LockComponent },
  { path: 'register', component: RegisterComponent }
];

export const routing = RouterModule.forRoot(routes);
