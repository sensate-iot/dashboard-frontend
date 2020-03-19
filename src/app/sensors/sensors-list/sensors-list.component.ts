import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiKeyService} from '../../services/apikey.service';
import {AlertService} from '../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import {Sensor} from '../../models/sensor.model';
import {SensorService} from '../../services/sensor.service';
import {AddSensorLinkDialog} from './add-sensor-link-dialog/add-sensor-link-dialog.component';
import {SensorLink} from '../../models/sensorlink.model';
import {LoginService} from '../../services/login.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-sensors-list',
  templateUrl: './sensors-list.component.html',
  styleUrls: ['./sensors-list.component.css']
})
export class SensorsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public pageOptions =  [10,25,100,200];
  public pageSize: number;
  public pageIndex: number;
  public count: number;

  public searchFieldValue : string;
  public sensors: Sensor[];

  public form : FormGroup;
  public action : string;

  public constructor(private keys : ApiKeyService, private sensorService: SensorService,
              private readonly login: LoginService,
              private alerts : AlertService, private dialog: MatDialog) {
    this.form = new FormGroup({});
    this.pageSize = this.pageOptions[0];
    this.pageIndex = 0;
  }

  private fetchSensors() {
    if(this.searchFieldValue === undefined || this.searchFieldValue.length <= 0) {
      this.sensorService.all(true, this.pageIndex * this.pageSize, this.pageSize).subscribe((sensors) => {
        this.sensors = sensors.values;
        this.count = sensors.count;
      }, error1 => {
        this.alerts.showWarninngNotification("Unable to fetch sensors!");
      });
    } else {
      this.sensorService.find(this.searchFieldValue, this.pageIndex * this.pageSize, this.pageSize).subscribe((sensors) => {
        this.sensors = sensors.values;
        this.count = sensors.count;
      }, error1 => {
        this.alerts.showWarninngNotification("Unable to fetch sensors!");
      });
    }
  }

  public onPaginate(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchSensors();
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
    this.paginator.firstPage();
    this.fetchSensors();
  }

  public isLinkedSensor(sensor: Sensor) {
    return this.sensorService.isLinkedSensor(sensor);
  }

  public onLinkSensorClicked(sensor: Sensor) {
    const link: SensorLink = {
      sensorId: sensor.internalId,
      userId: ""
    };

    const dialog = this.dialog.open(AddSensorLinkDialog, {
      width: '400px',
      height: '225px',
      data: link
    });

    dialog.afterClosed().subscribe((result: SensorLink) => {
      if(result === null || result === undefined) {
        return;
      }

      if(result.userId.length <= 0) {
        return;
      }

      this.sensorService.linkSensor(result.userId, result.sensorId).subscribe(() => {
        this.alerts.showSuccessNotification("Sensor linked!")
      }, error => {
        this.alerts.showWarninngNotification(`Unable to link sensor: ${error.error.message}`);
        console.debug("Unable to link sensors: ");
        console.debug(error);
      });
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

  public unUnlinkClicked(sensor: Sensor, idx: number) {
    const link: SensorLink = {
      userId: this.login.getJwt().email,
      sensorId: sensor.internalId
    };

    this.sensorService.deleteSensorLink(link).subscribe(() => {
      this.sensors.splice(idx, 1);
    }, error => {
      console.debug("Unable to unlink sensor: ");
      console.debug(error);
    });
  }

  public onShowClicked(num : number) {
    const sensor = this.sensors[num];

    this.copyMessage(sensor.secret);
    this.alerts.showNotification('Sensor secret copied to clipboard!', 'top-center', 'success');
  }
}
