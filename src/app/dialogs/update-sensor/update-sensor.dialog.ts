import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Form, FormControl, Validators} from '@angular/forms';

export interface IUpdateSensorData {
  name: string;
  description: string;
  secret: string;
  storageEnabled: boolean;
  updateSecret: boolean;
}

@Component({
  selector: 'app-update-sensor',
  templateUrl: './update-sensor.dialog.html',
  styleUrls: ['./update-sensor.dialog.css']
})
export class UpdateSensorDialog implements OnInit{
  public nameControl: FormControl;
  public descControl: FormControl;
  public secretControl: FormControl;
  public storageEnabled: FormControl;

  public platformSecret: boolean;

  public get error() {
    return this.nameControl.hasError('required') ||
      this.descControl.hasError('required') ||
      this.secretControl.hasError('required');
  }

  public constructor(
    public ref: MatDialogRef<UpdateSensorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: IUpdateSensorData,
  ) {
    this.platformSecret = false;
  }

  public ngOnInit(): void {
    this.nameControl = new FormControl(this.data.name, [ Validators.required ]);
    this.descControl = new FormControl(this.data.description, [ Validators.required ]);
    this.secretControl = new FormControl(this.data.secret, [ Validators.required ]);
  }

  public onGenerateClick() {
    if(this.platformSecret) {
      this.secretControl.disable();
    } else {
      this.secretControl.enable();
    }
  }

  public onCancelClick() {
    this.ref.close();
  }

  public onSubmitClick() {
    this.data.updateSecret = this.secretControl.value.toString() !== this.data.secret || this.platformSecret;
    this.data.name = this.nameControl.value.toString();
    this.data.description = this.descControl.value.toString();
    this.data.secret = this.platformSecret ? null : this.secretControl.value.toString();
    this.ref.close(this.data);
  }
}
