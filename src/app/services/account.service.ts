/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Profile, RoleUpdate, User, UserRoles} from '../models/user.model';
import {environment} from '../../environments/environment';
import {Status} from '../models/status.model';
import {map} from 'rxjs/operators';

@Injectable()
export class AccountService {
  private readonly options : any;

  public constructor(private http : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public getUser() {
    return this.http.get<User>(environment.authApiHost + '/accounts').pipe(map(value => {
      const raw = value.registeredAt as any;
      value.registeredAt = new Date(Date.parse(raw as string));
      return value;
    }));
  }

  public getAllUsers() {
    return this.http.get<string[]>(environment.authApiHost + '/accounts/list');
  }

  public updateUser(user : Profile) {
    const profile = {
      "FirstName" : user.firstName,
      "LastName" : user.lastName,
      "Password" : user.newPassword,
      "CurrentPassword" : user.currentPassword
    };

    return this.http.patch(environment.authApiHost + '/accounts', profile, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public updateRoles(updates : RoleUpdate[]) {
    if(updates == null)
      return;

    const data = JSON.stringify(updates);
    return this.http.patch(environment.authApiHost + '/accounts/roles', data, this.options);
  }

  public updateEmail(newMail : string) {
    const data = {
      "NewEmail" : newMail
    };

    return this.http.post(environment.authApiHost + '/accounts/update-email', data );
  }

  public confirmUpdateEmail(token : string) {
    const data = {
      "Token" : token
    };

    return this.http.post(environment.authApiHost + '/accounts/confirm-update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public confirmPhoneNumber(token: string) {
    return new Promise((resolve, reject) => {
      this.http.get<Status>(environment.authApiHost + '/accounts/confirm-phone-number/' + token, {
        observe: 'response',
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }).toPromise().then(() => {
          localStorage.setItem('phone-confirmed', 'true');
          resolve('');
      }, msg => {
          reject(msg);
      })
    });
  }

  public updatePhoneNumber(phonenumber: string) {
    const data = {
      "PhoneNumber": phonenumber
    };

    localStorage.removeItem('phone-confirmed');
    return this.http.patch(environment.authApiHost + '/accounts/update-phone-number', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public static phoneIsConfirmed() : boolean {
    const confirmed = localStorage.getItem('phone-confirmed');

    if(confirmed == null)
      return false;

    return confirmed == 'true';
  }

  public checkAndStoreRoles() {
    return new Promise<void>((resolve, reject) => {
      if(AccountService.hasLocalRoles()) {
        resolve();
        return;
      }

      this.http.get<UserRoles>(environment.authApiHost + '/accounts/roles').subscribe(value => {
        localStorage.setItem('roles', JSON.stringify(value));

        if(value.roles.indexOf('Administrators') >= 0) {
          localStorage.setItem('admin', 'true');
        }

        resolve();
      }, () => {
        resolve();
      });
    });
  }

  private static hasLocalRoles() {
    const roles = localStorage.getItem('roles');
    const admin = localStorage.getItem('admin');

    if(roles == null) {
      return false;
    }

    if(value.roles.indexOf('Administrators') >= 0) {
      localStorage.setItem('admin', 'true');
    }

    return true;
  }

  public static isAdmin() : boolean {
    const value = localStorage.getItem('admin');

    if(!value) {
      return false;
    }

    return value === 'true';
  }

  public deleteUser() {
    return this.http.delete(`${environment.authApiHost}/accounts`)
  }

  public checkPhoneConfirmed() {
    return new Promise<boolean>(resolve => {
        const confirm = localStorage.getItem('phone-confirmed');

        if (confirm != null) {
          resolve(confirm == 'true');
          return;
        }

        this.rawCheckPhoneConfirmed().pipe(map(res => {
          if (res.errorCode != 200)
            return 'false';

          return res.message;
        })).subscribe(res => {
          localStorage.setItem('phone-confirmed', res.toString());
          resolve(res.toString() === 'true');
        }, () => {
          resolve(true);
        });
      }
    );
  }

  private rawCheckPhoneConfirmed() {
    return this.http.get<Status>(environment.authApiHost + '/accounts/phone-confirmed');
  }
}
