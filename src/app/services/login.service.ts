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
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class LoginService {
  private readonly host: string;
  private readonly options: any;
  private static AuthCookie = 'SensateIoTAuth';

  public constructor(private http : HttpClient,
                     private readonly accounts: AccountService,
                     private readonly cookies: CookieService,
                     private readonly keys: ApiKeyService) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    this.host = window.location.hostname.replace(/^[^.]+\./g, "");
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

  public readAuthCookie() {
    const data = this.cookies.get(LoginService.AuthCookie);

    if(data === null || data.length <= 0) {
      return;
    }

    const json = atob(data);
    const jwt = JSON.parse(json);

    localStorage.setItem('jwt', json);
    localStorage.setItem('syskey', jwt.systemApiKey);

    return jwt;
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
    let jwt = this.readAuthCookie();

    if(jwt === null || jwt === undefined) {
      return false;
    }

    return jwt.refreshToken != null;
  }

  public revokeAllTokens() {
    const jwt = this.getJwt();

    if(jwt == null || jwt.refreshToken == null) {
      this.resetLogin();
      return;
    }

    this.keys.revokeAll(true).subscribe(() => {});

    return new Promise((resolve, reject) => {
      this.http.delete(environment.authApiHost + '/tokens/revoke-all', {
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
      }).subscribe(() => {
        this.resetLogin();
        resolve();
      }, () => {
        console.debug("Unable to revoke all tokens!");
        this.resetLogin();
        reject();
      });
    });
  }

  public logout() {
    return new Promise<void>(resolve => {
      const jwt = this.getJwt();

      if(jwt == null || jwt.refreshToken == null) {
        this.resetLogin();
        return;
      }

      const key = localStorage.getItem('syskey');

      if(key != null) {
        this.keys.revokeByKey(key).subscribe(() => {
          console.debug('System API key revoked!');
        });
      }

      this.http.delete(environment.authApiHost + '/tokens/revoke/' + jwt.refreshToken, {
        headers: new HttpHeaders().set('Content-Type', 'application/json').set('Cache-Control', 'no-cache')
      }).subscribe(() => {
        this.resetLogin();
        resolve();
      }, () => {
        console.debug('Unable to logout on server!');
        this.resetLogin();
        resolve();
      });
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
    this.setSession(jwt);
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
    localStorage.removeItem('roles');
    localStorage.removeItem('admin');
    localStorage.removeItem('userId');
    localStorage.removeItem('phone-confirmed');
    localStorage.removeItem('syskey');
    console.debug(`Removing cookie!`);
    this.cookies.delete(LoginService.AuthCookie, null, this.host);
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

  public setSession(data : Jwt) {
    const expire = moment().add(data.expiresInMinutes, 'minutes');
    const jwtExpire = moment().add(data.jwtExpiresInMinutes, 'minutes');

    data.jwtExpiresInMinutes = jwtExpire.unix();
    data.expiresInMinutes = expire.unix();

    localStorage.setItem('jwt', JSON.stringify(data));
    localStorage.setItem('syskey', data.systemApiKey);

    const cookie = btoa(JSON.stringify(data));
    this.cookies.set(LoginService.AuthCookie, cookie, expire.toDate(), null, this.host);
  }
}
