import { Component, OnInit } from '@angular/core';
import {AdminDashboard} from '../../../models/admindashboard.model';
import {AdminService} from '../../../services/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  public dashboard : AdminDashboard;
  public verifiedUsers : number;

  public measurementData : any;
  public registrationData : any;

  public measurementSeries : number[];

  constructor(private admin : AdminService) {
    this.dashboard = new AdminDashboard();
    this.verifiedUsers = 0.0;
  }

  public ngOnInit() : void {
    this.admin.getAdminDashboard().subscribe((value) => {
      this.dashboard = value;
      const verified = this.dashboard.numberOfUsers - this.dashboard.numberOfGhosts;
      this.verifiedUsers = 100.0 * verified / this.dashboard.numberOfUsers;

      let registrationLabels : string[] = [];
      let registrationSeries : number[] = [];

      let measurementLabels : string[] = [];
      this.measurementSeries = [];

      /* Build registration graph */
      this.dashboard.registrations.map((entry) => {
        const date = entry.Xcoord as Date;
        registrationLabels.push(moment(date).utc().format('DD-MM-YYYY'));
        registrationSeries.push(entry.Ycoord);
      });

      /* Build measurements graph */
      this.dashboard.measurementStats.forEach(entry => {
        const date = entry.Xcoord as Date;

        measurementLabels.push(moment(date).utc().format('HH:mm'));
        this.measurementSeries.push(entry.Ycoord);
      });

      this.registrationData = {
        labels: registrationLabels,
        series: [registrationSeries]
      };

      this.measurementData = {
        labels: measurementLabels,
        series: [this.measurementSeries]
      };
    });
  }
}
