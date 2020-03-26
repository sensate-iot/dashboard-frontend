import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AlertService} from '../../services/alert.service';

export interface IShowSensorData {
  id: string;
  secret: string;
}

@Component({
  selector: 'app-show-sensor-secrets',
  templateUrl: './show-sensor-secrets.dialog.html',
  styleUrls: ['./show-sensor-secrets.dialog.css']
})
export class ShowSensorSecretsDialog  {
  public constructor(public ref: MatDialogRef<ShowSensorSecretsDialog>,
                     private readonly alerts: AlertService,
                     @Inject(MAT_DIALOG_DATA) public data: IShowSensorData) {
  }

  public onCloseClick() {
    this.ref.close();
  }

  public onCopyClicked(key: string, val: string) {
    let selBox = document.createElement('textarea');

    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.alerts.showNotification(`${key} copied to clipboard!`, 'top-center', 'success');
  }
}
