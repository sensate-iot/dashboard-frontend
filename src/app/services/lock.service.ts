/*
 * Lock services to provide the locked screen page.
 *
 * @author Michel Megens
 * @email  dev@bietje.net
 */

import { Injectable } from '@angular/core';
import * as scrypt from 'scrypt-js';
import {Guid} from 'guid-typescript';
//import * as bcryptfrom 'bcryptjs';

@Injectable()
export class LockService {

  private static n = 1024;
  private static rounds = 8;
  private static  p = 1;
  private static dklength = 32;

  constructor() { }

  private static randomString() {
    let ary = new Uint8Array(64);
    return crypto.getRandomValues(ary);
  }

  private static salt = LockService.randomString();
  private static verifier = Guid.create().toString();

  private static encrypt(data : string) {
    let enc = new TextEncoder();
    const password = enc.encode(data);

    return new Promise(((resolve, reject) => {
      scrypt(password, LockService.salt, LockService.n, LockService.rounds, LockService.p,
        LockService.dklength, (err, progress, key) => {
          if(err) {
            console.warn('Unable to compute hash: ' + err);
            reject(err);
          } else if(key) {
            const ary = Array.from(new Uint8Array(key));
            const pw = ary.map(b => ('00' + b.toString(16)).slice(-2)).join('');

            resolve(pw);
          }
        });
    }));
  }

  public static createLock(user : string, pw : string) {
    const lock = new Lock();

    lock.isLocked = false;
    lock.email = user;
    lock.verify = LockService.verifier;

    let enc = new TextEncoder();
    const password = enc.encode(pw);

    LockService.encrypt(pw).then((value) => {
      lock.password = value.toString();
      localStorage.setItem('lock', JSON.stringify(lock));
    }, (error) => {
      console.warn('Unable to encrypt password!');

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

    if(lockObj == null)
      return false;

    return lockObj.isLocked;
  }

  public isValid() {
    const lockObj = this.getLock();

    if(lockObj == null)
      return false;

    return lockObj.verify === LockService.verifier;
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
      return Promise.reject();

    if(!lock.isLocked)
      return Promise.reject();

    return new Promise((resolve, reject) => {
      LockService.encrypt(pw).then((value) => {
        const val = value.toString();

        if(val === lock.password) {
          lock.isLocked = false;
          localStorage.setItem('lock', JSON.stringify(lock));
          resolve();
        }


        reject();
      }, (error) => {
        console.warn('Unable to encrypt password!');
        reject();
      });
    });
  }

  private getLock() : Lock {
    const data = localStorage.getItem('lock');

    if(data == null)
      return null;

    return JSON.parse(data, function (key, value) {
      if(value !== '')
        return value;

      let result = new Lock();
      result.isLocked = value.isLocked;
      result.password = value.password;
      result.email = value.email;
      result.verify = value.verify;
      return result;
    });
  }
}

class Lock {
  public isLocked : boolean;
  public password : string;
  public email : string;
  public verify : string;
}
