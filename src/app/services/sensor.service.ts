/*
 * Sensor API service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Sensor} from '../models/sensor.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {LoginService} from './login.service';
import {SensorLink} from '../models/sensorlink.model';
import {Response} from '../dto/response';
import {Observable} from 'rxjs/internal/Observable';
import {PaginationResponse} from '../dto/paginationresponse';

export interface SensorUpdate {
  name: string;
  description: string;
  secret: string;
  storageEnabled: boolean;
}

@Injectable()
export class SensorService {
  private readonly options: any;

  public constructor(private http: HttpClient, private login: LoginService) {
    this.options = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  private static transformResponse<TValue>(response: Observable<Response<TValue>>): Observable<TValue> {
    return response.pipe(map((response, idx) => {
      return response.data;
    }));
  }

  private static transformPaginationResponse<TValue>(response: Observable<PaginationResponse<TValue>>) {
    return response.pipe(map((r, index) => {
      return r.data;
    }));
  }

  public create(sensor: Sensor): Observable<Sensor> {
    const url = `${environment.networkApiHost}/sensors`;
    const resp = this.http.post<Response<Sensor>>(url, JSON.stringify(sensor));
    return SensorService.transformResponse(resp);
  }

  public getSensorLinks(sensor: Sensor) {
    const url = `${environment.networkApiHost}/sensors/${sensor.id}/links`;
    const resp = this.http.get<PaginationResponse<SensorLink>>(url);
    return SensorService.transformPaginationResponse(resp);
  }

  public deleteSensorLink(link: SensorLink) {
    const url = `${environment.networkApiHost}/sensors/links`;

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
    const url = `${environment.networkApiHost}/sensors/${sensor.id}`;
    return this.http.delete(url, this.options);
  }

  public linkSensor(userId: string, sensorId: string) {
    const url = `${environment.networkApiHost}/sensors/links`;
    const data = {
      userId: userId,
      sensorId: sensorId
    };

    return this.http.post(url, JSON.stringify(data), this.options);
  }

  public get(id: string) {
    const url = `${environment.networkApiHost}/sensors/${id}`;
    const resp = this.http.get<Response<Sensor>>(url);
    return SensorService.transformResponse(resp);
  }


  public all(link = true, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?skip=${skip}&limit=${limit}&link=${link}`;
    const response = this.http.get<PaginationResponse<Sensor>>(url);
    return SensorService.transformPaginationResponse(response);
  }

  public find(name: string, skip = 0, limit = 0) {
    const url = `${environment.networkApiHost}/sensors?name=${name}&skip=${skip}&limit=${limit}`;
    const response = this.http.get<PaginationResponse<Sensor>>(url);
    return SensorService.transformPaginationResponse(response);
  }

  public update(id: string, sensor: SensorUpdate, secret: boolean) {
    let url = environment.networkApiHost;

    if(secret) {
      url += `/sensors/${id}/secret`
    } else {
      url += `/sensors/${id}`
    }

    const resp = this.http.put<Response<Sensor>>(url, JSON.stringify(sensor));
    return SensorService.transformResponse(resp);
  }
}
