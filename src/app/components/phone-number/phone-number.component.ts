import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AlertService} from "../../services/alert.service";
import {AccountService} from "../../services/account.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-phone-number',
  templateUrl: './phone-number.component.html',
  styleUrls: ['./phone-number.component.css']
})
export class PhoneNumberComponent implements OnInit {
  public countryCodeControl : FormControl;
  public phoneNumberControl : FormControl;
  public updatePhoneNumberForm : FormGroup;

  @Output() countryCodeChanged = new EventEmitter<string>();
  @Output() phoneNumberChanged = new EventEmitter<string>();

  public constructor(private notifications : AlertService, private accounts : AccountService, private router: Router) { }

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

    this.countryCodeControl.valueChanges.subscribe((value) => {
      this.countryCodeChanged.emit(`+${value}`);
    });

    this.phoneNumberControl.valueChanges.subscribe((value) => {
      this.phoneNumberChanged.emit(value);
    });
  }
}
