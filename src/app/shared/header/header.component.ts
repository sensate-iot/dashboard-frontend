import {Component, OnInit} from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  loggedIn : boolean;

  constructor(private auth : LoginService, private router : Router) { }

  ngOnInit() {
    this.loggedIn = this.auth.isLoggedIn();
  }

  logoutClicked() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
