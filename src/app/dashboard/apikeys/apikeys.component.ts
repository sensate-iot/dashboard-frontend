/*
 * API key administration form.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import {Component, Inject, OnInit} from '@angular/core';
import {ApiKey, ApiKeyType} from '../../models/apikey.model';
import {ApiKeyService} from '../../services/apikey.service';
import {AlertService} from '../../services/alert.service';
import {FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-apikeys',
  templateUrl: './apikeys.component.html',
  styleUrls: ['./apikeys.component.css']
})
export class ApikeysComponent implements OnInit {
  public searchFieldValue : string;
  private allKeys : ApiKey[];
  public apiKeys : ApiKey[];

  public form : FormGroup;
  public action : string;

  constructor(private keys : ApiKeyService, private alerts : AlertService, private dialog: MatDialog) {
    this.form = new FormGroup({});
  }

  ngOnInit() {
    this.keys.getAllKeys().subscribe(keys => {
      this.apiKeys = keys;
      this.allKeys = keys;
    }, error => {
      this.apiKeys = [];
      this.alerts.showNotification('Unable to fetch API keys!', 'top-center', 'warning');
    });
  }

  public onSearchClicked() {
    const query = this.searchFieldValue;
    const keys : ApiKey[] = [];

    this.apiKeys.forEach(key => {
      if(key.name.toLowerCase().includes(query.toLowerCase()))
        keys.push(key);
    });

    this.apiKeys = keys;
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
    let keys : ApiKey[] = [];

    switch(this.action) {
      case "no-sys":
        this.apiKeys.forEach(key => {
          if(key.type != ApiKeyType.SystemKey)
            keys.push(key);
        });
        break;

      case "no-sensors":
        this.apiKeys.forEach(key => {
          if(key.type != ApiKeyType.SensorKey)
            keys.push(key);
        });
        break;

      case "no-user":
        this.apiKeys.forEach(key => {
          if(key.type != ApiKeyType.ApiKey)
            keys.push(key);
        });
        break;

      case "no-rev":
        this.apiKeys.forEach(key => {
          if(!key.revoked)
            keys.push(key);
        });
        break;

      case "create":
        this.createNewKeyClicked();
        keys = this.apiKeys;
        break;

      case "all":
      default:
        keys = this.allKeys;
        break;
    }

    this.apiKeys = keys;
  }

  public onRevokeClicked(idx : number) {
    const key = this.apiKeys[idx];

    this.keys.revoke(key.id).subscribe(() => {
      key.revoked = true;
    }, error => {
      console.debug("Unable to revoke key:" + error);
      this.alerts.showNotification('Unable to revoke API key!', 'top-center', 'danger');
    });
  }

  public onShowClicked(num : number) {
    const key = this.apiKeys[num];
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
      data: data
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
