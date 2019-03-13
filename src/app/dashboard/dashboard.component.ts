import { Component, OnInit } from '@angular/core';
import {DashBoardService} from '../services/dashboard.service';
import {UserDashboard} from '../models/userdashboard.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private measurementsTodayData : any;
  private measurementsOverallData : any;

  private apiCallsPerDayData : any;
  private measurementsPerHourOverallData : any;

  private sensorCount : number;
  private measurementsCount : number;
  private apiCallCount : number;
  private authTokenCount : number;

  constructor(private db : DashBoardService) { }

  public ngOnInit() {
    this.db.getUserDashboard().subscribe(db => {
      this.buildMeasurementsToday(db);
      this.buildMeasurementsOverall(db);
      this.buildMeasurementsOverallPerDay(db);
      this.buildApiCalls(db);

      this.sensorCount = db.sensorCount;
      this.measurementsCount = db.measurementsTodayCount;
      this.apiCallCount = db.apiCallCount;
      this.authTokenCount = db.securityTokenCount;
    });
  }

  /* Per hour today */
  private buildMeasurementsToday(db : UserDashboard) {
    const measurementLabels : string[] = [];
    const measurementSeries : number[] = [];

    db.measurementsToday.forEach(entry => {
      const date = entry.Xcoord as Date;

      measurementLabels.push(moment(date).utc().format('HH:mm'));
      measurementSeries.push(entry.Ycoord);
    });

    this.measurementsTodayData = {
      labels: measurementLabels,
      series: [measurementSeries]
    };
  }

  /* Cumulative graph */
  private buildMeasurementsOverall(db : UserDashboard) {
    const measurementLabels : string[] = [];
    const measurementSeries : number[] = [];

    db.measurementsCumulative.forEach(entry => {
      const date = entry.Xcoord as Date;

      measurementLabels.push(moment(date).utc().format('DD-MM-YYYY'));
      measurementSeries.push(entry.Ycoord);
    });

    this.measurementsOverallData = {
      labels: measurementLabels,
      series: [measurementSeries]
    };
  }

  private buildApiCalls(db : UserDashboard) {
    const labels : string[] = [];
    const series : number[] = [];

    db.apiCallsLastWeek.forEach(entry => {
      const date = entry.Xcoord as Date;

      labels.push(moment(date).utc().format('DD-MM-YYYY'));
      series.push(entry.Ycoord);
    });

    this.apiCallsPerDayData = {
      labels: labels,
      series: [series]
    };
  }

  /* Bar graph, hour of the day */
  private buildMeasurementsOverallPerDay(db : UserDashboard) {
    const labels : string[] = [];
    const series : number[] = [];

    let weekday = [];
    weekday[0] = "Sun.";
    weekday[1] = "Mon.";
    weekday[2] = "Tue.";
    weekday[3] = "Wed.";
    weekday[4] = "Thu.";
    weekday[5] = "Fri.";
    weekday[6] = "Sat.";

    db.measurementsPerDayCumulative.forEach(entry => {
      labels.push(weekday[entry.Xcoord]);
      series.push(entry.Ycoord);
    });

    this.measurementsPerHourOverallData = {
      labels: labels,
      series: [series]
    };
  }
}
