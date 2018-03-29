/*
 * Login component logic.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Component, OnInit } from '@angular/core';
import {ErrorStateMatcher} from '@angular/material';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

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

  constructor() { }

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
    this.email.setErrors({
      invalid: true
    });
    this.password.setErrors({
      invalid: true
    });
    this.first = false;
  }
}
