import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {Md5} from 'ts-md5';
import {AlertService} from '../../../services/alert.service';
import {Profile} from '../../../models/user.model';

export class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email : string;
  isMobile : boolean;
  phoneNumber : string;
  profileUrl : string;
  registrationDate : Date;

  profileMatcher : FormErrorStateMatcher;
  profileForm : FormGroup;
  firstNameControl : FormControl;
  lastNameControl : FormControl;
  newPasswordControl : FormControl;
  newPasswordConfirmControl : FormControl;
  currentPasswordControl : FormControl;

  constructor(private settings : SettingsService,
              private accounts : AccountService,
              private router : Router,
              private notifications : AlertService) {
    this.isMobile = this.settings.isMobile();
  }

  public onResize() {
    this.isMobile = this.settings.isMobile();
  }

  private createProfileForm() {
    this.newPasswordControl = new FormControl('', [
      Validators.minLength(8),
    ]);
    this.newPasswordConfirmControl = new FormControl('');
    this.currentPasswordControl = new FormControl('');

    this.currentPasswordControl.valueChanges.subscribe(() => {
      if(this.currentPasswordControl.value.toString().length > 0) {
        this.currentPasswordControl.setErrors(null);
      }
    });

    this.newPasswordConfirmControl.valueChanges.subscribe(() => {
      if(this.newPasswordControl.value === this.newPasswordConfirmControl.value) {
        this.newPasswordConfirmControl.setErrors(null);
      } else {
        this.newPasswordConfirmControl.setErrors({
          "not-equal": true
        });
      }

      if(this.currentPasswordControl.value.toString().length <= 0) {
        this.currentPasswordControl.setErrors({
          "missing": true
        });
      }
    });

    this.firstNameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]);
    this.lastNameControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]);

    this.profileForm = new FormGroup({
      firstNameControl: this.firstNameControl,
      lastNameControl: this.lastNameControl,
      newPasswordControl : this.newPasswordControl,
      newPasswordConfirmControl : this.newPasswordConfirmControl,
      currentPasswordControl: this.currentPasswordControl
    });
  }

  ngOnInit() {
    this.createProfileForm();
    this.registrationDate = new Date(0);

    this.accounts.getUser().subscribe(value => {
      this.email = value.email;
      this.phoneNumber = value.phoneNumber;
      this.firstNameControl.patchValue(value.firstName);
      this.lastNameControl.patchValue(value.lastName);
      this.registrationDate = value.registeredAt as Date;
      this.profileUrl = 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.email).toString().toLowerCase() + '.jpg?s=400';
    });
  }

  /*
   * Profile form submission
   */
  public onSubmitClicked() : void {
    let profile = new Profile();

    profile.lastName = this.lastNameControl.value;
    profile.firstName = this.firstNameControl.value;

    if(this.newPasswordControl.value.toString().length > 0) {
      profile.newPassword = this.newPasswordControl.value;
      profile.currentPassword = this.currentPasswordControl.value.toString();
    }

    this.accounts.updateUser(profile).subscribe(() => {
      this.notifications.showNotification('User profile has been updated successfully!',
        'top-center', 'success');
    }, error => {
      const msg = error.error.message;
      this.notifications.showNotification('Unable to update profile: ' + msg, 'top-center', 'danger');
    });
  }

  public isValidProfileForm() : boolean {
    return this.profileForm.valid;
  }
}
