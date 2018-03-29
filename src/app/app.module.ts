import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatMenuModule, MatRadioModule} from '@angular/material';
import {FormsModule, NgControl, ReactiveFormsModule} from '@angular/forms';
import {routing} from './app.routes';
import { HeaderComponent } from './shared/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LockComponent } from './lock/lock.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LockComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
