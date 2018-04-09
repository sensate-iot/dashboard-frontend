/*
 * Login service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Moment} from 'moment';
import {Jwt} from '../models/jwt.model';
import moment = require('moment');
import {Observable} from 'rxjs/Observable';
import {LockService} from './lock.service';

@Injectable()
export class LoginService {
  constructor(private http : HttpClient) { }


  public login(user: string, password: string) {
    const body = {
      "Email": user,
      "Password": password
    };

    LockService.createLock(user, password);
    return this.http.post<Jwt>(environment.apiHost + '/tokens/request', body, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    });
  }

  public isLoggedIn() : boolean {
    const jwt = this.getJwt();
    return jwt != null;
  }


  public logout() {
    LockService.destroyLock();
    const jwt = this.getJwt();

    localStorage.removeItem('jwt');
    if(jwt == null)
      return;

    if(jwt.refreshToken == null)
      return;

    return this.http.delete(environment.apiHost + '/tokens' + jwt.refreshToken, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    });
  }

  public refresh() : Observable<string> {
    return Observable.of('');
  }

  public getJwtToken() : string {
    const jwt = this.getJwt();

    if(jwt) {
      return jwt.jwtToken;
    }

    return null;
  }

  public getJwt() : Jwt {
    const data = localStorage.getItem('jwt');
    if(!data || data == null)
      return null;

    return JSON.parse(data, function (key, value) {
      if(value !== '')
        return value;

      let result = new Jwt();
      result.expiresInMinutes = value.expiresInMinutes;
      result.jwtExpiresInMinutes = value.jwtExpiresInMinutes;
      result.jwtToken = value.jwtToken;
      result.refreshToken = value.refreshToken;
      return result;
    });
  }

  public static handleError(error : any) {
    LockService.destroyLock();
  }

  public static setSession(data : Jwt) {
    const expire = moment().add(data.expiresInMinutes, 'minutes');
    const jwtExpire = moment().add(data.jwtExpiresInMinutes, 'minutes');

    data.jwtExpiresInMinutes = jwtExpire.unix();
    data.expiresInMinutes = expire.unix();

    localStorage.setItem('jwt', JSON.stringify(data));
  }
}
