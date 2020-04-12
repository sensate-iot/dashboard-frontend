import {Component, OnInit, ViewChild} from '@angular/core';
import {AuditLog, RequestMethod} from '../../../models/auditlog.model';
import {AuditlogService} from '../../../services/auditlog.service';
import {AlertService} from '../../../services/alert.service';
import {FormControl} from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';

interface MethodValue {
  method: RequestMethod;
  value: string;
}

@Component({
  selector: 'app-auditlog',
  templateUrl: './auditlog.component.html',
  styleUrls: ['./auditlog.component.css']
})
export class AuditlogComponent implements OnInit {
  public logs: AuditLog[];
  public allLogs: AuditLog[];

  public displayCols = ['method', 'route', 'address', 'email', 'timestamp'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public methods : MethodValue[] = [
    { method: RequestMethod.Any, value: "None"},
    { method: RequestMethod.HttpGet, value: "GET"},
    { method: RequestMethod.HttpPost, value: "POST"},
    { method: RequestMethod.HttpPut, value: "PUT"},
    { method: RequestMethod.HttpPatch, value: "PATCH"},
    { method: RequestMethod.HttpDelete, value: "DELETE"},
    { method: RequestMethod.MqttTcp, value: "MQTT (TCP)"},
    { method: RequestMethod.MqttWebSocket, value: "MQTT (web socket)"},
    { method: RequestMethod.WebSocket, value: "Web sockets"},
  ];

  public pageOptions =  [10,25,100,200];
  public pageSize: number;
  public length: number;
  private pageIndex: number;

  public methodSelectControl: FormControl;

  private searchQuery: boolean;
  public methodValue: RequestMethod;
  public searchFieldValue: string;
  public emailFieldValue: string;

  public constructor(private readonly logService: AuditlogService, private readonly notifs: AlertService) {
    this.logs = [];
    this.length = 0;
    this.pageSize = 25;
    this.searchFieldValue = "";
    this.methodValue = RequestMethod.Any;
    this.searchQuery = false;
    this.pageIndex = 0;
  }

  private shouldUseSearch() {
    this.searchQuery = (this.searchFieldValue !== '' && this.searchFieldValue !== undefined) ||
      (this.emailFieldValue !== '' && this.emailFieldValue !== undefined);
  }

  public createForms() {
    this.methodSelectControl = new FormControl();
    this.methodSelectControl.valueChanges.subscribe((value: RequestMethod) => {
      this.methodValue = value;
      this.paginator.pageIndex = 0;
      this.shouldUseSearch();

      this.fetchLogs();
    });
  }

  private handleFetchError(error: any) {
    console.debug("Unable to load audit logs:");
    console.debug(error);
    this.notifs.showWarninngNotification("Unable to load audit logs!")
  }

  public fetchLogs() {
    const skip = this.pageIndex * this.pageSize;

    if(!this.searchQuery) {
      this.logService.getLogs(this.methodValue, this.pageSize, skip).subscribe(logs => {
        this.logs = logs.values;
        this.length = logs.count;
      }, error => {
        this.handleFetchError(error);
      });
    } else {
      this.logService.findLogs(this.methodValue, this.emailFieldValue, this.searchFieldValue, skip, this.pageSize).subscribe(logs => {
        this.allLogs = logs.values;
        this.length = logs.count;
        this.logs = logs.values.splice(0, this.pageSize);
      }, err => {
        this.handleFetchError(err);
      })
    }
  }

  public ngOnInit() {
    this.createForms();
    this.fetchLogs();
  }

  public paginate(event: any) {
    const skip = event.pageIndex * event.pageSize;

    if(this.pageSize !== event.pageSize && this.paginator !== undefined) {
      this.paginator.firstPage();
    }

    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchLogs();
  }

  public onSearchClicked() {
    this.paginator.firstPage();
    this.shouldUseSearch();
    this.fetchLogs();
  }

  public getDateText(log: AuditLog) {
    return log.timestamp.toUTCString();
  }

  public getUserText(log: AuditLog) {
    if(log === null) {
      return "Anonymous";
    }

    let rv = log.email;

    if(rv === null) {
      rv = 'Anonymous';
    }

    return rv;
  }

  public getMethodText(method: RequestMethod): string {
    switch(method) {
      case RequestMethod.Any:
        return 'Unknown';

      case RequestMethod.HttpDelete:
        return 'HTTP DELETE';

      case RequestMethod.HttpGet:
        return 'HTTP GET';

      case RequestMethod.HttpPatch:
        return 'HTTP PATCH';

      case RequestMethod.HttpPost:
        return 'HTTP POST';

      case RequestMethod.HttpPut:
        return 'HTTP PUT';

      case RequestMethod.MqttWebSocket:
      case RequestMethod.MqttTcp:
        return 'MQTT';


      case RequestMethod.WebSocket:
        return 'WebSocket';
    }
  }
}
