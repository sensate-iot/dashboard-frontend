import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { UpdatePhoneNumberComponent } from './dashboard/profile/profile/update-phone-number/update-phone-number.component';
import { UpdateEmailComponent } from './dashboard/profile/profile/update-email/update-email.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './admin/user-manager/user-manager.component';
import {AdminService} from './services/admin.service';
import { ChartCardComponent } from './shared/chart-card/chart-card.component';
import { BarChartCardComponent } from './shared/bar-chart-card/bar-chart-card.component';
import {DashBoardService} from './services/dashboard.service';
import {ApikeysComponent, CreateApiKeyDialog} from './dashboard/apikeys/apikeys.component';
import {ApiKeyService} from './services/apikey.service';
import { CreateApiKeyComponent } from './dashboard/apikeys/create-api-key/create-api-key.component';
import { ConfirmEmailComponent } from './register/confirm-email/confirm-email.component';
import { SensorsListComponent } from './sensors/sensors-list/sensors-list.component';
import {SensorWizardComponent} from './sensors/sensor-wizard/sensor-wizard.component';
import {TriggerService} from './services/trigger.service';
import {MatTableModule} from '@angular/material';
import {SensorService} from './services/sensor.service';
import {CreateActionDialog} from './sensors/create-action.dialog';
import { SensorDetailComponent } from './sensors/sensor-detail/sensor-detail.component';
import {ShowActionsDialog} from './sensors/sensor-detail/show-actions.dialog';
import { LargeChartCardComponent } from './shared/large-chart-card/large-chart-card.component';
import {DataService} from './services/data.service';
import {JsonDateInterceptorService} from './services/json-date-interceptor.service';

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
    AdminDashboardComponent,
    ChartCardComponent,
    BarChartCardComponent,
    ApikeysComponent,
    CreateApiKeyComponent,
    CreateApiKeyDialog,
    CreateActionDialog,
    ShowActionsDialog,
    ConfirmEmailComponent,
    SensorsListComponent,
    SensorWizardComponent,
    SensorDetailComponent,
    LargeChartCardComponent
  ],
  entryComponents: [
    CreateApiKeyDialog,
    CreateActionDialog,
    ShowActionsDialog
  ],
  imports: [
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
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule

  ],
  providers: [
    LoginService,
    TriggerService,
    SensorService,
    LockService,
    AccountService,
    ApiKeyService,
    AdminService,
    DashBoardService,
    DataService,
    AuthGuard,
    LockGuard,
    AlertService,
    SettingsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JsonDateInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
