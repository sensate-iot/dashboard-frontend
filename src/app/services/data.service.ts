/*
 * Data service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Measurement} from '../models/measurement.model';
import {OrderDirection} from '../dto/orderdirection';
import {Observable} from "rxjs/internal/Observable";
import {Response} from "../dto/response";
import {map} from "rxjs/operators";

@Injectable()
export class DataService {

  private static transformResponse<TValue>(response: Observable<Response<TValue>>): Observable<TValue> {
    return response.pipe(map((response, idx) => {
      return response.data;
    }));
  }

  public constructor(private readonly http: HttpClient) {
  }

  public get(sensorId: string, start: Date, end: Date, limit: number = 0, skip: number = 0, order: OrderDirection = OrderDirection.none) {
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

    const resp = this.http.get<Response<Measurement[]>>(url);
    return DataService.transformResponse(resp);
  }
}
