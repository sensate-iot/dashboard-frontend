/*
 * Register form component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {FormMatcher} from '../matchers/form.matcher';
import {PhonenumberMatcher} from '../matchers/phonenumber.matcher';
import {AccountService} from '../services/account.service';
import {UserRegistration} from '../models/user-registration.model';
import {AlertService} from '../services/alert.service';
import {Status} from '../models/status.model';
import {Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit, OnDestroy {
  registerForm : FormGroup;
  email : FormControl;
  firstName : FormControl;
  lastName : FormControl;
  phoneNumberControl : FormControl;
  password : FormControl;
  passwordConfirm : FormControl;
  countryCodeControl : FormControl;
  terms : boolean;

  private first : boolean;
  private origin : string;
  private confirmPasswordSubscription : Subscription;

  public matcher : FormMatcher;
  public phoneMatcher : PhonenumberMatcher;

  constructor(private accounts : AccountService, private alerts : AlertService,
              @Inject(DOCUMENT) private document : Window, private router : Router) {
    this.matcher = new FormMatcher();
    this.phoneMatcher = new PhonenumberMatcher();
    this.first = true;
    this.origin = encodeURI(this.document.location.origin);
  }

  public ngOnDestroy() {
    this.confirmPasswordSubscription.unsubscribe();
  }

  public ngOnInit() {
    this.email = new FormControl('', [
      Validators.email,
      Validators.required
    ]);

    this.passwordConfirm = new FormControl('', Validators.required);

    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.phoneNumberControl = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(15)
    ]);

    this.countryCodeControl = new FormControl('', [
      Validators.required
    ]);



    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumberControl
    });

    this.watchConfirmPassword();
  }

  private watchConfirmPassword() {
    this.confirmPasswordSubscription = this.passwordConfirm.valueChanges.subscribe(() => {
      if(this.password.value.toString().length <= 0 ||
        this.password.value.toString() !== this.passwordConfirm.value.toString()) {
        this.passwordConfirm.setErrors({
          'not-equal': true
        });
      } else {
        this.passwordConfirm.setErrors(null);
      }
    });
  }

  public isValidForm() : boolean {
      return this.email.valid && this.firstName.valid && this.lastName.valid &&
        this.phoneNumberControl.valid && this.password.valid && this.passwordConfirm.valid && this.terms &&
        this.isValidPhoneNumber();
  }

  public isValidPhoneNumber() : boolean {
    //return this.phoneNumberControl.valid;
    return true;
  }

  public onSubmitClicked() : void {
    this.first = false;
    const user = new UserRegistration();
    const loginUrl = this.origin + '/login';

    const phone = '+' + this.countryCodeControl.value.toString() + this.phoneNumberControl.value.toString();
    user.email = this.email.value.toString();
    user.firstName = this.firstName.value.toString();
    user.lastName = this.lastName.value.toString();
    user.password = this.password.value.toString();
    user.phoneNumber = phone;

    console.log('Submit has been clicked!');

    this.accounts.register(user, loginUrl).subscribe(() => {
      this.alerts.showNotification("A verification token has been sent to your email!", 'top-center', 'success');
      this.router.navigate(['/login']);
    }, error => {
      console.log('Failed to register..');
      console.log(error);
      console.log(error.error);
      const msg : Status = error.error;
      const display = 'Unable to sign up: ' + msg.message;

      this.alerts.showNotification(display, 'top-center', 'danger');
    });
  }
}
