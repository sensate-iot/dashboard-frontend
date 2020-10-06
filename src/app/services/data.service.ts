/*
 * Data service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {LoginService} from './login.service';
import {Measurement} from '../models/measurement.model';
import {OrderDirection} from '../dto/orderdirection';

@Injectable()
export class DataService {
  private readonly options: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  };

  public constructor(
    private readonly http: HttpClient,
    private readonly login: LoginService
  ) {
    this.options = {};
  }

  public get(sensorId: string, start: Date, end: Date, limit: number = 0, skip: number = 0, order: OrderDirection = OrderDirection.none) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?sensorId=${sensorId}&start=${start.toISOString()}&end=${end.toISOString()}`;

    if(limit > 0) {
      url += `&limit=${limit}`;
    }

    if(skip > 0) {
      url += `&skip=${skip}`;
    }

    if(order !== OrderDirection.none) {
      url += `&order=${order}`;
    }

    return this.http.get<Measurement[]>(url, this.options);
  }
}
