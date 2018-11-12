/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Profile, User, UserRoles} from '../models/user.model';
import {environment} from '../../environments/environment';
import {UserRegistration} from '../models/user-registration.model';
import {Status} from '../models/status.model';
import {map} from 'rxjs/operators';

@Injectable()
export class AccountService {
  private readonly options : any;

  constructor(private http : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  public getUser() {
    return this.http.get<User>(environment.authApiHost + '/accounts/show').pipe(map(value => {
      const raw = value.registeredAt as any;
      value.registeredAt = new Date(Date.parse(raw as string));
      return value;
    }));
  }

  public updateUser(user : Profile) {
    const profile = {
      "FirstName" : user.firstName,
      "LastName" : user.lastName,
      "Password" : user.newPassword,
      "CurrentPassword" : user.currentPassword
    };

    return this.http.patch(environment.authApiHost + '/accounts/update', profile, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public resetPassword(email : string) {
    const data = {
      "Email" : email
    };

    return this.http.post(environment.authApiHost + '/accounts/forgot-password', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public confirmResetPassword(email : string, token : string, newpass : string) {
    const data = {
      "Email" : email,
      "Password" : newpass,
      "Token" : token
    };

    return this.http.post(environment.authApiHost + '/accounts/reset-password', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public register(user : UserRegistration, forward : string) {
    const data = {
      "Email" : user.email,
      "Password" : user.password,
      "FirstName" : user.firstName,
      "LastName": user.lastName,
      "PhoneNumber" : user.phoneNumber,
      "ForwardTo": forward
    };

    return this.http.post(environment.authApiHost + '/accounts/register', data, this.options);
  }

  public updateEmail(newMail : string) {
    const data = {
      "NewEmail" : newMail
    };

    return this.http.post(environment.authApiHost + '/accounts/update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
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
      this.http.get<Status>(environment.authApiHost + '/accounts/confirm-phone-number/' + token, this.options)
        .toPromise().then(() => {
          localStorage.setItem('phone-confirmed', 'true');
          resolve();
      }, msg => {
          reject(msg);
      })
    });
  }

  public updatePhoneNumber(phonenumber: string) {
    const data = {
      "PhoneNumber": phonenumber
    };

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

  public checkAndStoreRoles() : void {
    this.http.get<UserRoles>(environment.authApiHost + '/accounts/roles').subscribe(value => {
      localStorage.setItem('roles', JSON.stringify(value));

      if(value.roles.indexOf('Administrators') >= 0)
        localStorage.setItem('admin', 'true');
    });
  }

  public static isAdmin() : boolean {
    const value = localStorage.getItem('admin');

    if(!value)
      return false;

    return value === 'true';
  }

  public checkPhoneConfirmed() : void {
    this.rawCheckPhoneConfirmed().pipe(map(res => {
      if(res.body.errorCode != 200)
        return 'false';

      return res.body.message;
    })).subscribe(res => {
      localStorage.setItem('phone-confirmed', res.toString());
    });
  }

  public rawCheckPhoneConfirmed() {
    return this.http.get<Status>(environment.authApiHost + '/accounts/phone-confirmed', {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
