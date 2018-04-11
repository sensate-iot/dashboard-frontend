import { Component, OnInit } from '@angular/core';
import {LockService} from '../services/lock.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material';
import {Router} from '@angular/router';

export class UnlockErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const submitted = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || submitted));
  }

}

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.css']
})

export class LockComponent implements OnInit {
  public mail : string;
  public unlockForm : FormGroup;
  public password : FormControl;
  public matcher : UnlockErrorStateMatcher = new UnlockErrorStateMatcher();

  constructor(private lock : LockService, private router : Router) {
    this.mail = this.lock.getEmail();
  }

  ngOnInit() {
    this.password = new FormControl('', [
      Validators.required
    ]);

    this.unlockForm = new FormGroup({
      password: this.password
    });
  }

  unlockClicked() : void {
    if(!this.password.valid)
      return;

    const pw = this.password.value.toString();
    if(this.lock.unlock(pw)) {
      this.router.navigateByUrl('/dashboard');
      return;
    }

    this.password.setErrors({
      'invalid': true
    });
  }
}
