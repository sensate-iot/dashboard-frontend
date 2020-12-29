import {Component, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ApiKeyService} from '../../../services/apikey.service';
import {AlertService} from '../../../services/alert.service';
import { MatDialog } from '@angular/material/dialog';
import {Sensor} from '../../../models/sensor.model';
import {SensorService, SensorUpdate} from '../../../services/sensor.service';
import {AddSensorLinkDialog} from './add-sensor-link-dialog/add-sensor-link-dialog.component';
import {SensorLink} from '../../../models/sensorlink.model';
import {LoginService} from '../../../services/login.service';
import {MatPaginator} from '@angular/material/paginator';
import {IUpdateSensorData, UpdateSensorDialog} from '../../../dialogs/update-sensor/update-sensor.dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {IShowSensorData, ShowSensorSecretsDialog} from '../../../dialogs/show-sensor-secrets/show-sensor-secrets.dialog';

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

  public onViewClick(sensor: Sensor) {
    const data: IShowSensorData = {
      id: sensor.id,
      secret: sensor.secret
    };

    const dialog = this.dialog.open(ShowSensorSecretsDialog, {
      width: '450px',
      height: '300px',
      scrollStrategy: new NoopScrollStrategy(),
      data: data
    });

    dialog.afterClosed().subscribe((result: IShowSensorData) => { });
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

  public onUpdateClicked(sensor: Sensor) {
    const update: IUpdateSensorData = {
      description: sensor.description,
      name: sensor.name,
      secret: sensor.secret,
      updateSecret: false
    };

    const dialog = this.dialog.open(UpdateSensorDialog, {
      width: '400px',
      height: '350px',
      scrollStrategy: new NoopScrollStrategy(),
      data:  update
    });

    dialog.afterClosed().subscribe((result) => {
      if(result === null || result === undefined) {
        return;
      }

      console.debug(result);
      const raw = result as IUpdateSensorData;
      const update: SensorUpdate = {
        secret: raw.secret,
        name: raw.name,
        description: raw.description
      };

      if(raw.updateSecret) {
        this.sensorService.update(sensor.id, update, true).subscribe(
          (updated) => {
            this.alerts.showSuccessNotification("Sensor updated!");
            sensor.name = update.name;
            sensor.description = update.description;
            sensor.secret = updated.secret;
          },
          error => {
            this.alerts.showWarninngNotification("Unable to update sensor!");
          });
      } else {
        this.sensorService.update(sensor.id, update, false).subscribe(() => {
          sensor.name = update.name;
          sensor.description = update.description;
          this.alerts.showSuccessNotification("Sensor updated!");
        }, () => {
          this.alerts.showWarninngNotification("Unable to update sensor!");
        });
      }
    });
  }

  public onLinkSensorClicked(sensor: Sensor) {
    const link: SensorLink = {
      sensorId: sensor.id,
      userId: ""
    };

    const dialog = this.dialog.open(AddSensorLinkDialog, {
      width: '400px',
      height: '225px',
      scrollStrategy: new NoopScrollStrategy(),
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

  public onDeleteClicked(idx : number) {
    const sensor = this.sensors[idx];
    const ary = new Array<Sensor>();

    this.sensorService.delete(sensor).subscribe(() => {
      this.sensors.forEach((s) => {
        if(s.id === sensor.id) {
          return;
        }

        ary.push(s);
      });

      this.sensors = ary;
      this.count -= 1;
    }, (error) => {
      console.debug("Unable to delete sensors:");
      console.debug(error);
      this.alerts.showWarninngNotification("Unable to delete sensor!");
    });
  }

  public unUnlinkClicked(sensor: Sensor, idx: number) {
    const link: SensorLink = {
      userId: this.login.getJwt().email,
      sensorId: sensor.id
    };

    this.sensorService.deleteSensorLink(link).subscribe(() => {
      this.sensors.splice(idx, 1);
    }, error => {
      console.debug("Unable to unlink sensor: ");
      console.debug(error);
    });
  }
}
