import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';
import {Md5} from 'ts-md5';

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
  profileMatcher : FormErrorStateMatcher;
  profileForm : FormGroup;
  firstNameControl : FormControl;
  lastNameControl : FormControl;
  newPasswordControl : FormControl;
  newPasswordConfirmControl : FormControl;
  profileUrl : string;

  updateEmailForm : FormGroup;
  emailControl : FormControl;
  updateMatcher : FormErrorStateMatcher;

  constructor(private settings : SettingsService,
              private accounts : AccountService,
              private router : Router) {
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

    this.newPasswordConfirmControl.valueChanges.subscribe(value => {
      if(this.newPasswordControl.value === this.newPasswordConfirmControl.value) {
        this.newPasswordConfirmControl.setErrors(null);
      } else {
        this.newPasswordConfirmControl.setErrors({
          "not-equal": true
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
      newPasswordConfirmControl : this.newPasswordConfirmControl
    });
  }

  ngOnInit() {
    this.createProfileForm();
    this.createUpdateEmailForm();

    this.accounts.getUser().subscribe(value => {
      this.email = value.email;
      this.phoneNumber = value.phoneNumber;
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
}
