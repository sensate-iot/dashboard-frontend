/*
 * Material design login component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  loginForm : FormGroup;
  email : FormControl;
  password : FormControl;
  used : string;

  constructor() {
    this.used = '';
  }


  ngOnInit() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl(
      '',
      Validators.required
    );

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });

    this.email.valueChanges.subscribe(data => {
      if(data.length > 0) {
        this.used = 'used';
      } else {
        this.used = '';
      }
    });
  }

}
