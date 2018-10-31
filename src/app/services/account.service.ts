/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Profile, User} from '../models/user.model';
import {environment} from '../../environments/environment';
import {UserRegistration} from '../models/user-registration.model';
import {Status} from '../models/status.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AccountService {
  private readonly options : any;

  constructor(private http : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  getUser() {
    return this.http.get<User>(environment.authApiHost + '/accounts/show');
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

  public register(user : UserRegistration) {
    const data = {
      "Email" : user.email,
      "Password" : user.password,
      "FirstName" : user.firstName,
      "LastName": user.lastName,
      "PhoneNumber" : user.phoneNumber
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
    let promise = new Promise((resolve, reject) => {
      this.http.get<Status>(environment.authApiHost + '/accounts/confirm-phone-number/' + token, this.options)
        .toPromise().then(() => {
          localStorage.setItem('phone-confirmed', 'true');
          resolve();
      }, msg => {
          reject(msg);
      })
    });

    return promise;
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

  public checkPhoneConfirmed() : void {
    this.http.get<Status>(environment.authApiHost + '/accounts/phone-confirmed', {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }).map(res => {
      if(res.body.errorCode != 200)
        return 'false';

      return res.body.message;
    }).subscribe(res => {
      localStorage.setItem('phone-confirmed', res.toString());
    });
  }
}
