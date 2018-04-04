/*
 * Login component logic.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {LoginService} from '../services/login.service';
import {Router} from '@angular/router';

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }

}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  public loginForm : FormGroup;
  public email : FormControl;
  public password : FormControl;
  public first : boolean = true;
  public matcher : LoginErrorStateMatcher = new LoginErrorStateMatcher();

  constructor(private auth : LoginService) { }

  ngOnInit() {
    this.email = new FormControl('', [
      Validators.required,
      Validators.email
    ]);
    this.password = new FormControl('', [
      Validators.required
    ]);

    this.loginForm = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  public loginInvalid() : boolean {
    if(this.first)
        return this.email.valid && this.password.valid;

    return true;
  }

  loginClicked() {
    if(!this.email.valid || !this.password.valid)
      return;

    const uname = this.email.value.toString();
    const pass = this.password.value.toString();

    console.log('Attempting to login:');
    console.log('Username: ' + uname);
    console.log('Password: ' + pass);

    if(this.auth.test()) {
      //this.router.navigate(['/dashboard']);
      console.log('Logged in!');
      console.log(this.auth.getJwt());
    }
  }
}
