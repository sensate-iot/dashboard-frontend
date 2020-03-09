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
import {longStackSupport} from 'q';

export interface ILocation {
  longitude: number;
  latitude: number;
}

interface Filter {
  sensorIds: string[];
  start: string;
  end: string;
  skip: number;
  limit: number;
  longitude: number;
  latitude: number;
  radius: number;
}

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

  public constructor(
    private readonly http: HttpClient,
    private readonly login: LoginService
  ) {
  }

  public getFromMany(sensorId: string[], start: Date, end: Date, limit: number = 0, skip: number = 0) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?key=${key}`;
    const filter : Filter = {
      end: end.toISOString(),
      start: start.toISOString(),
      latitude: null,
      longitude: null,
      radius: null,
      limit: limit,
      skip: skip,
      sensorIds: sensorId
    };

    return this.http.post<Measurement[]>(url, JSON.stringify(filter), this.options);
  }

  public getNearFromMany(
    sensorIds: string[],
    start: Date,
    end: Date,
    location: ILocation,
    radius: number,
    limit: number = 0,
    skip: number = 0
  ) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?key=${key}`;
    const filter : Filter = {
      end: end.toISOString(),
      start: start.toISOString(),
      latitude: location.latitude,
      longitude: location.longitude,
      radius: radius,
      limit: limit,
      skip: skip,
      sensorIds: sensorIds
    };

    return this.http.post<Measurement[]>(url, JSON.stringify(filter), this.options);
  }

  public get(sensorId: string, start: Date, end: Date, limit: number = 0, skip: number = 0) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?key=${key}&sensorId=${sensorId}&start=${start.toISOString()}&end=${end.toISOString()}`;

    if(limit > 0) {
      url += `&limit=${limit}`;
    }

    if(skip > 0) {
      url += `&skip=${skip}`;
    }

    return this.http.get<Measurement[]>(url, this.options);
  }

  public getNear(sensorId: string, start: Date, end: Date, location: ILocation, radius: number, limit: number = 0, skip: number = 0) {
    const key = this.login.getSysKey();
    let url = `${environment.dataApiHost}/measurements?key=${key}&sensorId=${sensorId}`+
      `&start=${start.toISOString()}&end=${end.toISOString()}` +
      `&longitude=${location.longitude}&latitude=${location.latitude}&radius=${radius}`;

    if(limit > 0) {
      url += `&limit=${limit}`;
    }

    if(skip > 0) {
      url += `&skip=${skip}`;
    }

    return this.http.get<Measurement[]>(url, this.options);
  }
}
