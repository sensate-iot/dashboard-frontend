import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {SettingsService} from '../../services/settings.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  mobile : boolean;

  constructor(private auth : LoginService, private router : Router, private settings : SettingsService) { }

  ngOnInit() {
    this.mobile = this.settings.isMobile();
  }

  public isLoggedIn() : boolean {
    return this.auth.isLoggedIn();
  }

  logoutClicked() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
