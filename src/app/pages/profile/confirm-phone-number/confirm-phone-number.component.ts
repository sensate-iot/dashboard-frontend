import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AccountService} from '../../../services/account.service';
import {Router} from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import {AlertService} from '../../../services/alert.service';

class FormErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }
}

@Component({
  selector: 'app-confirm-phone-number',
  templateUrl: './confirm-phone-number.component.html',
  styleUrls: ['./confirm-phone-number.component.css']
})

export class ConfirmPhoneNumberComponent implements OnInit {
  codeField : FormControl;
  codeForm : FormGroup;
  matcher : FormErrorStateMatcher;

  constructor(private accounts : AccountService, private router : Router, private notifications : AlertService) { }

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
    this.accounts.confirmPhoneNumber(this.codeField.value.toString()).then(() => {
      this.notifications.showNotification('Phone number updated!', 'top-center', 'success');
      this.router.navigate(['/overview']);
    }, error => {
      console.debug(error.error.errorCode);
      if(error.error.errorCode === 401) {
        this.codeField.setErrors({
          "expired" : true
        });
      } else {
        this.codeField.setErrors({
          "invalid" : true
        });
      }

    });
  }

  public isValid() {
    return this.codeForm.valid;
  }

  public onResize() {
  }
}
