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
import {SensorLink} from '../models/sensorlink.model';
import {PaginationResult} from '../models/paginationresult.model';

@Injectable()
export class SensorService {
  private readonly options: any;

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

  public getSensorLinks(sensor: Sensor) {
    const url = `${environment.networkApiHost}/sensors/links?sensorId=${sensor.internalId}&key=${this.login.getSysKey()}`;
    return this.http.get<SensorLink[]>(url);
  }

  public deleteSensorLink(link: SensorLink) {
    const url = `${environment.networkApiHost}/sensors/links?key=${this.login.getSysKey()}`;

    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify(link)
    };

    return this.http.delete(url, options);
  }

  public isLinkedSensor(sensor: Sensor) {
    return sensor.owner !== this.login.getUserId();
  }

  public delete(sensor: Sensor) {
    const url = `${environment.networkApiHost}/sensors/${sensor.internalId}?key=${this.login.getSysKey()}`;
    return this.http.delete(url, this.options);
  }

  public linkSensor(userId: string, sensorId: string) {
    const url = `${environment.networkApiHost}/sensors/links?key=${this.login.getSysKey()}`;
    const data = {
      userId: userId,
      sensorId: sensorId
    };

    return this.http.post(url, JSON.stringify(data), this.options);
  }

  public get(id: string) {
    const url = `${environment.networkApiHost}/sensors/${id}?key=${this.login.getSysKey()}`;
    return this.http.get<Sensor>(url).pipe(map((response) => {
      return SensorService.MapSensorCreationDate(response);
    }));
  }

  public all(link = true, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?key=${this.login.getSysKey()}&skip=${skip}&limit=${limit}&link=${link}`;
    return this.http.get<PaginationResult<Sensor>>(url);
  }

  public find(name: string, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?key=${this.login.getSysKey()}&name=${name}&skip=${skip}&limit=${limit}`;
    return this.http.get<PaginationResult<Sensor>>(url);
  }
}
