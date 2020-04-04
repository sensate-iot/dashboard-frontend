import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {FormErrorStateMatcher} from '../../pages/profile/profile/profile.component';
import {AccountService} from '../../services/account.service';
import {AppsService} from '../../services/apps.service';
import {AlertService} from '../../services/alert.service';
import {LoginService} from '../../services/login.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  public deleteUser : FormGroup;
  public emailControl : FormControl;
  public deleteMatcher : FormErrorStateMatcher;

  @Input() public email: string;

  public constructor(private readonly accounts: AccountService,
                     private readonly apps: AppsService,
                     private readonly auth: LoginService,
                     private readonly notifs: AlertService) { }

  public ngOnInit(): void {
    this.createDeleteEmailForm();
  }

  private createDeleteEmailForm() {
    this.deleteMatcher = new FormErrorStateMatcher();
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    this.deleteUser = new FormGroup({
      emailControl: this.emailControl
    });
  }

  public onNextClick() {
    if(!this.isValidDeleteForm()) {
      return;
    }

    this.accounts.deleteUser().subscribe(() => {
      this.notifs.showNotification('Your account  has been deleted!', 'top-center', 'success');
      this.auth.logout().then(() => {
        this.apps.forward('login');
      });
    },(error) => {
      const e = error.error;
      if(e !== null && e !== undefined) {
        this.notifs.showNotification(`Unable to delete account!`, 'top-center', 'warning');
      }
    });
  }

  public isValidDeleteForm() : boolean {
    return this.emailControl.valid && this.emailControl.value.toString() === this.email;
  }
}
