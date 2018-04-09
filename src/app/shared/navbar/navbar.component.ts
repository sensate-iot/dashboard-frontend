import { Component, OnInit, Input } from '@angular/core';
import {LoginService} from '../../services/login.service';
import {Router} from '@angular/router';
import {LockService} from '../../services/lock.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;
  profile : string;

  constructor(private auth : LoginService, private lock : LockService, private router : Router) {}

  ngOnInit() {
    this.profile = '/dashboard/profile';
  }

  menuClick() {
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
