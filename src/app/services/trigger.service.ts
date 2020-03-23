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

  public createTrigger(trigger: Trigger) {
    const key = this.login.getSysKey();
    const url = `${environment.networkApiHost}/triggers?key=${key}`;

    return this.http.post<Trigger>(url, JSON.stringify(trigger), this.options);
  }

  public deleteTrigger(trigger: Trigger) {
    const key = this.login.getSysKey();
    const url = `${environment.networkApiHost}/triggers/${trigger.id}?key=${key}`;

    return this.http.delete(url, this.options);
  }

  public addAction(trigger: Trigger, action: TriggerAction) {
    const key = this.login.getSysKey();
    const url = `${environment.networkApiHost}/triggers/${trigger.id}/add-action?key=${key}`;

    return this.http.post<Trigger>(url, JSON.stringify(action), this.options);
  }

  public removeAction(trigger: Trigger, action: TriggerAction) {
    const key = this.login.getSysKey();
    const url = `${environment.networkApiHost}/triggers/${trigger.id}/remove-action?key=${key}&channel=${action.channel}`;

    return this.http.delete(url, this.options);
  }

  public getAllForByType(sensorId: string, type: TriggerType) {
    const key = this.login.getSysKey();
    const url = `${environment.networkApiHost}/triggers?key=${key}&sensorId=${sensorId}&type=${type}`;

    return this.http.get<Trigger[]>(url, this.options);
  }
}
