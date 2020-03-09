/*
 * Login service.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Jwt} from '../models/jwt.model';
import * as moment from 'moment';
import {Observable} from 'rxjs';
import {LockService} from './lock.service';
import {TokenReply} from '../models/tokenreply.model';
import {ApiKeyService} from './apikey.service';
import {AccountService} from './account.service';

@Injectable()
export class LoginService {
  private readonly options: any;
  constructor(private http : HttpClient,
              private readonly accounts: AccountService,
              private readonly keys: ApiKeyService) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public setUserId() {
    if(!this.isLoggedIn() || localStorage.getItem('userId') !== null) {
      return;
    }

    this.accounts.getUser().subscribe(user => {
      localStorage.setItem("userId", user.id);
    });
  }

  public getUserId() {
    return localStorage.getItem("userId");
  }

  public login(user: string, password: string) {
    const body = {
      "Email": user,
      "Password": password
    };

    localStorage.removeItem('userId');
    LockService.createLock(user, password);
    return this.http.post<Jwt>(environment.authApiHost + '/tokens/request', body, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    });
  }

  public isLoggedIn() : boolean {
    const jwt = this.getJwt();

    if(jwt != null) {
      return jwt.refreshToken != null;
    }

    return false;
  }

  public revokeAllTokens() {
    const jwt = this.getJwt();

    if(jwt == null || jwt.refreshToken == null)
      return;

    this.keys.revokeAll(true).subscribe(() => {});

    return new Promise((resolve, reject) => {
      this.http.delete(environment.authApiHost + '/tokens/revoke-all', {
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
      }).subscribe(() => {
        LockService.destroyLock();
        localStorage.removeItem('jwt');
        localStorage.removeItem('phone-confirmed');
        localStorage.removeItem('roles');
        localStorage.removeItem('userId');
        localStorage.removeItem('syskey');
        localStorage.removeItem('admin');
        resolve();
      }, () => {
        console.debug("Unable to revoke all tokens!");
        reject();
      });
    });
  }

  public logout() {
    const jwt = this.getJwt();

    if(jwt == null || jwt.refreshToken == null)
      return;

    const key = localStorage.getItem('syskey');

    if(key != null) {
      this.keys.revokeByKey(key).subscribe(() => {
        console.debug('System API key revoked!');
      });
    }

    this.http.delete(environment.authApiHost + '/tokens/revoke/' + jwt.refreshToken, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
    }).subscribe(() => {

      LockService.destroyLock();
      localStorage.removeItem('jwt');
      localStorage.removeItem('phone-confirmed');
      localStorage.removeItem('roles');
      localStorage.removeItem('admin');
      localStorage.removeItem('userId');
      localStorage.removeItem('syskey');
    }, () => {
      console.log('Unable to logout on server!');
      LockService.destroyLock();
      localStorage.removeItem('jwt');
      localStorage.removeItem('roles');
      localStorage.removeItem('admin');
      localStorage.removeItem('userId');
      localStorage.removeItem('phone-confirmed');
      localStorage.removeItem('syskey');
    });
  }

  public refresh() : Observable<TokenReply> {
    const jwt = this.getJwt();

    if(jwt == null)
      return;

    const data = {
      "Email" : jwt.email,
      "RefreshToken": jwt.refreshToken
    };

    console.log('Attempting to get new token..');

    return this.http.post<TokenReply>(environment.authApiHost + '/tokens/refresh', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'none')
    });
  }

  public updateJwt(refresh : string, token : string, expiry : number) {
    const jwt = this.getJwt();

    jwt.refreshToken = refresh;
    jwt.jwtToken = token;
    jwt.expiresInMinutes = expiry;
    LoginService.setSession(jwt);
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
      result.email = value.email;
      return result;
    });
  }

  public resetLogin() {
    LockService.destroyLock();
    localStorage.removeItem('jwt');
    localStorage.removeItem('userId');
    localStorage.removeItem('syskey');
  }

  public getSysKey() {
    if(!this.isLoggedIn()) {
      return null;
    }

    return localStorage.getItem('syskey');
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
    localStorage.setItem('syskey', data.systemApiKey);
  }
}
