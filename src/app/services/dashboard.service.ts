/*
 * Dashboard HTTP client service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {UserDashboard} from '../models/userdashboard.model';
import {TimeSeriesGraphNode} from '../models/timeseries-graph-node.model';


@Injectable()
export class DashBoardService {
  constructor(private http : HttpClient) {
  }

  private static fixDateObject(entry : TimeSeriesGraphNode) {
    const date = entry.Xcoord as any;
    entry.Xcoord = new Date(Date.parse(date as string));
  }

  public getUserDashboard() {
    return this.http.get<UserDashboard>(environment.dashboardApiHost + '/dashboard').pipe(map(value => {
      value.measurementsToday.forEach(entry => {
        DashBoardService.fixDateObject(entry);
      });

      return value;
    }));
  }
}
