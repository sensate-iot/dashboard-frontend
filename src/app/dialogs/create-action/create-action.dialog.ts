import {Component, Inject} from '@angular/core';
import {Sensor} from '../../models/sensor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {SensorService} from '../../services/sensor.service';

export interface ICreateAction {
  target : string;
  selected: string;
  message: string;
}

@Component({
  selector: 'create-action-dialog',
  templateUrl: './create-action.dialog.html',
  styleUrls: ['./create-action.dialog.css']
})
export class CreateActionDialog {
  public valid: boolean;
  public noTarget: boolean;

  public hasMessage: boolean;

  public selectedNumber : number;
  public sensors: Sensor[];

  public countryCode: string;
  public phoneNumber: string;

  private static SmsChannel  = 1;
  private static MqttChannel = 3;

  public actuatorChannel = 6;
  public liveDataChannel = 2;

  public constructor(public ref: MatDialogRef<CreateActionDialog>,
                     @Inject(MAT_DIALOG_DATA) public data: ICreateAction,
                     private sensorService: SensorService) {

    this.sensorService.all(false).subscribe((sensors) => {
      this.sensors = sensors.values;
    });

    this.valid = false;
    this.noTarget = false;
    this.countryCode = '';
    this.phoneNumber = '';
  }

  public onCancelClick() {
    this.ref.close();
  }

  public selectChannel() {
    const selected = +this.data.selected;

    this.selectedNumber = selected;

    if(selected === CreateActionDialog.SmsChannel || selected === CreateActionDialog.MqttChannel) {
      this.noTarget = true;
      this.valid = true;
      this.data.target = '';
    } else {
      this.noTarget = false;
    }

    if(!this.noTarget && this.data.target.length === 0) {
      this.valid = false;
    }
  }

  public selectTarget() {
    this.valid = true;
  }

  public isSmsSelected() {
    console.log(+this.data.selected === CreateActionDialog.SmsChannel);
    return +this.data.selected === CreateActionDialog.SmsChannel;
  }

  public onMessageChanged() {
    this.hasMessage = this.data.message.length > 0;
  }

  public onOkClicked() {
    if(this.isSmsSelected()) {
      this.data.target = `${this.countryCode}${this.phoneNumber}`;
    }

    this.ref.close(this.data);
  }
}
