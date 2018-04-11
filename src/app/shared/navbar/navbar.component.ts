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
  menuOpen : boolean;

  constructor(private auth : LoginService, private lock : LockService, private router : Router) {}

  ngOnInit() {
    this.profile = '/dashboard/profile';
    this.menuOpen = false;
  }

  menuClick() {
    /*if(!this.menuOpen) {
      this.menuOpen = true;
      document.getElementById('main-panel').style.marginRight = '260px';
    } else {
      this.menuOpen = false;
      document.getElementById('main-panel').style.marginRight = '0px';
    }*/
  }
}
