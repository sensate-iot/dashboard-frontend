import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminDashboard} from '../models/admindashboard.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {TimeSeriesGraphNode} from '../models/timeseries-graph-node.model';

@Injectable()
export class AdminService {

  constructor(private http : HttpClient) {
  }

  private static fixDateObject(entry : TimeSeriesGraphNode)
  {
    const date = entry.Xcoord as any;
    entry.Xcoord = new Date(Date.parse(date as string));
  }

  public getAdminDashboard() {
    return this.http.get<AdminDashboard>(environment.authApiHost + '/admin').pipe(map(value => {
      value.measurementStats.forEach(entry => {
        AdminService.fixDateObject(entry);
      });

      value.registrations.forEach(entry => {
        AdminService.fixDateObject(entry);
      });

      return value;
    }));
  }
}
