import {Component, Inject} from '@angular/core';
import {Sensor} from '../models/sensor.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {SensorService} from '../services/sensor.service';
import {ICreateAction} from './sensor-wizard/sensor-wizard.component';

@Component({
  selector: 'create-action-dialog',
  templateUrl: './create-action.dialog.html',
  styleUrls: ['./create-action.dialog.css']
})
export class CreateActionDialog {
  private showTarget: boolean;
  private showSensorTarget: boolean;
  private valid: boolean;
  private noTarget: boolean;

  private sensors: Sensor[];

  private static SmsChannel  = 1;
  private static MqttChannel = 2;

  constructor(public ref: MatDialogRef<CreateActionDialog>, @Inject(MAT_DIALOG_DATA) public data: ICreateAction,
              private sensorService: SensorService) {
    this.sensorService.find().subscribe((sensors) => {
      this.sensors = sensors;
    });

    this.valid = false;
    this.noTarget = false;
  }

  public onCancelClick() {
    this.ref.close();
  }

  public selectChannel() {
    const selected = +this.data.selected;

    if(selected === CreateActionDialog.SmsChannel || selected === CreateActionDialog.MqttChannel) {
      this.noTarget = true;
      this.valid = true;
    } else {
      this.noTarget = false;
    }
  }

  public selectTarget() {
    this.valid = true;
  }
}
