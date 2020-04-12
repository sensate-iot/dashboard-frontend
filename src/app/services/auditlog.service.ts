/*
 * Audit logging service.
 *
 * @author Michel Megens
 * @email  michel@michelmegens.net
 */

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {AuditLog, RequestMethod} from '../models/auditlog.model';
import {PaginationResult} from '../models/paginationresult.model';

@Injectable()
export class AuditlogService {
  public constructor(private readonly http: HttpClient) { }

  public getLogs(method: RequestMethod, limit: number, skip: number) {
    const url = `${environment.authApiHost}/auditlogs?method=${method}&limit=${limit}&skip=${skip}`;
    return this.http.get<PaginationResult<AuditLog>>(url);
  }

  public findLogs(method: RequestMethod, mail: string, query: string, skip = 0, limit = 0) {
    let url: string;

    mail = encodeURIComponent(mail);
    query = encodeURIComponent(query);

    if(mail === null || mail === undefined || mail === '' || mail === 'undefined') {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&query=${query}&skip=${skip}&limit=${limit}`;
    } else if(query === null || query === undefined || query === '' || query === 'undefined') {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&email=${mail}&skip=${skip}&limit=${limit}`;
    } else {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&query=${query}&email=${mail}&skip=${skip}&limit=${limit}`;
    }

    return this.http.get<PaginationResult<AuditLog>>(url);
  }
}
