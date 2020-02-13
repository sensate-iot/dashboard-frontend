/*
 * Sensor API service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {Sensor} from '../models/sensor.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {LoginService} from './login.service';

@Injectable()
export class SensorService {
  private options: any;

  public constructor(private http: HttpClient, private login: LoginService) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  private static MapSensorCreationDateResponse(response: HttpResponse<Sensor>) {
    const s = response.body;
    const date = s.createdAt;

    s.createdAt = new Date(Date.parse(date as string));
    return s;
  }

  private static MapSensorCreationDate(s: Sensor) {
    const date = s.createdAt;

    s.createdAt = new Date(Date.parse(date as string));
    return s;
  }

  public create(sensor: Sensor) {
    const url = `${environment.networkApiHost}/sensors?key=${this.login.getSysKey()}`;
    return this.http.post<Sensor>(url, JSON.stringify(sensor), this.options).pipe(
      map((response: HttpResponse<Sensor>) => {
        return SensorService.MapSensorCreationDateResponse(response);
      })
    );
  }

  public delete(sensor: Sensor) {
    const url = `${environment.networkApiHost}/sensors/${sensor.internalId}?key=${this.login.getSysKey()}`;
    return this.http.delete(url, this.options);
  }

  public get(id: string) {
    const url = `${environment.networkApiHost}/sensors/${id}?key=${this.login.getSysKey()}`;
    return this.http.get<Sensor>(url).pipe(map((response) => {
      return SensorService.MapSensorCreationDate(response);
    }));
  }

  public find(name: string = '') {
    let url = `${environment.networkApiHost}/sensors?key=${this.login.getSysKey()}`;

    if(name !== null && name.length > 0) {
      url = `${url}&name=${name}`;
    }

    return this.http.get<Sensor[]>(url).pipe(map(value => {
      value.forEach(entry => {
        const date = entry.createdAt as string;
        entry.createdAt = new Date(Date.parse(date));
      });

      return value;
    }));
  }
}
