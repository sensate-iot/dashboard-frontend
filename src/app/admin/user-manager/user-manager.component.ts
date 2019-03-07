import { Component, OnInit } from '@angular/core';
import {RoleUpdate, User} from '../../models/user.model';
import {AdminService} from '../../services/admin.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../services/account.service';
import {AlertService} from '../../services/alert.service';

interface RoleIconMap {
  [role:string] : string;
}

class UserData extends User {
  constructor(user : User, icon : string) {
    super();

    this.roles = user.roles;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.id = user.id;
    this.registeredAt = user.registeredAt;
    this.phoneNumber = user.phoneNumber;
    this.icon = icon;
  }

  icon : string;
}

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {
  public users : UserData[];
  public form : FormGroup;
  public controls : FormControl[];
  public actionControl : FormControl;
  public searchFieldValue : string;

  private readonly roleIcons : RoleIconMap;

  constructor(private admin : AdminService, private accounts : AccountService, private alerts : AlertService, private builder : FormBuilder) {
    this.form = new FormGroup({});

    this.roleIcons = {};
    this.roleIcons['Users'] = 'person_outline';
    this.roleIcons['Administrators'] = 'grade';
    this.roleIcons['Banned'] = 'lock';
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

    this.users = users.map(user => new UserData(user, this.userToIcon(user)));
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
    const selectedIds = this.form.value.users.map((v, i) => v ? i : null).filter(v => v !== null);
    console.debug('Action: ' + this.actionControl.value.toString());

    let objs : RoleUpdate[] = [];

    selectedIds.forEach(value => {
      const user = this.users[value];
      let update = new RoleUpdate();

      update.UserId = user.id;

      switch(this.actionControl.value.toString()) {
        case 'admin':
          update.Role = 'Users,Administrators';
          user.roles = ['Users', 'Administrators'];
          break;

        case 'normal':
          update.Role = 'Users';
          user.roles = ['Users'];
          break;

        case 'ban':
          update.Role = 'Banned';
          user.roles = ['Banned'];
          break;
      }

      user.icon = this.userToIcon(user);
      objs.push(update);
    });

    this.accounts.updateRoles(objs).subscribe(() => {
      this.alerts.showNotification('User roles have been updated!', 'top-center', 'success');

      const control : FormArray = <FormArray> this.form.controls['users'];
      control.controls.forEach(v => v.setValue(false));
    }, error => {
      this.alerts.showNotification('Unable to update user roles!', 'top-center', 'warning');
      console.debug(error);
    });

    console.log(JSON.stringify(objs));
  }

  public userToIcon(user : User) : string {
    const admin = 'Administrators';
    const users = 'Users';
    const banned = 'Banned';

    if(user.roles.includes(admin))
      return this.roleIcons[admin];
    else if(user.roles.includes(users))
      return this.roleIcons[users];

    return this.roleIcons[banned];
  }
}
