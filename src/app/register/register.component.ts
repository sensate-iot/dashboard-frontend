import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';

export class RegisterErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  registerForm : FormGroup;
  email : FormControl;
  firstName : FormControl;
  lastName : FormControl;
  phoneNumber : FormControl;
  password : FormControl;
  terms : boolean;

  public matcher : RegisterErrorStateMatcher;

  constructor() {
    this.matcher = new RegisterErrorStateMatcher();
  }

  ngOnInit() {
    this.email = new FormControl('', [
      Validators.email,
      Validators.required
    ]);

    this.firstName = new FormControl('', Validators.required);
    this.lastName = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
    this.phoneNumber = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    this.registerForm = new FormGroup({
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber
    });
  }

  public isValidForm() : boolean {
    return this.email.valid && this.phoneNumber.valid &&
      this.firstName.valid && this.lastName.valid && this.password.valid &&
      this.terms;
  }
}
