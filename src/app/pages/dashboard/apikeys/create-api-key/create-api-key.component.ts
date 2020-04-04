import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../../services/account.service';
import {DOCUMENT} from '@angular/common';
import {Router} from '@angular/router';
import {LoginService} from '../../../../services/login.service';
import { ErrorStateMatcher } from '@angular/material/core';

export class FormErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }
}

@Component({
  selector: 'app-create-api-key',
  templateUrl: './create-api-key.component.html',
  styleUrls: ['./create-api-key.component.css']
})
export class CreateApiKeyComponent implements OnInit {
  codeField : FormControl;
  codeForm : FormGroup;
  matcher : FormErrorStateMatcher;

  public constructor(private accounts : AccountService,
              @Inject(DOCUMENT) private document : Window,
              private router : Router, private auth : LoginService) { }

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
      this.auth.resetLogin();
      this.router.navigate(['/login']);
    }, error => {
      this.codeField.setErrors({
        "invalid" : true
      });
    });
  }

  public isValid() {
    return this.codeForm.valid;
  }

  public onResize() { }
}
