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

@Injectable()
export class AccountService {
  constructor(private http : HttpClient) { }

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

  updateEmail(newMail : string) {
    const data = {
      "NewEmail" : newMail
    };

    return this.http.post(environment.apiHost + '/accounts/update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  confirmUpdateEmail(token : string) {
    const data = {
      "Token" : token
    };

    return this.http.post(environment.apiHost + '/accounts/confirm-update-email', data, {
      observe: 'response',
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
