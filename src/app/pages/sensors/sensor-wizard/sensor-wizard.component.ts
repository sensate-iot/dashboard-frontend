import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {AlertService} from '../../../services/alert.service';
import {TriggerService} from '../../../services/trigger.service';
import {Router} from '@angular/router';
import {Sensor} from '../../../models/sensor.model';
import {SensorService} from '../../../services/sensor.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {MatStepper} from '@angular/material/stepper';
declare const $: any;

export class TriggerEdgeMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return (controlTouched && (controlInvalid || parentInvalid)) || (controlInvalid && form.submitted);
  }
}

@Component({
  selector: 'app-sensor-wizard',
  templateUrl: './sensor-wizard.component.html',
  styleUrls: ['./sensor-wizard.component.css']
})
export class SensorWizardComponent implements OnInit {
  @ViewChild(MatStepper) stepper: MatStepper;

  public nameForm : FormGroup;
  public name : FormControl;
  public desc : FormControl;

  public secretForm : FormGroup;
  public secret : FormControl;

  public sensor: Sensor;
  public sensorCreated: boolean;

  public sensorId: string;
  public sensorSecret: string;

  constructor(private fb: FormBuilder, private alerts: AlertService, private triggerService: TriggerService,
              private sensorService: SensorService, private router: Router, private dialog: MatDialog) {
    this.sensor = null;
    this.sensorCreated = false;

    this.sensorId = '';
    this.sensorSecret = '';
  }

  private atLeastOneRequired(form: FormGroup) : {[s:string]: boolean} {
    if(form.get('upperEdge') === null || form.get('lowerEdge') === null) {
      return null;
    }

    const upper = form.get('upperEdge').value.toString();
    const lower = form.get('lowerEdge').value.toString();
    const condition = upper.length === 0 && lower.length === 0;

    return condition ? { 'edgeRequired': true } : null;
  }

  public ngOnInit() {
    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);

    this.desc = new FormControl('', [
      Validators.required,
      Validators.minLength(4)
    ]);

    this.secret = new FormControl('', [
      Validators.required,
      Validators.minLength(8)
    ]);

    this.nameForm = new FormGroup({
      name: this.name,
      desc: this.desc
    });

    this.secretForm = new FormGroup({
      secret: this.secret
    });
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

  public createSensor() {
    this.rawCreateSensor().subscribe((sensor) => {
      this.sensor = sensor;
      this.sensorId = sensor.id;
      this.sensorSecret = sensor.secret;
      this.alerts.showSuccessNotification("Sensor created!");
      this.sensorCreated = true;
      this.stepper.next();
    }, error => {
      console.debug(`Unable to store sensor:}`);
      console.debug(error);
      this.alerts.showWarninngNotification(`Unable to create sensor!`);
    });
  }

  private rawCreateSensor() {
    const sensor = new Sensor();

    sensor.name = this.name.value.toString();
    sensor.description = this.desc.value.toString();
    sensor.storageEnabled = true;

    if (this.secret.value.toString().length > 0) {
      sensor.secret = this.secret.value.toString();
    }

    return this.sensorService.create(sensor);
  }


  public onToggleChanged(event: MatSlideToggleChange) {
    if(event.checked) {
      this.secret.disable();
      this.secret.setValue('');
    } else {
      this.secret.enable();
    }
  }

  public onSubmitClick() {
    this.router.navigate([`/sensors/${this.sensor.id}`]);
  }
}
