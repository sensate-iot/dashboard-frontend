import {Component, OnInit, AfterViewInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Trigger, TriggerAction} from '../../models/trigger.model';
import {AlertService} from '../../services/alert.service';
import {TriggerService} from '../../services/trigger.service';
import {Router} from '@angular/router';
import {Sensor} from '../../models/sensor.model';
import {SensorService} from '../../services/sensor.service';
import {CreateActionDialog, ICreateAction} from '../create-action.dialog';
import {ErrorStateMatcher} from '@angular/material/core';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
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
export class SensorWizardComponent implements OnInit, AfterViewInit {
  public tabIndex = 0;

  public nameForm : FormGroup;
  public name : FormControl;
  public desc : FormControl;

  public secretForm : FormGroup;
  public secret : FormControl;

  public triggerFrom: FormGroup;
  public matcher: TriggerEdgeMatcher;
  public showTriggerForm: boolean;

  public sensor: Sensor;
  public sensorCreated: boolean;

  public triggers: Trigger[];

  constructor(private fb: FormBuilder, private alerts: AlertService, private triggerService: TriggerService,
              private sensorService: SensorService, private router: Router, private dialog: MatDialog) {
    this.triggers = new Array<Trigger>();
    this.sensor = null;
    this.sensorCreated = false;
  }

  private atLeastOneRequired(form: FormGroup) : {[s:string]: boolean} {
    if(form.get('upperEdge') === null || form.get('lowerEdge') === null) {
      return null;
    }

    const upper = form.get('upperEdge').value.toString();
    const lower = form.get('lowerEdge').value.toString();
    const condition = upper.length === 0 && lower.length === 0;

    console.log(`Condition: ${condition}`);

    return condition ? { 'edgeRequired': true } : null;
  }

  private createTriggerForm() {
    this.showTriggerForm = false;
    this.matcher = new TriggerEdgeMatcher();
    this.triggerFrom = this.fb.group({
      keyValue: new FormControl('', [
        Validators.required,
        Validators.minLength(1)
      ]),

      upperEdge: new FormControl(''),
      lowerEdge: new FormControl('')
    }, { validator: this.atLeastOneRequired })
  }

  ngOnInit() {

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

    this.createTriggerForm();
  }

  ngAfterViewInit() {
    const preBtn = <HTMLElement>document.getElementById('preBtn');
    const moveTab = <HTMLElement>document.querySelector('.move-tab');
    const submitBtn = <HTMLElement>document.getElementById('submitBtn');

    submitBtn.style.display = 'none';
    preBtn.style.visibility = 'hidden';
    // to ensure moveTab can stay correct position
    $(window).resize(() => {
      const screenWidth = document.body.clientWidth;
      if (screenWidth > 990) {
        moveTab.style.width = 'calc((100% - 260px) / 2)';
        if (this.tabIndex === 1) {
          moveTab.style.left = '20vw';
        } else if (this.tabIndex === 2) {
          moveTab.style.left = '42vw';
        }
      } else {
        moveTab.style.width = 'calc((100% - 100px) / 2)';
        if (this.tabIndex === 1) {
          moveTab.style.left = '30vw';
        } else if (this.tabIndex === 2) {
          moveTab.style.left = '56vw';
        }
      }
    });

    const tabs = document.getElementsByClassName('wizard-tab');
    for (let i = 1; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = 'none';
    }
  }

  preOnClick() {
    const moveTab = <HTMLElement>document.querySelector('.move-tab');
    const nextBtn = <HTMLElement>document.getElementById('nextBtn');
    const preBtn = <HTMLElement>document.getElementById('preBtn');
    const submitBtn = <HTMLElement>document.getElementById('submitBtn');
    const tabs = document.getElementsByClassName('wizard-tab');
    const screenWidth = document.body.clientWidth;

    for (let i = 0; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = 'none';
    }

    this.showTriggerForm = false;
    submitBtn.style.visibility = 'hidden';

    if (this.tabIndex === 2) {
      this.tabIndex--;
      moveTab.style.left = screenWidth > 990 ? '20vw' : '30vw';
      // nextBtn.style.visibility = 'visible';
      nextBtn.style.display = 'block';
      moveTab.innerHTML = 'Account';
    }else if (this.tabIndex === 1) {
      this.tabIndex--;
      moveTab.style.left = '-1vw';
      preBtn.style.visibility = 'hidden';
      moveTab.innerHTML = 'About';
    }
    (<HTMLElement>tabs[this.tabIndex]).style.display = 'inherit';
  }

