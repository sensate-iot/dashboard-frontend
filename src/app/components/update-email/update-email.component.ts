import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormErrorStateMatcher} from '../../pages/profile/profile/profile.component';
import {Router} from '@angular/router';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css']
})
export class UpdateEmailComponent implements OnInit {
  updateEmailForm : FormGroup;
  emailControl : FormControl;
  updateMatcher : FormErrorStateMatcher;

  constructor(private router : Router, private accounts : AccountService, private notifs: AlertService) { }

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
      this.notifs.showNotification('A verification code has been sent to your email address!', 'top-center', 'success');
      this.router.navigate(['/confirm-update-email']);
    },(error) => {
      const e = error.error;
      if(e !== null && e !== undefined) {
        this.notifs.showNotification(`Unable to update email: ${e.message}`, 'top-center', 'warning');
      }
      this.emailControl.setErrors({
        "unable": true
      });
    });
  }

  public isValidUpdateForm() : boolean {
    return this.emailControl.valid;
  }
}
