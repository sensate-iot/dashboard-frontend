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
import {Observable} from 'rxjs/Observable';
import {Status} from '../models/status.model';

@Injectable()
export class AccountService {
  private options : any;

  constructor(private http : HttpClient) {
    this.options = {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
  }

  getUser() {
    return this.http.get<User>(environment.apiHost + '/accounts/show');
  }

  public updateUser(user : Profile) {
    const profile = {
      "FirstName" : user.firstName,
      "LastName" : user.lastName,
      "PhoneNumber" : user.phoneNumber,
      "Password" : user.newPassword,
      "CurrentPassword" : user.currentPassword
    };

    return this.http.patch(environment.apiHost + '/accounts/update', profile, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public resetPassword(email : string) {
    const data = {
      "Email" : email
    };

    return this.http.post(environment.apiHost + '/accounts/forgot-password', data, {
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

    return this.http.post(environment.apiHost + '/accounts/reset-password', data, {
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

    return this.http.post(environment.apiHost + '/accounts/register', data, this.options);
  }

  public updateEmail(newMail : string) {
    const data = {
      "NewEmail" : newMail
    };

    return this.http.post(environment.apiHost + '/accounts/update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public confirmUpdateEmail(token : string) {
    const data = {
      "Token" : token
    };

    return this.http.post(environment.apiHost + '/accounts/confirm-update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  public confirmPhoneNumber(token: string) {
    const data = {
      "Token" : token
    };

    return this.http.post(environment.apiHost + '/accounts/confirm-phone-number', data, {
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
    this.http.get<Status>(environment.apiHost + '/accounts/phone-confirmed', {
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
