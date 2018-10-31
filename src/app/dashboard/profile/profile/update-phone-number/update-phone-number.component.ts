import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../../../services/alert.service';
import {AccountService} from '../../../../services/account.service';
import {Router} from '@angular/router';
import {Status} from '../../../../models/status.model';

@Component({
  selector: 'app-update-phone-number',
  templateUrl: './update-phone-number.component.html',
  styleUrls: ['./update-phone-number.component.css']
})
export class UpdatePhoneNumberComponent implements OnInit {
  countryCodeControl : FormControl;
  phoneNumberControl : FormControl;
  updatePhoneNumberForm : FormGroup;

  constructor(private notifications : AlertService, private accounts : AccountService, private router: Router) { }

  public ngOnInit() : void {
    this.createUpdatePhoneNumberForm();
  }

  public createUpdatePhoneNumberForm() {
    this.phoneNumberControl = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12)
    ]);

    this.countryCodeControl = new FormControl('', [
      Validators.required
    ]);

    this.updatePhoneNumberForm = new FormGroup({
      phoneNumberControl: this.phoneNumberControl
    });
  }

  public isValidUpdateForm() : boolean {
    return this.countryCodeControl.valid && this.phoneNumberControl.valid;
  }

  public onNextClick() : void {
    const phone = '+' + this.countryCodeControl.value.toString() + this.phoneNumberControl.value.toString();
    this.accounts.updatePhoneNumber(phone).subscribe(() => {
      this.notifications.showNotification('A verification code has been sent to your phone!', 'top-center', 'success');
      this.router.navigate(['/dashboard/confirm-phone-number']);
    }, (error) => {
      const status : Status = error.error;
      this.notifications.showNotification('Unable to update phone number: ' + status.message, 'top-center', 'warning');
    })
  }
}
