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
  loggedIn : boolean;
  mobile : boolean;

  constructor(private auth : LoginService, private router : Router, private settings : SettingsService) { }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
    this.mobile = this.settings.isMobile();
  }

  logoutClicked() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
