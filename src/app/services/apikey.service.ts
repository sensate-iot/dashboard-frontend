/*
 * API key service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ApiKey} from '../models/apikey.model';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable()
export class ApiKeyService {
  private readonly options : any;

  constructor(private client : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public create(name : string, readonly : boolean) {
    const create = {
      "name": name,
      "readOnly": readonly
    };

    return this.client.post<ApiKey>(environment.authApiHost + '/apikeys/create', create, this.options).pipe(
      map((resp : HttpResponse<ApiKey>) => {
        const key = resp.body;
        const date = key.createdOn;
        key.createdOn = new Date(Date.parse(date as string));
        return key;
    }));
  }

  public revoke(id : string) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?id=' + id, this.options);
  }

  public revokeByKey(key: string) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?key=' + key, this.options);
  }

  public revokeAll(systemonly : boolean) {
    return this.client.delete(environment.authApiHost + '/apikeys/revoke?system=' + systemonly, this.options);
  }

  public refresh(id : string) {
    return this.client.patch<ApiKey>(environment.authApiHost + '/apikeys/' + id, null, this.options).pipe(
      map((value : ApiKey) => {
        const date = value.createdOn;
        value.createdOn = new Date(Date.parse(date as string));
        return value;
      })
    );
  }

  public getAllKeys() {
    return this.client.get<ApiKey[]>(environment.authApiHost + '/apikeys').pipe(map(value => {
      value.forEach(entry => {
        const raw = entry.createdOn as any;
        entry.createdOn = new Date(Date.parse(raw));
      });

      return value;
    }));
  }
}
