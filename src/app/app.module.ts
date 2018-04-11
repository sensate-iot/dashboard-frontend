import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {MatButtonModule, MatCheckboxModule, MatInputModule, MatMenuModule, MatRadioModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Routing} from './app.routes';
import { HeaderComponent } from './shared/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LockComponent } from './lock/lock.component';
import { RegisterComponent } from './register/register.component';
import {LoginService} from './services/login.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefreshTokenInterceptorService} from './services/refreshtokeninterceptor.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RootComponent} from './dashboard/root/root.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {NavbarComponent} from './shared/navbar/navbar.component';
import {MsgIconBtnComponent} from './shared/msgiconbtn/msgiconbtn.component';
import {ImagecardComponent} from './shared/imagecard/imagecard.component';
import {FooterComponent} from './shared/footer/footer.component';
import {FigurecardComponent} from './shared/figurecard/figurecard.component';
import {SettingsService} from './services/settings.service';
import {AuthGuard} from './guards/auth.guard';
import { ProfileComponent } from './dashboard/profile/profile/profile.component';
import {LockGuard} from './guards/lock.guard';
import {LockService} from './services/lock.service';
import { ConfirmUpdateEmailComponent } from './dashboard/profile/confirm-update-email/confirm-update-email.component';
import {AccountService} from './services/account.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LockComponent,
    RegisterComponent,
    RootComponent,
    NavbarComponent,
    MsgIconBtnComponent,
    ImagecardComponent,
    FooterComponent,
    FigurecardComponent,
    DashboardComponent,
    SidebarComponent,
    ProfileComponent,
    ConfirmUpdateEmailComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatMenuModule,
    MatCheckboxModule
  ],
  providers: [
    LoginService,
    LockService,
    AccountService,
    AuthGuard,
    LockGuard,
    SettingsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
