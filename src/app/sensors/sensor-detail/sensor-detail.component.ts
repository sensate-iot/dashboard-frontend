import {Component, Input, OnInit} from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {Trigger, TriggerAction} from '../../models/trigger.model';
import {TriggerService} from '../../services/trigger.service';
import {ActivatedRoute, Data} from '@angular/router';
import {SensorService} from '../../services/sensor.service';
import {flatMap} from 'rxjs/operators';
import {Sensor} from '../../models/sensor.model';
import {AlertService} from '../../services/alert.service';
import {CreateActionDialog, ICreateAction} from '../create-action.dialog';
import {ShowActionsDialog} from './show-actions.dialog';
import {DataService} from '../../services/data.service';
import {Measurement} from '../../models/measurement.model';
import * as moment from 'moment';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {ChartistLegendDataArray} from '../../services/graph.service';

export class TriggerEdgeMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const controlTouched = !!(control && (control.dirty || control.touched));
    const controlInvalid = !!(control && control.invalid);
    const parentInvalid = !!(control && control.parent && control.parent.invalid && (control.parent.dirty || control.parent.touched));

    return ((controlTouched || form.touched) && (controlInvalid || parentInvalid)) || (controlInvalid && form.submitted);
  }
}

@Component({
  selector: 'app-sensor-detail',
  templateUrl: './sensor-detail.component.html',
  styleUrls: ['./sensor-detail.component.css']
})
export class SensorDetailComponent implements OnInit {
  public measurementDataToday: any;

  public triggerFrom: FormGroup;
  public matcher: TriggerEdgeMatcher;

  public sensors: Sensor[];
  public triggers: Trigger[];
  public sensor: Sensor;

  public resetView: boolean;

  public constructor(
    private fb: FormBuilder, private triggerService: TriggerService,
    private sensorService: SensorService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private dataService: DataService,
    private route: ActivatedRoute) {

    this.sensor = new Sensor();
    this.sensor.name = "";
    this.resetView = true;
  }

  public ngOnInit() {
    this.createTriggerForm();

    this.route.params.pipe(flatMap(params => {
      const sensorId = params['id'] || '';
      return this.sensorService.get(sensorId);
    }), flatMap(sensor => {
      this.sensor = sensor;
      return this.triggerService.getAllFor(sensor.internalId);
    })).subscribe(triggers => {
      this.triggers = triggers;
      const now = new Date();
      const yesterday = new Date();

      yesterday.setDate(now.getDate() - 1);

      this.dataService.get(this.sensor.internalId, yesterday, now, 100).subscribe((data) => {
        this.measurementDataToday = this.createGraphData(data);
      });
    }, (error) => {
      this.alertService.showWarninngNotification("Unable to load sensor data!");
    });

    this.sensorService.find().subscribe((sensors) => {
      this.sensors = sensors;
    }, (error) => {
      console.debug("Unable to fetch sensor data: " + JSON.stringify(error));
    });
  }

  private createGraphData(measurements: Measurement[]) {
    const labels = [];
    const data = new Map<string, Array<number>>();

    measurements.forEach(measurement => {
      labels.push(moment(measurement.timestamp).utc().format('HH:mm'));
      let idx = 0;

      for (const key in measurement.data) {
        if(!data.has(key)) {
          data.set(key, new Array<number>());
        }

        data.get(key).push(measurement.data[key].value);
      }
    });

    const finalData = new Array<ChartistLegendDataArray>();

    data.forEach((value: Array<number>, key: string, m) => {
      let data = new ChartistLegendDataArray();

      data.name = key;
      data.data = value;
      finalData.push(data);
    });


    return {
      labels: labels,
      series: finalData
    };
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

  private createTriggerForm() {
    this.matcher = new TriggerEdgeMatcher();
    this.triggerFrom = this.fb.group({
      keyValue: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),

      upperEdge: new FormControl(''),
      lowerEdge: new FormControl('')
    }, { validator: this.atLeastOneRequired });
  }

  public showActions(idx: number) {
    const data = {
      trigger: this.triggers[idx],
      sensors: this.sensors
    };

    const dialog = this.dialog.open(ShowActionsDialog, {
      width: '700px',
      height: '425px',
      scrollStrategy: new NoopScrollStrategy(),
      data: data
    });
  }

  public createAction(i: number) {
    const data = {
      target: "",
      selected: "",
      message: ""
    };

    const dialog = this.dialog.open(CreateActionDialog, {
      width: '450px',
      height: '400px',
      scrollStrategy: new NoopScrollStrategy(),
      data: data
    });

    const sub = dialog.afterClosed().subscribe((result: ICreateAction) => {
      if(i >= this.triggers.length) {
        this.alertService.showWarninngNotification("Unable to create action!");
        return;
      }

      const trigger = this.triggers[i];
      const action = new TriggerAction();

      if(result.target.length >= 0) {
        action.target = result.target;
      }

      action.channel = +result.selected;
      action.message = result.message;

      this.triggerService.addAction(trigger, action).subscribe((t) => {
        console.debug(`Created action: ${JSON.stringify(t)}`);
        if(trigger.actions === null) {
          trigger.actions = [];
        }

        trigger.actions.push(action);
        this.alertService.showSuccessNotification("Action created!");
      }, (error) => {
        console.debug(`Unable to create action: ${JSON.stringify(error)}`);
        this.alertService.showWarninngNotification('Unable to create action!');
      });
    });
  }

  public createTrigger() {
    let upperRaw = this.triggerFrom.get('upperEdge').value.toString();
    let lowerRaw = this.triggerFrom.get('lowerEdge').value.toString();
    const keyValue = this.triggerFrom.get('keyValue').value.toString();

    const trigger = new Trigger();

    trigger.keyValue = keyValue;
    trigger.sensorId = this.sensor.internalId;

    if(upperRaw.length !== 0) {
      upperRaw = upperRaw.replace(',', '.');
      trigger.upperEdge = +upperRaw;
    }

    if(lowerRaw.length !== 0) {
      lowerRaw = lowerRaw.replace(',', '.');
      trigger.lowerEdge = +lowerRaw;
    }

    this.triggerService.createTrigger(trigger).subscribe((t) => {
      this.alertService.showSuccessNotification("Trigger created!");
      this.triggers.push(t);

      this.triggerFrom.reset();
    }, (error) => {
      console.debug(`Unable to store trigger: ${error.toString()}`);
      this.alertService.showWarninngNotification("Unable to store trigger!");
    });
  }

  public removeTrigger(i: number) {
    const trigger = this.triggers[i];

    this.triggerService.deleteTrigger(trigger).subscribe(() => {
      this.alertService.showSuccessNotification("Trigger removed!");

      const newArray = new Array<Trigger>();
      this.triggers.forEach(x => {
        if(x.id === trigger.id) {
          return;
        }

        newArray.push(x);
      });

      this.triggers = newArray;
    }, (error) => {
      console.warn(`Unable to remove trigger: ${error.toString()}`);
    });
  }
}
