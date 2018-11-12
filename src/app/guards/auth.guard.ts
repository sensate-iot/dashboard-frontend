/*
 * Authentication auth guard.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LoginService} from '../services/login.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(public auth : LoginService, public router : Router) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    if(this.auth.isLoggedIn()) {
      return true;
    }

    /* applicataion is not logged in, navigate to the login page */
    this.router.navigate(['login']);
    return false;
  }
}
