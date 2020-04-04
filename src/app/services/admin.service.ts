import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AdminDashboard} from '../models/admindashboard.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {TimeSeriesGraphNode} from '../models/timeseries-graph-node.model';
import {User} from '../models/user.model';
import {PaginationResult} from '../models/paginationresult.model';

@Injectable()
export class AdminService {

  constructor(private http : HttpClient) {
  }

  private static fixDateObject(entry : TimeSeriesGraphNode)
  {
    const date = entry.Xcoord as any;
    entry.Xcoord = new Date(Date.parse(date as string));
  }

  public getRecentUsers(skip = 0, limit = 0) {
    return this.http.get<PaginationResult<User>>(`${environment.authApiHost}/admin/users?skip=${skip}&limit=${limit}`);
  }

  public findUsers(email : string, skip = 0, limit = 0) {
    const data = {
      query: email
    };

    return this.http.post<PaginationResult<User>>(`${environment.authApiHost}/admin/find-users?skip=${skip}&limit=${limit}`, data);
  }


  public getAdminDashboard() {
    return this.http.get<AdminDashboard>(environment.dashboardApiHost + '/dashboard/admin').pipe(map(value => {
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
