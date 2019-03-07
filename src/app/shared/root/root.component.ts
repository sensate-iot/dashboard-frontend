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

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent implements OnInit, OnDestroy {
  public id : number;
  public backgroundColor : string;

  constructor(private lock : LockService, private auth : LoginService, private accounts : AccountService,
              private settings : SettingsService, private alerts : AlertService, private router : Router) {
    this.id = settings.getSidebarImageIndex();
    this.backgroundColor = this.settings.getSidebarColor();
    this.accounts.checkPhoneConfirmed();
    this.accounts.checkAndStoreRoles();
  }

  ngOnInit() {
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
    this.auth.logout();
    this.router.navigate(['login']);
  }

  public lockClicked() {
    this.lock.lock();
    this.router.navigate(['lock']);
  }

  public revokeAllTokens() {
    this.auth.revokeAllTokens().then(() => {
      this.router.navigate(['login']);
    }).catch(() => {
      this.alerts.showNotification('Unable to revoke all authentication tokens!', 'top-center', 'warning');
    })
  }
}
