import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AccountService} from '../services/account.service';
import {AlertService} from '../services/alert.service';
import {LoginService} from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accounts : AccountService, private msgs: AlertService, private auth: LoginService, private router: Router) {
  }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | Promise<boolean> | boolean {
    if(!this.auth.isLoggedIn()) {
      this.router.navigate(['login']);
      this.msgs.showNotification('Administrative rights required!', 'top-center', 'warning');
      return false;
    }

    return new Promise<boolean>(resolve => {
      this.accounts.getRoles().subscribe(value => {
        if(value.roles.indexOf('Administrators') >= 0) {
          resolve(true);
        } else {
          this.msgs.showNotification('Administrative rights required!', 'top-center', 'warning');
          resolve(false);
        }
      })
    });
  }
}
