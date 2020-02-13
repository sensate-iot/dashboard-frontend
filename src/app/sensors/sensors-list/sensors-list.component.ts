import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiKeyService} from '../../services/apikey.service';
import {AlertService} from '../../services/alert.service';
import {MatDialog} from '@angular/material';
import {Sensor} from '../../models/sensor.model';
import {SensorService} from '../../services/sensor.service';

@Component({
  selector: 'app-sensors-list',
  templateUrl: './sensors-list.component.html',
  styleUrls: ['./sensors-list.component.css']
})
export class SensorsListComponent implements OnInit {
  private searchFieldValue : string;
  private sensors: Sensor[];
  private allSensors: Sensor[];

  private disableButtonAddTrigger: boolean;

  public form : FormGroup;
  public action : string;

  public constructor(private keys : ApiKeyService, private sensorService: SensorService,
              private alerts : AlertService, private dialog: MatDialog) {
    this.form = new FormGroup({});
  }

  private fetchSensors() {
    this.sensorService.find().subscribe((sensors) => {
      this.allSensors = sensors;
      this.sensors = sensors;
    }, error1 => {
      this.alerts.showWarninngNotification("Unable to fetch sensors!");
    });
  }

  public ngOnInit() {
    this.fetchSensors();
  }

  public descText(text: string): string {
    if(text.length > 30) {
      return `${text.substring(0, 30)}...`;
    }

    return text;
  }

  public onSearchClicked() {
    const query = this.searchFieldValue;

    if(query.length === 0) {
      this.sensors = this.allSensors;
      return;
    }

    this.sensors = new Array<Sensor>();

    this.allSensors.forEach(sensor => {
      if(sensor.name.toLowerCase().includes(query.toLowerCase()))
        this.sensors.push(sensor);
    });
  }

  private copyMessage(val: string){
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
  }

  public onDeleteClicked(idx : number) {
    const sensor = this.sensors[idx];
    const ary = new Array<Sensor>();

    this.sensorService.delete(sensor).subscribe(() => {
      this.sensors.forEach((s) => {
        if(s.internalId === sensor.internalId) {
          return;
        }

        ary.push(s);
      });

      this.sensors = ary;
    }, (error) => {
      console.log(`Unable to delete sensors: ${JSON.stringify(error)}`);
      this.alerts.showWarninngNotification("Unable to delete sensor!");
    });
  }

  public onShowClicked(num : number) {
    const sensor = this.sensors[num];

    this.copyMessage(sensor.secret);
    this.alerts.showNotification('Sensor secret copied to clipboard!', 'top-center', 'success');
  }

  public onDetailsClicked(num: number) {
  }

}
