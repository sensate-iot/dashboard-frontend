/*
 * Refresh token interceptor service: a service to
 * refresh JWT tokens transparently in the background.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginService} from './login.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import {TokenReply} from '../models/tokenreply.model';
import {catchError, filter, finalize, flatMap, switchMap, take} from 'rxjs/operators';

@Injectable()
export class RefreshTokenInterceptorService implements HttpInterceptor {
  private isRefreshingToken : boolean;
  private tokenSubject : BehaviorSubject<string>;

  constructor(private auth : LoginService, private router : Router) {
    this.isRefreshingToken = false;
    this.tokenSubject = new BehaviorSubject<string>(null);
  }

  public static addToken(req : HttpRequest<any>, token : string) {
    return req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(RefreshTokenInterceptorService.addToken(req, this.auth.getJwtToken())).pipe(catchError(error  => {
      if (error instanceof HttpErrorResponse) {
        const err = <HttpErrorResponse>error;
        switch(err.status) {
          case 401:
            return this.handleUnauthorized(req, next);

          case 403:
            this.logout();
            console.warn('Logged out..!');
            location.reload(true);
            return throwError(error);

          default:
            console.warn('JWT interception error!');
            return throwError(error);
        }
      }
    }));
  }

  public handleUnauthorized(req : HttpRequest<any>, next : HttpHandler) {
    if(!this.isRefreshingToken) {
      this.tokenSubject.next(null);
      this.isRefreshingToken = true;

      return this.auth.refresh().pipe(flatMap((res : TokenReply, idx) => {
        this.auth.updateJwt(res.refreshToken, res.jwtToken, res.jwtExpiresInMinutes);
        this.tokenSubject.next(res.jwtToken);
        return next.handle(RefreshTokenInterceptorService.addToken(req, res.jwtToken));
      }), catchError(error => {
        console.warn('Unable to refresh authentication token:');
        console.warn(error.toString());

        this.isRefreshingToken =  false;
        return next.handle(req);
      }), finalize(() => {
        this.isRefreshingToken = false;
      }));
    } else {
      return this.tokenSubject.pipe(filter(token => token != null),
        take(1),switchMap(token => {
          return next.handle(RefreshTokenInterceptorService.addToken(req, token));
        }));
    }
  }

  private logout() {
    this.auth.resetLogin();
    //this.router.navigate(['login']);
  }
}
