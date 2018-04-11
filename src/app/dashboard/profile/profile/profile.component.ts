import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../services/settings.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {Router} from '@angular/router';
import {AccountService} from '../../../services/account.service';

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
  firstName : string;
  lastName : string;
  email : string;
  isMobile : boolean;
  phoneNumber : string;

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

  ngOnInit() {
    this.firstName = "Michel";
    this.lastName = "Megens";
    this.email = 'michelsown+sensate1212@gmail.com';
    this.phoneNumber = '06123412';

    this.createUpdateEmailForm();
  }

  onNextClick() {
    if(!this.emailControl.valid) {
      return;
    }

    this.router.navigate(['/dashboard/confirm-update-email']);
  }

  isValidUpdateForm() : boolean {
    return this.emailControl.valid;
  }
}
