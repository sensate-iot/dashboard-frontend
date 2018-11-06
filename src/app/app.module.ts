import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule, MatListModule,
  MatMenuModule,
  MatRadioModule, MatSelectModule,
  MatSidenavModule, MatToolbarModule
} from '@angular/material';
import { RouterModule } from '@angular/router';
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
import {RootComponent} from './shared/root/root.component';
import { SidebarComponent } from './sidebar/sidebar.component';
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
import {AlertService} from './services/alert.service';
import { ForgotPasswordComponent } from './login/forgot-password/forgot-password.component';
import { ConfirmPhoneNumberComponent } from './dashboard/profile/confirm-phone-number/confirm-phone-number.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { UpdatePhoneNumberComponent } from './dashboard/profile/profile/update-phone-number/update-phone-number.component';
import { UpdateEmailComponent } from './dashboard/profile/profile/update-email/update-email.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './admin/user-manager/user-manager.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LockComponent,
    RegisterComponent,
    RootComponent,
    MsgIconBtnComponent,
    ImagecardComponent,
    FooterComponent,
    FigurecardComponent,
    DashboardComponent,
    SidebarComponent,
    ProfileComponent,
    ConfirmUpdateEmailComponent,
    ForgotPasswordComponent,
    ConfirmPhoneNumberComponent,
    UpdatePhoneNumberComponent,
    UpdateEmailComponent,
    UserManagerComponent,
    AdminDashboardComponent
  ],
  imports: [
    Ng2TelInputModule,
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
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
    AlertService,
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
