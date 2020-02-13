import {Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Trigger, TriggerAction, TriggerActionChannel} from '../../models/trigger.model';
import {TriggerService} from '../../services/trigger.service';
import {AlertService} from '../../services/alert.service';

export interface IShowActions {
  trigger: Trigger;
}

@Component({
  selector: 'show-actions-dialog',
  templateUrl: './show-actions.dialog.html',
  styleUrls: ['./sensor-detail.component.css']
})
export class ShowActionsDialog {
  public actionMap : Map<TriggerActionChannel, string>;

  constructor(public ref: MatDialogRef<ShowActionsDialog>, @Inject(MAT_DIALOG_DATA) public data: IShowActions,
              private alertService: AlertService,
              private triggerService: TriggerService) {
    this.actionMap = new Map<TriggerActionChannel, string>();

    this.actionMap.set(TriggerActionChannel.Email, "Email");
    this.actionMap.set(TriggerActionChannel.SMS, "SMS");
    this.actionMap.set(TriggerActionChannel.MQTT, "MQTT");
    this.actionMap.set(TriggerActionChannel.HttpPost, "HttpPost");
    this.actionMap.set(TriggerActionChannel.HttpGet, "HttpGet");
    this.actionMap.set(TriggerActionChannel.ControlMessage, "ControlMessage");
  }

  public onCancelClick() {
    this.ref.close();
  }

  public removeAction(index: number) {
    const action = this.data.trigger.actions[index];

    if(action === null) {
      return null;
    }

    this.triggerService.removeAction(this.data.trigger, action).subscribe(() => {
      this.alertService.showSuccessNotification("Action removed!");

      const actions = new Array<TriggerAction>();
      this.data.trigger.actions.forEach((a) => {
        if(action.channel === a.channel) {
          return;
        }

        actions.push(a);
      });

      this.data.trigger.actions = actions;
    }, (error) => {
      this.alertService.showErrorNotification("Unable to remove action!");
    });
  }
}
