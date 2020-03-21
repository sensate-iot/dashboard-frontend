import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {IQueryBuilderInterface} from '../query-builder-dialog/query-builder.interface';
import {SensorService} from '../../../services/sensor.service';
import {Sensor} from '../../../models/sensor.model';
import {QueryBuilderDialog} from '../query-builder-dialog/query-builder.dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {DataService, ILocation} from '../../../services/data.service';
import {AlertService} from '../../../services/alert.service';
import {ChartistLegendDataArray, GraphService} from '../../../services/graph.service';
import {environment} from '../../../../environments/environment';
import {LoginService} from '../../../services/login.service';
import {IRealTimeData} from '../../../models/realtimedata.model';
import {Subscription} from 'rxjs';
import {Measurement} from '../../../models/measurement.model';
import {RealTimeDataService} from '../../../services/realtimedata.service';

@Component({
  selector: 'app-query-tool',
  templateUrl: './query-tool.component.html',
  styleUrls: ['./query-tool.component.css']
})
export class QueryToolComponent implements OnInit, OnDestroy {
  private sensors: Sensor[];

  private measurements: Measurement[];

  public measurementData: any;
  public sensorName: string;
  private selectedSensor: Sensor;

  public liveDataElementDisabled: boolean;
  public liveDataEnabled: boolean;
  public resetChart: boolean;
  private rxSubscription: Subscription;

  public constructor(
    private dialog: MatDialog,
    private readonly sensorService: SensorService,
    private readonly dataService: DataService,
    private readonly loginService: LoginService,
    private readonly alertService: AlertService,
    private readonly graphService: GraphService,
    private readonly liveDataService: RealTimeDataService
  ) {
    this.rxSubscription = null;
    this.measurements = [];
    this.liveDataEnabled = false;
    this.liveDataElementDisabled = true;
    this.resetChart = true;
  }

  public ngOnDestroy(): void {
    this.disconnectLiveDataService();
  }

  private disconnectLiveDataService() {
    if(this.rxSubscription !== null) {
      this.rxSubscription.unsubscribe();
      this.rxSubscription = null;
    }

    if(!this.liveDataService.isConnected()) {
      return;
    }

    this.liveDataService.disconnect();
  }

  public ngOnInit(): void {
    const data = new Array<ChartistLegendDataArray>();
    this.sensorName = "";

    this.measurementData = {
      labels: [],
      series: data
    };

    this.sensorService.all().subscribe((sensors) => {
      this.sensors = sensors.values;
    }, (error) => {
      console.debug(`Unable to load sensors:`);
      console.debug(error);
    });

    this.connnectToLiveData();
  }

  public connnectToLiveData() {
    this.disconnectLiveDataService(); /* Disconnect any active connections to prevent leaks */
    this.liveDataService.connect(environment.liveDataHost);

    this.rxSubscription = this.liveDataService.onMessage().subscribe(value => {
      const data = JSON.parse(value) as IRealTimeData;

      this.measurements = this.measurements.concat(data.measurements);
      this.measurementData = this.graphService.createGraphData(this.measurements);
    });
  }

  public liveDataToggled(event: any) {
    if(!this.liveDataEnabled) {
      this.liveDataService.subscribe(this.selectedSensor);
      this.resetChart = false;
    } else {
      this.liveDataService.unsubscribe(this.selectedSensor);
      this.resetChart = true;
    }
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
      result: null,
      skip: null,
      multi: false
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

      if(this.selectedSensor !== null && this.selectedSensor !== undefined && this.liveDataEnabled) {
        this.liveDataEnabled = false;
        this.liveDataService.unsubscribe(this.selectedSensor);
      }

      for(let sensor of this.sensors) {
        if(sensor.internalId === result.result[0].internalId) {
          this.selectedSensor = sensor;
          break;
        }
      }

      if(this.selectedSensor === null) {
        return;
      }

      if(result.geoQuery) {
        const location: ILocation = {
          longitude: result.longitude,
          latitude: result.latitude
        };

        this.resetChart = true;

        this.dataService.getNear(result.result[0].internalId, result.start, result.end, location, result.max, result.limit, result.skip)
          .subscribe((result) => {
            this.measurements = result;
            this.measurementData = this.graphService.createGraphData(result);
            this.sensorName = this.selectedSensor.name;
            this.liveDataElementDisabled = false;
        }, error => {
          console.debug(`Unable to fetch sensor data: ${error.toString()}`);
          this.alertService.showWarninngNotification("Unable to fetch sensor data!");
        });

      } else {
        this.dataService.get(result.result[0].internalId, result.start, result.end, result.limit, result.skip).subscribe((result) => {
          this.measurements = result;
          this.measurementData = this.graphService.createGraphData(result);
          this.sensorName = this.selectedSensor.name;
          this.liveDataElementDisabled = false;
        }, error => {
          console.debug(`Unable to fetch sensor data: ${error.toString()}`);
          this.alertService.showWarninngNotification("Unable to fetch sensor data!");
        });
      }
    });
  }
}
