/*
 * Lock services to provide the locked screen page.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import * as bcrypt from "bcryptjs";
//import bcrypt  = require('bcryptjs');

@Injectable()
export class LockService {

  constructor() { }

  public static createLock(user : string, pw : string) {
    const lock = new Lock();

    lock.isLocked = false;
    lock.email = user;

    bcrypt.hash(pw, 10, (err, hash) => {
      lock.password = hash;
      localStorage.setItem('lock', JSON.stringify(lock));
    });
  }

  public static destroyLock() {
    localStorage.removeItem('lock');
  }

  public lock() {
    const lockObj = this.getLock();

    if(lockObj ==  null)
      return;

    lockObj.isLocked = true;
    localStorage.setItem('lock', JSON.stringify(lockObj));
  }

  public isLocked() {
    const lockObj = this.getLock();

    if(lockObj == null || lockObj == undefined)
      return false;

    return lockObj.isLocked;
  }

  public getEmail() : string {
    const lock = this.getLock();

    if(lock == null)
      return '';

    return lock.email;
  }

  public unlock(pw : string) {
    const lock = this.getLock();

    if(lock == null)
      return;

    if(!lock.isLocked)
      return true;

    if(bcrypt.compareSync(pw, lock.password)) {
      lock.isLocked = false;
      localStorage.setItem('lock', JSON.stringify(lock));
      return true;
    }

    return false;
  }

  private getLock() : Lock {
    const data = localStorage.getItem('lock');

    if(data == null || data == undefined)
      return null;

    return JSON.parse(data, function (key, value) {
      if(value !== '')
        return value;

      let result = new Lock();
      result.isLocked = value.isLocked;
      result.password = value.password;
      result.email = value.email;
      return result;
    });
  }
}

class Lock {
  public isLocked : boolean;
  public password : string;
  public email : string;
}
