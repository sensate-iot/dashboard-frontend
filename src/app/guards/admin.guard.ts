import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from '../services/account.service';
import {AlertService} from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accounts : AccountService, private msgs: AlertService) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    this.accounts.checkAndStoreRoles();

    if(!AccountService.isAdmin()) {
      this.msgs.showNotification('Administrative rights required!', 'top-center', 'warning');
      return false;
    }

    return true;
  }
}
