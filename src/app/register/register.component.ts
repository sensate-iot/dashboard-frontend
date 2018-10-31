/*
 * Register form component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {FormMatcher} from '../matchers/form.matcher';
import {PhonenumberMatcher} from '../matchers/phonenumber.matcher';
import {AccountService} from '../services/account.service';
import {UserRegistration} from '../models/user-registration.model';
import {AlertService} from '../services/alert.service';
import {Status} from '../models/status.model';

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
  phoneNumber : FormControl;
  password : FormControl;
  passwordConfirm : FormControl;
  countryCode : FormControl;
  terms : boolean;

  private first : boolean;
  private confirmPasswordSubscription : Subscription;

  public matcher : FormMatcher;
  public phoneMatcher : PhonenumberMatcher;

  constructor(private accounts : AccountService, private alerts : AlertService) {
    this.matcher = new FormMatcher();
    this.phoneMatcher = new PhonenumberMatcher();
    this.first = true;
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
    this.phoneNumber = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12)
    ]);

    this.countryCode = new FormControl('', [
      Validators.required
    ]);



    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber
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
        this.phoneNumber.valid && this.password.valid && this.passwordConfirm.valid && this.terms &&
        this.isValidPhoneNumber();
  }

  public isValidPhoneNumber() : boolean {
    const regex = /^[0-9]\d{5,15}$/;
    return regex.test(this.phoneNumber.value.toString());
  }

  public onSubmitClicked() : void {
    this.first = false;
    const user = new UserRegistration();

    const phone = '+' + this.countryCode.value.toString() + this.phoneNumber.value.toString();
    user.email = this.email.value.toString();
    user.firstName = this.firstName.value.toString();
    user.lastName = this.lastName.value.toString();
    user.password = this.password.value.toString();
    user.phoneNumber = phone;

    console.log('Submit has been clicked!');
    console.log(user);
    this.accounts.register(user).subscribe(data => {
      this.alerts.showNotification("A verification token has been sent to your email", 'top-center', 'success');
      /* TODO: navigate to login screen */
    }, error => {
      console.log('Failed to register..');
      console.log(error);
      console.log(error.error);
      const msg : Status = error.error;
      const display = 'Unable to sign up: ' + msg.message + '!';

      this.alerts.showNotification(display, 'top-center', 'danger');
    });
  }
}
