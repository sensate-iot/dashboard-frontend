import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  isLoggedIn : boolean = false;

  ngOnInit() {
    this.isLoggedIn = localStorage.getItem('logged_in') == 'true';
  }
}
