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
import {AlertService} from '../services/alert.service';
import {AccountService} from '../services/account.service';
import {StatusCode} from '../models/status.model';

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

  constructor(private auth : LoginService, private accounts : AccountService, private router : Router, private alerts : AlertService) { }

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

  public loginValid() : boolean {
    if(this.first)
        return this.email.valid && this.password.valid;

    return true;
  }

  loginClicked() {
    const uname = this.email.value.toString();
    const pass = this.password.value.toString();

    console.log('Attempting to login:');
    console.log('Username: ' + uname);
    console.log('Password: ' + pass);
    this.first = false;

    if(!this.auth.isLoggedIn()) {
      this.auth.login(uname, pass).subscribe(data => {
        data.body.email = this.email.value;
        LoginService.setSession(data.body);

        this.accounts.rawCheckPhoneConfirmed().subscribe((result) => {
          /* Forward the user to the phone confirmation screen if a phone number has not yet been confirmed.. */
          if(result.body.message == 'true') {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/confirm-phone-number']);
          }
        }, () => {
          this.router.navigate(['/']);
        });
      }, error => {
        const result = error.error;

        if(result == null) {
          this.email.setErrors({
            "invalid": true
          });
          this.password.setErrors({
            "invalid": true
          });

          return;
        }

        if(result.errorCode == StatusCode.Banned) {
          console.log('Showing notification!');
          this.alerts.showNotification('This account has been suspended!', 'top-center', 'warning');

          this.email.setErrors({
            "banned": true
          });

        } else {
          this.email.setErrors({
            "invalid": true
          });
          this.password.setErrors({
            "invalid": true
          });
        }

        LoginService.handleError(error);

      }
      );
    }

    return;
  }

  public onForgotPasswordClicked() {
    if(!this.email.valid || this.email.value.toString().length <= 0) {
      this.alerts.showNotification('Enter a valid email address!', 'top-center', 'warning');
      return;
    }

    this.accounts.resetPassword(this.email.value.toString()).subscribe(value => {
      this.alerts.showNotification('A security token has been sent to your mail address!', 'top-center', 'success');
      this.router.navigate(['/reset-password'], { queryParams: {email: this.email.value.toString() }});
    }, error => {
      switch(error.status) {
        default:
        case 500:
          this.alerts.showNotification('Unable to sent verification code!', 'top-center', 'danger');
          break;

        case 404:
          this.alerts.showNotification('Unkown email address!', 'top-center', 'warning');
          this.email.setErrors({
            'email': true
          });
          break;
      }
    });
  }
}
