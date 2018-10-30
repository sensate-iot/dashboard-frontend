import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-update-phone-number',
  templateUrl: './update-phone-number.component.html',
  styleUrls: ['./update-phone-number.component.css']
})
export class UpdatePhoneNumberComponent implements OnInit {
  countryCode : FormControl;
  phoneNumberControl : FormControl;
  updatePhoneNumberForm : FormGroup;


  constructor() { }

  public ngOnInit() : void {
    this.createUpdatePhoneNumberForm();
  }

  public createUpdatePhoneNumberForm() {
    this.phoneNumberControl = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(12)
    ]);

    this.countryCode = new FormControl('', [
      Validators.required
    ]);

    this.updatePhoneNumberForm = new FormGroup({
      phoneNumberControl: this.phoneNumberControl
    });
  }

  public isValidUpdateForm() : boolean {
    return this.countryCode.valid && this.phoneNumberControl.valid;
  }

  public onNextClick() : void {

  }
}
