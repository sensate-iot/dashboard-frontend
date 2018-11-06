import { Component, OnInit } from '@angular/core';
import {AdminDashboard} from '../../models/admindashboard.model';
import {AdminService} from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private dashboard : AdminDashboard;
  private verifiedUsers : number;

  constructor(private admin : AdminService) {
    this.dashboard = new AdminDashboard();
    this.verifiedUsers = 0.0;
  }

  ngOnInit() {
    this.admin.getAdminDashboard().subscribe((value) => {
      this.dashboard = value;
      console.log(value);
      const verified = this.dashboard.numberOfUsers - this.dashboard.numberOfGhosts;
      this.verifiedUsers = 100.0 * verified / this.dashboard.numberOfUsers;
    });
  }

}
