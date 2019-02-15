import { Component, OnInit } from '@angular/core';
import {RoleUpdate, User} from '../../models/user.model';
import {AdminService} from '../../services/admin.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  public users : User[];
  public form : FormGroup;
  public controls : FormControl[];
  public actionControl : FormControl;

  public searchFieldValue : string;

  constructor(private admin : AdminService, private builder : FormBuilder) {
    this.form = new FormGroup({});
  }

  public ngOnInit() : void {
    this.users = [];
    this.admin.getRecentUsers().subscribe(value => {
      this.setUserData(value);
    });

    this.actionControl = new FormControl('', [
      Validators.required
    ]);
    this.form.addControl('action', this.actionControl);
  }

  private setUserData(users : User[]) {
    const controls = users.map(c => new FormControl(false));
    this.controls = controls;
    this.form.addControl('users', new FormArray(controls));

    this.users = users;
  }

  public onSearchClicked() {
    if(this.searchFieldValue == undefined)
      return;

    this.admin.findUsers(this.searchFieldValue).subscribe(value => {
      console.log(value.length);
      this.form.removeControl('users');
      this.setUserData(value);
    });
  }

  public onSubmitClicked() {
    const selectedIds = this.form.value.users.map((v, i) => v ? i : null)
      .filter(v => v !== null);

    console.log('Action: ' + this.actionControl.value.toString());

    let objs : RoleUpdate[] = [];

    selectedIds.forEach(value => {
      const user = this.users[value];
      let update = new RoleUpdate();

      update.UserId = user.id;

      switch(this.actionControl.value.toString()) {
        case "admin":
          update.Role = "Users,Administrators";
          break;

        case "normal":
          update.Role = "Users";
          break;

        case "ban":
          update.Role = "Banned";
          break;
      }

      objs.push(update);
    });

    console.log(JSON.stringify(objs));
  }
}
