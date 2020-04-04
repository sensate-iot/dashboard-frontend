/*
 * API key administration form.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ApiKey, ApiKeyType} from '../../../models/apikey.model';
import {ApiKeyFilter, ApiKeyService} from '../../../services/apikey.service';
import {AlertService} from '../../../services/alert.service';
import {FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {NoopScrollStrategy} from '@angular/cdk/overlay';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-apikeys',
  templateUrl: './apikeys.component.html',
  styleUrls: ['./apikeys.component.css']
})
export class ApikeysComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public searchFieldValue : string;
  private allKeys : ApiKey[];

  public form : FormGroup;

  public action : string;

  public pageOptions =  [10,25,100,200];
  public pageSize: number;
  public length: number;

  public includeRevoked: boolean;

  public typeControl: FormControl;
  public keyTypes = [ApiKeyType.SensorKey, ApiKeyType.ApiKey, ApiKeyType.SystemKey];
  public selectedKeyTypes: ApiKeyType[];

  public constructor(private keys : ApiKeyService, private alerts : AlertService, private dialog: MatDialog) {
    this.form = new FormGroup({});
    this.allKeys = [];
    this.pageSize = this.pageOptions[0];

    this.selectedKeyTypes = [];
    this.typeControl = new FormControl();
    this.typeControl.setValue([]);
    this.includeRevoked = false;
  }

  public ngOnInit() {
    this.paginate();
  }

  public getTopValue() {
    const values = this.typeControl.value as ApiKeyType[];

    if(values === null || values === undefined || values.length <= 0) {
      return '';
    }

    const top = values[0];

    if(top === null || top === undefined) {
      return '';
    }

    return this.getKeyTypeString(top);
  }

  public getKeyTypeString(type: ApiKeyType) {
    switch(type) {
      case ApiKeyType.ApiKey:
        return "API key";

      case ApiKeyType.SystemKey:
        return "System key";

      case ApiKeyType.SensorKey:
        return "Sensor key";
    }
  }

  public onPaginate(event: any) {
    this.pageSize = event.pageSize;
    this.paginate();
  }

  public onIncludeRevokeClicked() {
    this.paginator.firstPage();
    this.includeRevoked = !this.includeRevoked;
    this.paginate();
  }

  public paginate() {
    const filter: ApiKeyFilter = {
      skip: this.paginator?.pageIndex * this.pageSize,
      limit: this.pageSize,
      types: this.typeControl.value,
      query: this.searchFieldValue,
      includeRevoked: this.includeRevoked
    };

    this.keys.filter(filter).subscribe(result => {
      this.length = result.count;
      this.allKeys = result.values;
    }, error => {
      this.alerts.showWarninngNotification("Unable to fetch API keys!");
    });
  }

  public onSearchClicked() {
    this.paginator.firstPage();
    this.paginate();
  }

  private copyMessage(val: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  public onSubmitClicked() {
    this.paginator.firstPage();
    this.paginate();
  }

  public onRevokeClicked(idx : number) {
    const key = this.allKeys[idx];

    this.keys.revoke(key.id).subscribe(() => {
      key.revoked = true;
    }, error => {
      console.debug("Unable to revoke key:" + error);
      this.alerts.showNotification('Unable to revoke API key!', 'top-center', 'danger');
    });
  }

  public onShowClicked(num : number) {
    const key = this.allKeys[num];
    this.copyMessage(key.apiKey);
    this.alerts.showNotification('API key copied to clipboard!', 'top-center', 'success');
  }

  public createNewKeyClicked() {
    console.debug("Creating new API key..");
    const data = {
      name: "",
      readOnly: false
    };

    const dialog = this.dialog.open(CreateApiKeyDialog, {
      width: '250px',
      height: '250px',
      data: data,
      scrollStrategy: new NoopScrollStrategy()
    });

    const sub = dialog.afterClosed().subscribe((result : ICreateApiKey) => {
      this.keys.create(result.name, result.readOnly).subscribe(key => {
        console.debug(key);
        this.allKeys.push(key);
        sub.unsubscribe();
        this.alerts.showNotification('API key has been created!', 'top-center', 'success');
      }, error => {
        console.debug('Failed to create API key: ' + error.toString());
        this.alerts.showNotification('Unable to create API key!', 'top-center', 'danger');
        sub.unsubscribe();
      })
    });
  }
}

export interface ICreateApiKey {
  name : string;
  readOnly : boolean;
}

@Component({
    selector: 'create-apikey-dialog',
    templateUrl: './apikeys.dialog.html'
})
export class CreateApiKeyDialog {
  constructor(public ref: MatDialogRef<CreateApiKeyDialog>, @Inject(MAT_DIALOG_DATA) public data: ICreateApiKey ) {
  }

  public onCancelClick() {
    this.ref.close();
  }

}
