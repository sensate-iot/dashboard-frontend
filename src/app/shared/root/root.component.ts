/*
 * Dashboard root component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {SettingsService} from '../../services/settings.service';
import {Router} from '@angular/router';
import {LockService} from '../../services/lock.service';
import {LoginService} from '../../services/login.service';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';
import {AppsService} from '../../services/apps.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent implements OnInit, OnDestroy {
  public id : number;
  public backgroundColor : string;

  constructor(private lock : LockService, private auth : LoginService, private accounts : AccountService,
              private apps: AppsService,
              private settings : SettingsService, private alerts : AlertService, private router : Router) {
  }

  public async ngOnInit() {
    this.auth.readAuthCookie();
    this.id = this.settings.getSidebarImageIndex();
    this.backgroundColor = this.settings.getSidebarColor();
    this.accounts.checkPhoneConfirmed().then(result => {
      if(!result) {
        this.router.navigate(['/confirm-phone-number']);
      }
    });
    await this.accounts.checkAndStoreRoles();
    this.auth.setUserId();
  }

  ngOnDestroy() {
  }

  public phoneIsConfirmed() : boolean {
    return AccountService.phoneIsConfirmed();
  }

  public isAdministrator() : boolean {
    return AccountService.isAdmin();
  }

  public logoutClicked() {
    this.auth.logout().then(() => {
      this.apps.forward('login');
    });
  }

  public lockClicked() {
    this.lock.lock();
    this.router.navigate(['lock']);
  }

  public revokeAllTokens() {
    this.auth.revokeAllTokens().then(() => {
      this.apps.forward('login');
    }).catch(() => {
      this.alerts.showNotification('Unable to revoke all authentication tokens!', 'top-center', 'warning');
    })
  }
}
