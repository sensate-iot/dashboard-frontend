/*
 * Trigger service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Trigger, TriggerAction, TriggerType} from '../models/trigger.model';
import {LoginService} from './login.service';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs/internal/Observable';
import {Response} from '../dto/response';
import {map} from 'rxjs/operators';
import {PaginationResponse} from '../dto/paginationresponse';

@Injectable()
export class TriggerService {
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

  public constructor(private http: HttpClient, private login: LoginService) {
    this.options = {
      observe: 'body',
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

  public createTrigger(trigger: Trigger) {
    const url = `${environment.networkApiHost}/triggers`;

    const response = this.http.post<Response<Trigger>>(url, JSON.stringify(trigger), this.options);
    return TriggerService.transformResponse(response);
  }

  public deleteTrigger(trigger: Trigger) {
    const url = `${environment.networkApiHost}/triggers/${trigger.id}`;

    return this.http.delete(url, this.options);
  }

  public addAction(trigger: Trigger, action: TriggerAction) {
    const url = `${environment.networkApiHost}/triggers/${trigger.id}/actions`;
    const resp = this.http.post<Response<Trigger>>(url, JSON.stringify(action), this.options);
    return TriggerService.transformResponse(resp);
  }

  public removeAction(trigger: Trigger, action: TriggerAction) {
    const url = `${environment.networkApiHost}/triggers/${trigger.id}/actions?channel=${action.channel}`;

    return this.http.delete(url, this.options);
  }

  public getAllForByType(sensorId: string, type: TriggerType) {
    const url = `${environment.networkApiHost}/sensors/${sensorId}/triggers?type=${type}`;
    const resp = this.http.get<PaginationResponse<Trigger>>(url, this.options);

    return TriggerService.transformPaginationResponse(resp);
  }
}
