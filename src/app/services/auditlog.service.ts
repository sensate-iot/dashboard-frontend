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
  public constructor(private readonly http: HttpClient) {
  }

  public getLogs(method: RequestMethod, limit: number, skip: number) {
    const url = `${environment.authApiHost}/auditlogs?method=${method}&limit=${limit}&skip=${skip}`;
    return this.http.get<AuditLog[]>(url);
  }

  public countAll(method: RequestMethod) {
    const url = `${environment.authApiHost}/auditlogs?method=${method}&count=true`;
    return this.http.get(url);
  }

  public findLogs(method: RequestMethod, mail: string, query: string) {
    let url: string;

    if(mail === '') {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&query=${query}`;
    } else if(query === '') {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&email=${mail}`;
    } else {
      url = `${environment.authApiHost}/auditlogs/find?method=${method}&query=${query}&email=${mail}`;
    }

    return this.http.get<PaginationResult<AuditLog>>(url);
  }
}