  nextOnClick() {
    const moveTab = <HTMLElement>document.querySelector('.move-tab');
    const nextBtn = <HTMLElement>document.getElementById('nextBtn');
    const preBtn = <HTMLElement>document.getElementById('preBtn');
    const submitBtn = <HTMLElement>document.getElementById('submitBtn');
    const tabs = document.getElementsByClassName('wizard-tab');
    const screenWidth = document.body.clientWidth;

    for (let i = 0; i < tabs.length; i++) {
      (<HTMLElement>tabs[i]).style.display = 'none';
    }

    if (this.tabIndex === 0) {
      this.tabIndex++;
      moveTab.style.left = screenWidth > 990 ? '20vw' : '30vw';
      preBtn.style.visibility = 'visible';
      moveTab.innerHTML = 'Account';
    } else if (this.tabIndex === 1) {
      this.tabIndex++;
      moveTab.style.left = screenWidth > 990 ? '42vw' : '56vw';
      moveTab.innerHTML = 'Address';
      // nextBtn.style.visibility = 'hidden';
      nextBtn.style.display = 'none';
      submitBtn.style.display = 'block';
      submitBtn.style.visibility = 'visible';
      preBtn.style.visibility = 'hidden';
      this.showTriggerForm = true;

      this.createSensor().subscribe((sensor) => {
        this.sensor = sensor;
        this.alerts.showSuccessNotification("Sensor created!");
        this.sensorCreated = true;
      }, error => {
        console.debug(`Unable to store sensor: ${error.toString()}`);
        this.alerts.showWarninngNotification(`Unable to create sensor!`);
        this.name.setValue('');
        this.desc.setValue('');
        this.secret.setValue('');
        this.preOnClick();
        this.preOnClick();
        return;
      });
    }

    (<HTMLElement>tabs[this.tabIndex]).style.display = 'inherit';
  }

  createSensor() {
    const sensor = new Sensor();

    sensor.name = this.name.value.toString();
    sensor.description = this.desc.value.toString();

    if (this.secret.value.toString().length > 0) {
      sensor.secret = this.secret.value.toString();
    }

    return this.sensorService.create(sensor);
  }


  createTrigger() {
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

    console.log(JSON.stringify(trigger));

    this.triggerService.createTrigger(trigger).subscribe((t) => {
      this.alerts.showSuccessNotification("Trigger created!");
      this.triggers.push(t);

      this.triggerFrom.get('upperEdge').setValue('');
      this.triggerFrom.get('lowerEdge').setValue('');
      this.triggerFrom.get('keyValue').setValue('');
    }, (error) => {
      console.debug(`Unable to store trigger: ${error.toString()}`);
      this.alerts.showWarninngNotification("Unable to store trigger!");
    });
  }

  public onToggleChanged(event: MatSlideToggleChange) {
    if(event.checked) {
      this.secret.disable();
      this.secret.setValue('');
    } else {
      this.secret.enable();
    }
  }

  public createAction(i: number) {
    const data = {
      target: "",
      selected: ""
    };

    const dialog = this.dialog.open(CreateActionDialog, {
      width: '450px',
      height: '400px',
      data: data
    });

    const sub = dialog.afterClosed().subscribe((result: ICreateAction) => {
      if(i >= this.triggers.length) {
        this.alerts.showWarninngNotification("Unable to create action!");
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
      }, (error) => {
        console.debug(`Unable to create action: ${JSON.stringify(error)}`);
        this.alerts.showWarninngNotification('Unable to create action!');
      });
    });
  }

  public removeTrigger(i: number) {
    const trigger = this.triggers[i];

    this.triggerService.deleteTrigger(trigger).subscribe(() => {
      this.alerts.showSuccessNotification("Trigger removed!");

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

  public onSubmitClick() {
    this.router.navigate([`/sensors/${this.sensor.internalId}`]);
  }
}
