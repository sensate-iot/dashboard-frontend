/*
 * User account API services.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user.model';
import {environment} from '../../environments/environment';

@Injectable()
export class AccountService {
  constructor(private http : HttpClient) { }

  getUser() {
    return this.http.get<User>(environment.apiHost + '/accounts/show');
  }
}
