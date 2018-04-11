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

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.css']
})

export class RootComponent implements OnInit, OnDestroy {
  public id : number;
  public backgroundColor : string;

  constructor(private lock : LockService, private auth : LoginService,
              private settings : SettingsService, private router : Router) {
    this.id = settings.getSidebarImageIndex();
    this.backgroundColor = this.settings.getSidebarColor();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  public logoutClicked() {
    this.auth.logout();
    this.router.navigate(['login']);
  }

  public lockClicked() {
    this.lock.lock();
    this.router.navigate(['lock']);
  }
}
