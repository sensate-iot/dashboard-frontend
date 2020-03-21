/*
 * Confirm email change component.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, Inject, OnInit} from '@angular/core';
import {AccountService} from '../../../services/account.service';
import {DOCUMENT} from '@angular/common';
import { ErrorStateMatcher } from '@angular/material/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LoginService} from '../../../services/login.service';
import {AlertService} from '../../../services/alert.service';
import {AppsService} from '../../../services/apps.service';

class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }
}

@Component({
  selector: 'app-confirm-update-email',
  templateUrl: './confirm-update-email.component.html',
  styleUrls: ['./confirm-update-email.component.css']
})
export class ConfirmUpdateEmailComponent implements OnInit {
  codeField : FormControl;
  codeForm : FormGroup;
  matcher : FormErrorStateMatcher;

  constructor(private accounts : AccountService,
              @Inject(DOCUMENT) private document : Window,
              private apps: AppsService,
              private router : Router, private auth : LoginService, private notifs: AlertService) { }

  public ngOnInit() {
    this.matcher = new FormErrorStateMatcher();

    this.codeField = new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]);

    this.codeForm = new FormGroup({
      codeField: this.codeField
    });
  }

  public onConfirm() {
    this.accounts.confirmUpdateEmail(this.codeField.value).subscribe(res => {
      this.auth.logout().then(() => {
        this.notifs.showNotification('Your email has been updated. Please log in.', 'top-center', 'success');
        this.apps.forward('login', '/login');
      });
    }, error => {
      this.codeField.setErrors({
        "invalid" : true
      });
    });
  }

  public isValid() {
    return this.codeForm.valid;
  }

  onResize() {

  }
}

