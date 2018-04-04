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

@Injectable()
export class LoginService {
  constructor(private http : HttpClient) { }


  public login(user: string, password: string) : boolean {
    const body = {
      "Email": user,
      "Password": password
    };

    this.http.post<Jwt>(environment.apiHost + '/tokens/request', body, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    }).subscribe(
      data => {
        LoginService.setSession(data.body);
        return true;
      },
      error => {
        LoginService.handleError(error);
        return false;
      }
    );

    return true;
  }

  public logout() {
    const jwt = this.getJwt();

    if(jwt == null)
      return;

    if(jwt.refreshToken == null)
      return;

    return this.http.delete(environment.apiHost + '/tokens' + jwt.refreshToken, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    });
  }

  public test() : boolean {
    this.http.get<Jwt>(environment.apiHost + '/accounts/show',{
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    }).subscribe(
      data => {
        LoginService.setSession(data.body);
        return true;
      },
      error => {
        LoginService.handleError(error);
        return false;
      }
    );

    return true;
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
    if(!data)
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

  private static handleError(error : any) {
    //console.log('Failed to login:');
    //console.log(error);
  }

  private static setSession(data : Jwt) {
    const expire = moment().add(data.expiresInMinutes, 'minutes');
    const jwtExpire = moment().add(data.jwtExpiresInMinutes, 'minutes');

    data.jwtExpiresInMinutes = jwtExpire.unix();
    data.expiresInMinutes = expire.unix();

    localStorage.setItem('jwt', JSON.stringify(data));
  }
}
