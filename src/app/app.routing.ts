/*
 * Angular routing file.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {LoginComponent} from './login/login.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})

export class AppRoutingModule { }
