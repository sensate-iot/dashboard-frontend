import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LockService} from '../services/lock.service';
import {LoginService} from '../services/login.service';
import {AppsService} from '../services/apps.service';

@Injectable()
export class LockGuard implements CanActivate {
  constructor(private lock : LockService, private auth : LoginService, private apps: AppsService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    if(this.lock.isLocked()) {
      if(!this.lock.isValid()) {
        this.auth.logout().then(() => {
          this.apps.forward('login');
        });
        return true;
      }

      this.router.navigate(['lock']);
      return false;
    }

    return true;
  }
}
