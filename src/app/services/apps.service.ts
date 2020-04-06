/*
 * Application service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable()
export class AppsService {
  public constructor() {
  }

  public forward(app: string, path = '') {
    const base = environment.appsMap[app];

    if(base === null || base === undefined) {
      return;
    }

    window.location.href = `${base}${path}`;
  }
}
