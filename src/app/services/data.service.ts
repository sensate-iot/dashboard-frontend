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

@Injectable()
export class DataService {
  private  options: {
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

  public constructor(private http: HttpClient, private login: LoginService) {
  }

  public get(sensorId: string, start: Date, end: Date, limit: number) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?key=${key}&sensorId=${sensorId}&start=${start.toISOString()}&end=${end.toISOString()}`;

    if(limit > 0) {
      url += `&max=${limit}`;
    }

    return this.http.get<Measurement[]>(url, this.options);
  }
}
