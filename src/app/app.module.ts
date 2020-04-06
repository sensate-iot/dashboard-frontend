import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
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
import { HeaderComponent } from './components/header/header.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginService} from './services/login.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {RefreshTokenInterceptorService} from './services/refreshtokeninterceptor.service';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import {RootComponent} from './components/root/root.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {ImagecardComponent} from './components/imagecard/imagecard.component';
import {FigurecardComponent} from './components/figurecard/figurecard.component';
import {SettingsService} from './services/settings.service';
import {AuthGuard} from './guards/auth.guard';
import { ProfileComponent } from './pages/profile/profile/profile.component';
import { ConfirmUpdateEmailComponent } from './pages/profile/confirm-update-email/confirm-update-email.component';
import {AccountService} from './services/account.service';
import {AlertService} from './services/alert.service';
import { ConfirmPhoneNumberComponent } from './pages/profile/confirm-phone-number/confirm-phone-number.component';
import { UpdatePhoneNumberComponent } from './components/update-phone-number/update-phone-number.component';
import { UpdateEmailComponent } from './components/update-email/update-email.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import {UserManagerComponent} from './pages/admin/user-manager/user-manager.component';
import {AdminService} from './services/admin.service';
import { ChartCardComponent } from './components/chart-card/chart-card.component';
import { BarChartCardComponent } from './components/bar-chart-card/bar-chart-card.component';
import {DashBoardService} from './services/dashboard.service';
import {ApiKeysComponent, CreateApiKeyDialog} from './pages/dashboard/apikeys/api-keys.component';
import {ApiKeyService} from './services/apikey.service';
import { SensorsListComponent } from './pages/sensors/sensors-list/sensors-list.component';
import {SensorWizardComponent} from './pages/sensors/sensor-wizard/sensor-wizard.component';
import {TriggerService} from './services/trigger.service';
import { MatTableModule } from '@angular/material/table';
import {SensorService} from './services/sensor.service';
import {CreateActionDialog} from './dialogs/create-action/create-action.dialog';
import { SensorDetailComponent } from './pages/sensors/sensor-detail/sensor-detail.component';
import {ShowActionsDialog} from './pages/sensors/sensor-detail/show-actions.dialog';
import { LargeChartCardComponent } from './components/large-chart-card/large-chart-card.component';
import {DataService} from './services/data.service';
import {JsonDateInterceptorService} from './services/json-date-interceptor.service';
import { QueryToolComponent } from './pages/sensors/query-tool/query-tool.component';
import { QueryBuilderDialog } from './pages/sensors/query-builder-dialog/query-builder.dialog';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import { MapToolComponent } from './pages/sensors/map-tool/map-tool.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {GraphService} from './services/graph.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {WebSocketService} from './services/websocket.service';
import {RealTimeDataService} from './services/realtimedata.service';
import { SensorSelectComponent } from './pages/sensors/sensor-select/sensor-select.component';
import { AddSensorLinkDialog } from './pages/sensors/sensors-list/add-sensor-link-dialog/add-sensor-link-dialog.component';
import { AuditlogComponent } from './pages/admin/auditlog/auditlog.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {AuditlogService} from './services/auditlog.service';
import {CookieService} from 'ngx-cookie-service';
import {AppsService} from './services/apps.service';
import {MatStepperModule} from '@angular/material/stepper';
import { UpdateSensorDialog } from './dialogs/update-sensor/update-sensor.dialog';
import { ShowSensorSecretsDialog } from './dialogs/show-sensor-secrets/show-sensor-secrets.dialog';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RootComponent,
    ImagecardComponent,
    FigurecardComponent,
    DashboardComponent,
    SidebarComponent,
    ProfileComponent,
    ConfirmUpdateEmailComponent,
    ConfirmPhoneNumberComponent,
    UpdatePhoneNumberComponent,
    UpdateEmailComponent,
    UserManagerComponent,
    AdminDashboardComponent,
    ChartCardComponent,
    BarChartCardComponent,
    ApiKeysComponent,
    CreateApiKeyDialog,
    UpdateSensorDialog,
    CreateActionDialog,
    QueryBuilderDialog,
    ShowActionsDialog,
    SensorsListComponent,
    SensorWizardComponent,
    SensorDetailComponent,
    LargeChartCardComponent,
    QueryToolComponent,
    MapToolComponent,
    SensorSelectComponent,
    AddSensorLinkDialog,
    AuditlogComponent,
    ShowSensorSecretsDialog,
    DeleteUserComponent
  ],
  entryComponents: [
    UpdateSensorDialog,
    CreateApiKeyDialog,
    CreateActionDialog,
    ShowActionsDialog,
    QueryBuilderDialog,
    AddSensorLinkDialog,
    ShowSensorSecretsDialog
  ],
  imports: [
    LeafletModule.forRoot(),
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Routing,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatStepperModule,
    MatListModule,
    MatIconModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule

  ],
  providers: [
    CookieService,
    AppsService,
    LoginService,
    AuditlogService,
    TriggerService,
    SensorService,
    AccountService,
    ApiKeyService,
    RealTimeDataService,
    WebSocketService,
    AdminService,
    DashBoardService,
    DataService,
    GraphService,
    AuthGuard,
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
