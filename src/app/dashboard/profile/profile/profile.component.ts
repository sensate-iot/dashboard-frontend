import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
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
  profileUrl : string;

  profileMatcher : FormErrorStateMatcher;
  profileForm : FormGroup;
  firstNameControl : FormControl;
  lastNameControl : FormControl;
  newPasswordControl : FormControl;
  newPasswordConfirmControl : FormControl;
  currentPasswordControl : FormControl;
  phoneNumberControl : FormControl;

  updateEmailForm : FormGroup;
  emailControl : FormControl;
  updateMatcher : FormErrorStateMatcher;

  constructor(private settings : SettingsService,
              private accounts : AccountService,
              private router : Router,
              private notifications : AlertService) {
    this.isMobile = this.settings.isMobile();
  }

  public onResize() {
    this.isMobile = this.settings.isMobile();
  }

  private createUpdateEmailForm() {
    this.updateMatcher = new FormErrorStateMatcher();
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    this.updateEmailForm = new FormGroup({
      emailControl: this.emailControl
    });
  }

  private createProfileForm() {
    this.newPasswordControl = new FormControl('', [
      Validators.minLength(8),
    ]);
    this.newPasswordConfirmControl = new FormControl('');
    this.currentPasswordControl = new FormControl('');

    this.phoneNumberControl = new FormControl('', Validators.required);

    this.currentPasswordControl.valueChanges.subscribe(value => {
      if(this.currentPasswordControl.value.toString().length > 0) {
        this.currentPasswordControl.setErrors(null);
      }
    });

    this.newPasswordConfirmControl.valueChanges.subscribe(value => {
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
      currentPasswordControl: this.currentPasswordControl,
      phoneNumberControl : this.phoneNumberControl
    });
  }

  ngOnInit() {
    this.createProfileForm();
    this.createUpdateEmailForm();

    this.accounts.getUser().subscribe(value => {
      this.email = value.email;
      this.phoneNumberControl.patchValue(value.phoneNumber);
      this.firstNameControl.patchValue(value.firstName);
      this.lastNameControl.patchValue(value.lastName);
      this.profileUrl = 'https://www.gravatar.com/avatar/' + Md5.hashStr(this.email).toString().toLowerCase() + '.jpg?s=400';
    });

  }

  onNextClick() {
    if(!this.emailControl.valid) {
      return;
    }

    this.accounts.updateEmail(this.emailControl.value).subscribe(data => {
      this.router.navigate(['/dashboard/confirm-update-email']);
    },error => {
      this.emailControl.setErrors({
        "unable": true
      });
    });
  }

  isValidUpdateForm() : boolean {
    return this.emailControl.valid;
  }

  /*
   * Profile form submission
   */
  public onSubmitClicked() : void {
    let profile = new Profile();

    profile.lastName = this.lastNameControl.value;
    profile.firstName = this.firstNameControl.value;
    profile.phoneNumber = this.phoneNumberControl.value;

    if(this.newPasswordControl.value.toString().length > 0) {
      profile.newPassword = this.newPasswordControl.value;
      profile.currentPassword = this.currentPasswordControl.value.toString();
    }

    this.accounts.updateUser(profile).subscribe(value => {
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
