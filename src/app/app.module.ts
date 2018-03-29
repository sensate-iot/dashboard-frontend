import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AppRoutingModule} from './app.routing';
import {RouterModule} from '@angular/router';
import {ComponentsModule} from './components/components.module';
import { LoginComponent } from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
