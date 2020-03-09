import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AccountService} from '../../../services/account.service';
import {AlertService} from '../../../services/alert.service';
import {FormControl, Validators} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {SensorLink} from '../../../models/sensorlink.model';

@Component({
  selector: 'app-add-sensor-link-dialog',
  templateUrl: './add-sensor-link-dialog.component.html',
  styleUrls: ['./add-sensor-link-dialog.component.css']
})
export class AddSensorLinkDialog implements OnInit {
  public emails: string[];
  public emailControl: FormControl;
  public filteredEmails: Observable<string[]>;

  public constructor(
    @Inject(MAT_DIALOG_DATA) public data: SensorLink,
    private ref: MatDialogRef<AddSensorLinkDialog>,
    private accounts: AccountService,
    private notifs: AlertService
  ) {
    this.emails = [];
  }

  public ngOnInit(): void {
    this.emailControl = new FormControl('', [
      Validators.required,
      Validators.email
    ]);

    this.accounts.getAllUsers().subscribe(mails => {
      this.emails = mails;
    }, error => {
      console.debug("Unable to fetch user data: ");
      console.debug(error);
      this.notifs.showWarninngNotification("Unable to fetch user data!");
    });

    this.filteredEmails = this.emailControl.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const filter = value.toLowerCase();

        return this.emails.filter(email => email.toLowerCase().includes(filter));
      })
    );
  }

  public onCancelClick() {
    this.ref.close();
  }

  public onOkClick() {
    const user = this.emailControl.value as string;

    if(user === null || user.length <= 0) {
      return;
    }

    this.data.userId = user;

    this.ref.close(this.data);
  }
}
