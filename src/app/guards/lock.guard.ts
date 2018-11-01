import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {LockService} from '../services/lock.service';

@Injectable()
export class LockGuard implements CanActivate {
  constructor(private lock : LockService, private router : Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean> | Promise<boolean> | boolean {
    if(this.lock.isLocked()) {
      this.router.navigate(['lock']);
      return false;
    }

    return true;
  }
}
