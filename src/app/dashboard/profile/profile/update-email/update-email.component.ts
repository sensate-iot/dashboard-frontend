import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormErrorStateMatcher} from '../profile.component';
import {Router} from '@angular/router';
import {AccountService} from '../../../../services/account.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css']
})
export class UpdateEmailComponent implements OnInit {
  updateEmailForm : FormGroup;
  emailControl : FormControl;
  updateMatcher : FormErrorStateMatcher;

  constructor(private router : Router, private accounts : AccountService) { }

  public ngOnInit() {
    this.createUpdateEmailForm();
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

  public onNextClick() {
    if(!this.emailControl.valid) {
      return;
    }

    this.accounts.updateEmail(this.emailControl.value).subscribe(() => {
      this.router.navigate(['/dashboard/confirm-update-email']);
    },() => {
      this.emailControl.setErrors({
        "unable": true
      });
    });
  }

  public isValidUpdateForm() : boolean {
    return this.emailControl.valid;
  }
}
