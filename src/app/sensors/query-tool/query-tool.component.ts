import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {IQueryBuilderInterface} from '../query-builder-dialog/query-builder.interface';
import {SensorService} from '../../services/sensor.service';
import {Sensor} from '../../models/sensor.model';
import {QueryBuilderDialog} from '../query-builder-dialog/query-builder.dialog';
import {ChartistLegendDataArray} from '../../shared/large-chart-card/large-chart-card.component';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {DataService, ILocation} from '../../services/data.service';
import {AlertService} from '../../services/alert.service';
import {Measurement} from '../../models/measurement.model';
import * as moment from 'moment';

@Component({
  selector: 'app-query-tool',
  templateUrl: './query-tool.component.html',
  styleUrls: ['./query-tool.component.css']
})
export class QueryToolComponent implements OnInit {
  private sensors: Sensor[];

  public measurementData: any;
  public sensorName: string;

  public constructor(
    private dialog: MatDialog,
    private readonly sensorService: SensorService,
    private readonly dataService: DataService,
    private readonly alertService: AlertService
  ) {
  }

  public ngOnInit(): void {
    const data = new Array<ChartistLegendDataArray>();
    this.sensorName = "";

    this.measurementData = {
      labels: [],
      series: data
    };

    this.sensorService.find().subscribe((sensors) => {
      this.sensors = sensors;
    }, (error) => {
      console.debug(`Unable to load sensors:`);
      console.debug(error);
    });
  }

  public onQueryClick() {
    const data : IQueryBuilderInterface = {
      sensors: this.sensors,
      end: new Date(),
      start: new Date(),
      latitude:null,
      longitude:null,
      geoQuery: false,
      limit:null,
      max:null,
      sensor: null,
      skip: null
    };

    const dialog = this.dialog.open(QueryBuilderDialog, {
      width: '400px',
      height: '350px',
      scrollStrategy: new NoopScrollStrategy(),
      data: data
    });

    dialog.afterClosed().subscribe((result: IQueryBuilderInterface) => {
      if(result === undefined) {
        return;
      }

      let selectedSensor : Sensor;

      for(let sensor of this.sensors) {
        if(sensor.internalId === result.sensor) {
          selectedSensor = sensor;
          break;
        }
      }

      if(selectedSensor === null) {
        return;
      }

      if(result.geoQuery) {
        const location: ILocation = {
          longitude: result.longitude,
          latitude: result.latitude
        };

        this.dataService.getNear(result.sensor, result.start, result.end, location, result.max, result.limit, result.skip)
          .subscribe((result) => {
            this.measurementData = this.createGraphData(result);
            this.sensorName = selectedSensor.name;
        })
      } else {
        this.dataService.get(result.sensor, result.start, result.end, result.limit, result.skip).subscribe((result) => {
          this.measurementData = this.createGraphData(result);
          this.sensorName = selectedSensor.name;
        }, error => {
          console.debug(`Unable to fetch sensor data: ${error.toString()}`);
          this.alertService.showWarninngNotification("Unable to fetch sensor data!");
        });
      }
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
}
