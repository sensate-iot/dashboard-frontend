/*
 * Refresh token interceptor service: a service to
 * refresh JWT tokens transparently in the background.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Rx';
import {LoginService} from './login.service';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class RefreshTokenInterceptorService implements HttpInterceptor {
  private isRefreshingToken : boolean;
  private tokenSubject : BehaviorSubject<string>;

  constructor(private auth : LoginService) {
    this.isRefreshingToken = false;
    this.tokenSubject = new BehaviorSubject<string>(null);
  }

  public addToken(req : HttpRequest<any>, token : string) {
    if(!this.auth.isLoggedIn())
      return req;

    console.log('Adding JWT token to request!');
    return req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + token,
        'Cache-Control': 'no-cache'
      }
    });
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addToken(req, this.auth.getJwtToken())).catch(error => {
      if (error instanceof HttpErrorResponse) {
        const err = <HttpErrorResponse>error;
        switch(err.status) {
          case 401:
            return this.handleUnauthorized(req, next);

          default:
            return Observable.throw(error);
        }
      }
    });
  }

  public handleUnauthorized(req : HttpRequest<any>, next : HttpHandler) {
    if(!this.isRefreshingToken) {
      this.tokenSubject.next(null);
      this.isRefreshingToken = true;

      return this.auth.refresh().switchMap((newToken : string) => {
        if(newToken) {
          this.tokenSubject.next(newToken);
          return next.handle(this.addToken(req, newToken));
        }

        return this.logout();
      }).catch(error => {
        return this.logout();
      }).finally(() => {
        this.isRefreshingToken = false;
      });
    } else {
      return this.tokenSubject.filter(token => token != null)
        .take(1).switchMap(token => {
          return next.handle(this.addToken(req, token));
        });
    }
  }

  private logout() {
    return Observable.throw("");
  }
}
